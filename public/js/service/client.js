import { read } from "../functions/file"

export class Client {
  static store = {
    write: ({data}) => fetch(
      `/store/write`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }
    )
    .then(res => res.json()),

    read: (path) => {

    }
  }
}