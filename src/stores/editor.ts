import { defineStore } from 'pinia'

interface State {
  value: string
}

const defaultValue = [
  '<!DOCTYPE html>',
  '<html>',
  '<head>',
  '    <title>HTML Sample</title>',
  '    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">',
  '    <style type="text/css">',
  '      * { box-sizing: border-box }',
  '      body {',
  '        background-color: #fcf8f3;',
  "        font-family: 'Inter', Arial, Helvetica, sans-serif;",
  '        margin: 0',
  '      }',
  '      img {',
  '        width: 100%;',
  '        height: auto;',
  '      }',
  '      ',
  '    </style>',
  '</head>',
  '<body>',
  '    <h1>WYCIWG - What you code is what you get</h1>',
  '</body>',
  '</html>',
].join('\n')

export const useEditorStore = defineStore('editor', {
  state: (): State => {
    return {
      value: defaultValue,
    }
  },
  actions: {
    setValue(value: string) {
      this.value = value
    },
  },
})
