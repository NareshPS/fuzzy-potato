import {default as Blob} from 'node-blob'
// File Object
//
// {
//   name: string;
//   body: string;
//   mimeType: string;
// }

const mockFile = (file) => {
  const blob = new Blob([file.body], { type: file.mimeType })

  blob.lastModifiedDate = new Date()
  blob.name = file.name

  return blob
};

export const mockFileList = (files) => {
  const fileList = {
    length: files.length,
    item(index) { return fileList[index] }
  }

  files.forEach((file, index) => fileList[index] = mockFile(file))

  return fileList
}