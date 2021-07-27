import {range} from 'orb-array'

export const makeId = (chars = "abcdefghijklmnopqrstuvwxyz0123456789", size = 10) =>
range(size)
.reduce(
  (cid/**current id */) => cid + chars.charAt(Math.floor(Math.random() * chars.length)),
  ""
)