<template>
  <div id="app" class="code-editor">
    <demonstration tag="h2" title="CodeEditor 下拉筛选组件" :show-content="false">
    </demonstration>
    <demonstration title="基本" :highlight="sourcecodeA" :multiple="true">
      <template slot="source">
        <div class="vd-demo__block vd-demo__block-2" style="text-align: left;">
          <div style="display: flex margin-bottom: 16px;">
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
    </demonstration>
  </div>
</template>

<script>
  import { sourcecodeA, sourcecodeB, sourcecodeC, sourcecodeD, sourcecodeE } from './template'

  export default {
    data () {
      return {
        sourcecodeA,
        sourcecodeB,
        sourcecodeC,
        sourcecodeD,
        sourcecodeE,
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
        this.hintList[`hint${Object.keys(this.hintList).length + 1}`] = [];
      },
      getSelection() {
        this.selection = this.$refs.editor.getSelection();
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  #app {
    margin: 60px auto;
  }
</style>
