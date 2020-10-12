<template>
  <div class="code-editor">
    <codemirror
      ref="editor"
      v-model="code"
      v-bind="curProps"
      :options="curOptions"
      @ready="onCodemirrorReady('editor', ...arguments)"
      @contextmenu="onContextMenu"
    />
    <button
      class="magnify-btn"
      @click="visible = true"
    >
    <i
      v-if="sizeable"
      mode="button"
      class=" iconfont icon-fangda"
    />
    </button>
    <editor-mask
      v-if="sizeable"
      :visible.sync="visible"
      v-bind="curMaskProps"
      class="code-editor-mask"
    >
      <button
        class="minimize-btn"
        @click="visible = false"
      >
        <i
          mode="button"
          class="iconfont icon-suoxiao"
        />
      </button>
      <codemirror
        ref="maskEditor"
        v-model="code"
        v-bind="curProps"
        :options="maskOptions"
        @ready="onCodemirrorReady('maskEditor', ...arguments)"
        @contextmenu="onContextMenu"
      />
    </editor-mask>
    <e-vue-contextmenu
      ref="menu"
      :style="{'z-index': zIndex}"
      class="custom-context-menu"
    >
      <slot>
        <li
          v-for="(item, index) in curContextOptions"
          :key="index"
        >
          <a
            href="javascript:;"
            @click.prevent="handleSelectMenu(item)"
          >{{ item.label }}</a>
        </li>
      </slot>
    </e-vue-contextmenu>
  </div>
</template>
<script>
import Vue from 'vue';
import VueCodemirror from 'vue-codemirror';
import EVueContextmenu from 'e-vue-contextmenu';
import sqlFormatter from 'sql-formatter';
// import { Mask, Icon } from '@gs-ui/gs-ui';
import EditorMask from './mask/mask.vue';
import './_utils/index';
// import { Parser } from 'node-sql-parser';
// import { parser } from 'dt-sql-parser';

Vue.use(VueCodemirror);
// Vue.use(Mask);
// Vue.use(Icon);
Vue.use(EVueContextmenu);
Vue.use(EditorMask);
// window.sqlLint = parser;
// window.sqlLint = new Parser();

