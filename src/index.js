import CodeEditor from './components/code-editor.vue'
import './styles/less/index.less'

const install = function (Vue, opts = {}) {
  if (install.installed) return
  Vue.component('CodeEditor', CodeEditor)
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.component('CodeEditor', CodeEditor)
}

CodeEditor.install = install

export default CodeEditor
