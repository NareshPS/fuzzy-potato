

const handlers = (fo, resolve, reject) => ({
  read: evt => { resolve(evt.target.result) },
})

export const read = (fo) => new Promise(
  (resolve, reject) => {
    const reader = new FileReader()
    const handler = handlers(fo, resolve, reject)

    reader.onload = handler.read
    reader.onerror = _ => { reader.abort(), reject(`Error Reading: ${fo}`) }
    reader.readAsDataURL(fo)
  }
)