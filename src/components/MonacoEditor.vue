<template>
  <div class="wrapper">
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// Monaco
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}
// Stores
import { useEditorStore } from '@/stores/editor'
// Emits
const emit = defineEmits(['comboUpdate'])
// Init stores
const editorStore = useEditorStore()
// Variables
let editor: monaco.editor.IStandaloneCodeEditor | null = null
const container = ref<HTMLElement | null>(null)

onMounted(() => {
  initMonacoEditor()
})

function initMonacoEditor() {
  if (container.value) {
    editor = monaco.editor.create(container.value, {
      value: editorStore.value,
      language: 'html',
      theme: 'vs-dark',
      minimap: {
        enabled: false,
      },
    })
  }
  if (editor) {
    const model = editor.getModel()
    if (model) {
      model.onDidChangeContent(() => {
        emit('comboUpdate')
        autoSave()
      })
    }
  }
}

function autoSave() {
  if (editor) {
    editorStore.setValue(editor.getValue())
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 100%;
  height: auto;
}

.container {
  width: 100vw;
  height: 80vh;
}
</style>
