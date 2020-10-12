export const sourcecodeA = `<template>
  <div class="vd-demo__block vd-demo__block-2">
    <div style="display: flex">
      <el-button @click="addHintList">
        添加补全内容
      </el-button>
      <el-button @click="getSelection">
        获取选中文本
      </el-button>
      <span>选中: {{ selection || '-' }}</span>
    </div>
    <code-editor
      ref="editor"
      v-model="value"
      :context-options="[{label: 'test', method: test}]"
      :events="['contextmenu', 'blur']"
      :hint-list="hintList"
      context-append-to-body
      @blur="blur"
      @ready="ready"
    />
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value: 'SELECT * FRO \'test_table\'',
        hintList: {},
        selection: ''
      }
    },
    methods: {
      test() {
        console.log('test');
      },
      ready() {
        console.log('ready');
      },
      blur() {
        console.log('blur');
      },
      addHintList() {
        this.hintList[\`hint\${Object.keys(this.hintList).length + 1}\`] = [];
      },
      getSelection() {
        this.selection = this.$refs.editor.getSelection();
      }
    }
  }
</script>`

export const sourcecodeB = `<template>
  <div class="vd-demo__block vd-demo__block-2">
  <code-editor
    v-model="filters"
    :options="filterOptions"
    multiple
    @change="handleFilter"
  />
  </div>
</template>
<script>
  export default {
    data () {
      return {
        filters: [],
        filterOptions: [{
          label: '公开项',
          value: 'public',
          disabled: true
        }, {
          label: '未公开项',
          value: 'private'
        }, {
          label: '租户内',
          value: 'within'
        }, {
          label: '租户外',
          value: 'outside',
          className: 'class-name-test'
        }]
      }
    },
    methods: {
      handleFilter(value) {
        console.log(value);
      }
    }
  }
</script>`

export const sourcecodeC = `<template>
<div class="vd-demo__block vd-demo__block-2">
  <code-editor
    v-model="filter"
    :options="filterOptions"
    disabled
    @change="handleFilter"
  />
</div>
</template>

<script>
  export default {
    data () {
      return {
        filter: '',
        filterOptions: [{
          label: '公开项',
          value: 'public',
          disabled: true
        }, {
          label: '未公开项',
          value: 'private'
        }, {
          label: '租户内',
          value: 'within'
        }, {
          label: '租户外',
          value: 'outside',
          className: 'class-name-test'
        }]
      }
    },
    methods: {
      handleFilter(value) {
        console.log(value);
      }
    }
  }
</script>`

export const sourcecodeD = `<template slot="source">
<div class="vd-demo__block vd-demo__block-2">
  <code-editor
    v-model="filter"
    :options="filterOptions"
    @change="handleFilter"
  >
    筛选
  </code-editor>
</div>
</template>
<script>
  export default {
    data () {
      return {
        filter: '',
        filterOptions: [{
          label: '公开项',
          value: 'public',
          disabled: true
        }, {
          label: '未公开项',
          value: 'private'
        }, {
          label: '租户内',
          value: 'within'
        }, {
          label: '租户外',
          value: 'outside',
          className: 'class-name-test'
        }]
      }
    },
    methods: {
      handleFilter(value) {
        console.log(value);
      }
    }
  }
</script>`

export const sourcecodeE = `<template>
  <div class="vd-demo__block vd-demo__block-2">
    <code-editor
      v-model="filter"
      :options="filterOptions"
      :render-content="renderContent"
      @change="handleFilter"
    />
  </div>
</template>

<script>
  export default {
    data () {
      return {
        filter: '',
        filterOptions: [{
          label: '公开项',
          value: 'public',
          disabled: true
        }, {
          label: '未公开项',
          value: 'private'
        }, {
          label: '租户内',
          value: 'within'
        }, {
          label: '租户外',
          value: 'outside',
          className: 'class-name-test'
        }]
      }
    },
    methods: {
      handleFilter(value) {
        console.log(value);
      },
      renderContent(h, data) {
        return (<span>自定义渲染_{data.label}</span>);
      }
    }
  }
</script>
`