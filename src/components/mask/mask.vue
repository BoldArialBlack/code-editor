<template>
  <transition :name="transition">
    <div class='vue-mask' :style="{position: fullscreen ? 'fixed' : 'absolute', zIndex}" :class="{'deep-dark': deepDark}" v-show='isVisible' @click='handleClose($event, true)'>
      <slot></slot>
      <button class='vue-mask-close-button' @click.stop='handleClose($event)' v-if='showClose'>
        <i class="iconfont icon-close" />
      </button>
    </div>
  </transition>
</template>

<script>
import {
  on,
  off
} from './dom';
import zIndex, { pushItem, popItem } from './z-index';
import './style.less';

export default {
  name: 'EditorMask',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    transition: {
      type: String,
      default: 'fade-in'
    },
    showClose: Boolean,
    beforeClose: Function,
    appendToBody: {
      type: Boolean,
      default: true
    },
    deepDark: Boolean,
    closeOnClickMask: Boolean,
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    fullscreen: Boolean
  },
  components: {
  },
  mixins: [ zIndex ],
  watch: {
    visible: {
      handler(val) {
        this.isVisible = val;
        this.handleZIndex(val);
        this.isInit = false;
      },
      immediate: true
    }
  },
  data() {
    return {
      isVisible: false,
      isInit: true
    };
  },
  created() {
    this.isVisible = this.visible;
  },
  methods: {
    handleZIndex(v) {
      if (v) {
        pushItem('mask');
        this.nextZIndex();
        this.updateZIndex();
        this.$emit('updateZIndex');
      } else {
        if (!this.isInit) {
          popItem();
        }
      }
    },
    handleClose(e, fromMask = false) {
      if (fromMask && !this.closeOnClickMask) {
        return;
      }
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(e, this.hide);
      } else {
        this.hide();
      }
    },
    hide(done) {
      if (done !== false) {
        this.isVisible = false;
        this.$emit('update:visible', false);
        this.$emit('close');
      }
    },
    onEsc(e) {
      if (this.closeOnPressEscape && e.which === 27 && this.isVisible) {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(e, this.hide);
        } else {
          this.hide();
        }
      }
    }
  },
  mounted() {
    this.appendToBody && document.body.appendChild(this.$el);
    this.closeOnPressEscape && on(document, 'keydown', this.onEsc);
  },
  beforeDestroy() {
    this.closeOnPressEscape && off(document, 'keydown', this.onEsc);
    if (this.appendToBody) {
      document.body.removeChild(this.$el);
    }
  }
};
</script>
