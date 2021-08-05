const file = (fcs /** file contents */, resolve, reject) => ({
  pixelfn: () => {
    const image = new Image()
    console.info(`image: `, image)
    const loadfn = ievt => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      ctx.drawImage(ievt.target, 0, 0)

      resolve({
        blob: ctx.getImageData(0, 0, image.width, image.height).data,
        width: image.width,
        height: image.height
      })
    }

    image.src = fcs
    image.onload = loadfn
  }
})

export const pixels = (fcs /**file contents */) => new Promise(
  (resolve, reject) => {
    const handler = file(fcs, resolve, reject)
    handler.pixelfn()
  }
)