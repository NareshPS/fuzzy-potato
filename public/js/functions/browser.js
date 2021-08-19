import { saveAs } from "file-saver"

/**
 * JS Object to blob conversion reference:
 * https://stackoverflow.com/questions/53929108/how-to-convert-a-javascript-object-to-utf-8-blob-for-download
 * 
 * File saver reference: https://github.com/eligrey/FileSaver.js
 * 
 * @param {Proxy} data 
 */
export const saveObject = (data) => {
  const str = JSON.stringify(data)
  const bytes = new TextEncoder().encode(str)
  const blob = new Blob([bytes], { type: "application/json;charset=utf-8" })

  saveAs(blob, 'pobjects.json')
}