export default {
  name: 'CodeEditor',

  components: {
    // 'vue-context': VueContext
    EditorMask
  },

  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    },
    events: {
      type: Array,
      default: () => (['contextmenu'])
    },
    hintList: {
      type: Object,
      default: () => ({})
    },
    sizeable: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 300000
    },
    sqlLint: {
      type: Boolean,
      default: true
    },
    contextMenu: {
      type: Boolean,
      default: true
    },
    contextAppendToBody: {
      type: Boolean,
      default: false
    },
    contextOptions: {
      type: Array,
      default: null
    },
    selectedContextOptions: {
      type: Array,
      default: null
    },
    formatable: {
      type: Boolean,
      default: true
    },
    commentable: {
      type: Boolean,
      default: true
    },
    formatText: {
      type: String,
      default: '格式化'
    },
    commentText: {
      type: String,
      default: '切换注释'
    },
    lineComment: {
      type: String,
      default: '--'
    },
    props: {
      type: Object,
      default: () => ({})
    },
    hintProps: {
      type: Object,
      default: () => ({})
    },
    /* contextProps: {
      type: Object,
      default: () => ({})
    }, */
    maskProps: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      code: this.value,
      selection: undefined,
      visible: false,
      instance: null,
      formatOption: {
        label: this.formatText || '格式化',
        method: this.format
      },
      formatSelectedOption: {
        label: this.formatText ? `${this.formatText}选中` : '格式化选中',
        method: this.format
      },
      commentOption: {
        label: this.commentText || '切换注释',
        method: this.toggleComment
      },
      commentSelectedOption: {
        label: this.commentText ? `${this.commentText}选中` : '切换注释选中',
        method: this.toggleComment
      },
      hasToggleMethod: false,
      timer: null
    };
  },

  computed: {
    curOptions() {
      return Object.assign({
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        extraKeys: {
          'Tab': 'autocomplete',
          'Ctrl-/': this.toggleComment
        },
        mode: 'text/x-mysql',
        addOverlay: 'text/x-mysql',
        gutters: ['CodeMirror-lint-markers'],
        lint: this.sqlLint && !this.visible,
        matchBrackets: true,
        hintOptions: {
          completeSingle: false,
          tables: this.hintList
        },
        delay: 700
      }, this.options || {});
    },

    maskOptions() {
      return Object.assign({
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        extraKeys: {
          'Tab': 'autocomplete',
          'Ctrl-/': this.toggleComment
        },
        mode: 'text/x-mysql',
        addOverlay: 'text/x-mysql',
        gutters: ['CodeMirror-lint-markers'],
        lint: this.sqlLint && this.visible,
        matchBrackets: true,
        hintOptions: {
          completeSingle: false,
          tables: this.hintList
        }
      }, this.options || {});
    },

    curProps() {
      return Object.assign({
        events: this.events
      }, this.props || {});
    },

    defaultOptions() {
      let options = [];
      const { formatable, commentable, formatOption, commentOption, hasToggleMethod } = this;
      if (commentable && hasToggleMethod) options.push(commentOption);
      if (formatable) options.push(formatOption);
      return options;
    },

    defaultSelectedOptions() {
      let options = [];
      const { formatable, commentable, formatSelectedOption, commentSelectedOption, hasToggleMethod } = this;
      if (commentable && hasToggleMethod) options.push(commentSelectedOption);
      if (formatable) options.push(formatSelectedOption);
      return options;
    },

    curContextOptions() {
      const { defaultOptions, defaultSelectedOptions, formatable, commentable, hasToggleMethod } = this;
      let isUseDefault = !this.readonly && (formatable || (commentable && hasToggleMethod));
      if (this.selection) {
        return Array.isArray(this.selectedContextOptions)
          ? this.selectedContextOptions.concat(isUseDefault ? defaultSelectedOptions : [])
          : (isUseDefault ? defaultSelectedOptions : []);
      }
      return Array.isArray(this.contextOptions)
        ? this.contextOptions.concat(isUseDefault ? defaultOptions : [])
        : (isUseDefault ? defaultOptions : []);
    },

    curMaskProps() {
      return Object.assign({
        deepDark: true,
        closeOnClickMask: true,
        beforeClose: this.beforeClose
      }, this.maskProps || {});
    },

    codemirror() {
      return this.visible ? this.$refs.maskEditor.codemirror : this.$refs.editor.codemirror;
    },

    cminstance() {
      return this.visible ? this.$refs.maskEditor.cminstance : this.$refs.editor.cminstance;
    },

    readonly() {
      return this.curOptions.readOnly || false;
    }
  },

  watch: {
    value(val) {
      this.code = val;
    },
    code(val) {
      this.$emit('input', val);
    },
    visible(val) {
      this.$emit('visible-change', val);
    }
  },

  mounted() {
    // if (!this.sqlLint) window.sqlLint = null;
    this.hasToggleMethod = !!this.codemirror.toggleComment;
    this.initContextMenu();
  },

  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    getSelection() {
      return this.cminstance.getSelection();
    },

    refresh() {
      this.$nextTick(() => {
        this.cminstance.refresh();
      });
    },

    beforeClose(event) {
      // console.log(event, event.target);
      if (this.$refs.maskEditor.$el.contains(event.target)) {
        return false;
      }
      if (this.$refs.maskEditor.codemirror.state.focused) return false;
      this.visible = false;
    },

    handleSelectMenu(item) {
      this.$refs.menu.hideMenu(event);
      let selection = this.instance.getSelection();
      this.$emit('menu-content-click', item.method, selection);
      if (typeof item.method === 'function' && item.method) { // todo: 判断是否为function
        item.method(selection);
        return;
      }
      this.$parent[item.menu](selection);
    },

    toggleComment() {
      this.codemirror.toggleComment && this.codemirror.toggleComment({
        lineComment: this.lineComment
      });
    },

    format() {
      let str = this.instance.getSelection();
      if (!str) {
        this.code = sqlFormatter.format(this.code);
        return;
      }
      this.instance.replaceSelection(sqlFormatter.format(str));
    },

    onContextMenu(instance, event, gutter, line) {
      this.$emit('on-context-menu', instance, event, gutter, line);
      if (!this.contextMenu) return;
      this.instance = instance;
      this.selection = instance.getSelection();
      if (!this.curContextOptions.length) return;
      this.$refs.menu.showMenu(event);
      // this.$refs.menu.open(event);
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    },

    onCodemirrorReady(refName, cm, test) {
      this.initialize(refName);

      if (this.readonly) return;
      cm.on('keypress', (codemirror, e) => {
        clearTimeout(this.timer);
        if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 59) return; // 空格或回车、输入分号时不进行自动补全提示
        this.timer = setTimeout(() => { cm.showHint && cm.showHint(this.hintProps); }, this.curOptions.delay || 500);
      });

      document.addEventListener('click', this.handleClickOutside);
    },

    handleClickOutside(ev) {
      if (!Element.prototype.closest || ev.target.closest('.CodeMirror-hints')) return;
      clearTimeout(this.timer);
      this.codemirror && this.codemirror.closeHint && this.codemirror.closeHint();
    },

    initContextMenu() {
      if (this.contextAppendToBody) {
        let el = this.$refs.menu.$el;
        document.body.appendChild(el);
      }
    },

    initialize(refName) {
      const tmpEvents = {};
      // eslint-disable-next-line
      const allEvents = [
        'scroll',
        'changes',
        'beforeChange'
        // 'cursorActivity',
        // 'keyHandled',
        // 'inputRead',
        // 'electricInput',
        // 'beforeSelectionChange',
        // 'viewportChange',
        // 'swapDoc',
        // 'gutterClick',
        // 'gutterContextMenu',
        // 'focus',
        // 'blur',
        // 'refresh',
        // 'optionChange',
        // 'scrollCursorIntoView',
        // 'update'
      ]
        .concat(this.curProps.events)
        .concat(this.curProps.globalEvents)
        .filter(e => (!tmpEvents[e] && (tmpEvents[e] = true)))
        .filter(e => !!e)
        .forEach(event => {
          // 循环事件，并兼容 run-time 事件命名
          let listener = (...args) => {
            // console.log('当有事件触发了', event, args)
            this.$emit(event, ...args);
            const lowerCaseEvent = event.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (lowerCaseEvent !== event) {
              this.$emit(lowerCaseEvent, ...args);
            }
          };
          this.$refs[refName].$on(event, listener);
        });
      if (refName === 'editor') this.$emit('ready', this.codemirror);
    }
  }
};
</script>
