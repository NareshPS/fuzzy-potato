import { promises as fs } from "fs"
import { makeId } from "../functions/random.mjs"

export const operations = {
  read: ({request}) => {

  },
  write: ({request}) => {
    const filepath = `./temp/${makeId()}.json`

    return fs.writeFile(filepath, JSON.stringify(request))
    .then(_ => ({uri: filepath}))
  }
}