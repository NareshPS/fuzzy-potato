
const handlers = (fo, resolve, reject) => ({
  read: evt => { resolve(evt.target.result) },
})

export const read = (fo, readas = 'dataurl') => new Promise(
  (resolve, reject) => {
    const reader = new FileReader()
    const handler = handlers(fo, resolve, reject)

    reader.onload = handler.read
    reader.onerror = _ => { reader.abort(), reject(`Error Reading: ${fo}`) }
    
    switch(readas) {
      case 'text':
        reader.readAsText(fo)
        break
      default:
        reader.readAsDataURL(fo)
    }
  }
)

export const write = (data) => new Promise(
  (resolve, reject) => {
    const writer = new FileWriter()
    const hander = handlers(data, resolve, reject)

  }
)