import { state2 } from "./state.test.fns"

export const pngsrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACCUlEQVR4Ab3BvUsCYQDA4d+9vhik4HBxfbi0eOEqtLSHNSZI9A80BDoEQpOIDiIitoo4tIiLDjW43BA1Nhg6KeTS4hYYSmJi3NBa791wz6MBazwk8JjAYwKPCTwm8JjEAU3TCIVClMtlkskkoVCIwWBAu92mWq3y+fnJer3mLxqwRkEwGKRWq3FxcYFtsVjg8/mQUvKrUqmQyWT4i0RRvV7n/PwcW7PZ5Orqip2dHYrFImdnZ6xWK4bDIf+RKNrd3cX28PBAKpViOp0ynU6JRqM8PT2Ry+V4fHzkPz4gh4JEIoFpmhwcHLC3t0cgEGAymfD19cXNzQ3D4RAVPiCHgk6ng9/v5/DwkFgsRiKRIJPJcHp6ymg04vX1FRU+IIeC1WqFZVnc398zmUzo9XqYpsnm5iaWZfHy8oIKiUP9fp9+v4/t5OQEXdd5e3tDlcClra0tdF3Htr+/jyqBS4VCAcMwsJmmiSqBS0dHR/wKh8OokrgQiUTY3t7Gls1mKZVKqBK40Gg0MAyD+XzO3d0dy+USVQKHdF3HNE1s7Xab9/d3nBA4lE6nMQwD2+3tLU4JHIrH49ien58ZDAY4JXDg8vKSWCyG7fr6mu/vb5wSKIpGo+TzeaSUdLtdxuMxbggUbGxs0Gq1MAyD2WxGKpXi4+MDNwQKNE1DSont+PiY8XiMWxqwxkMCj/0AEl6l3G+U4+QAAAAASUVORK5CYII="

export const states = {
  conv2dimage: _ => {
    const defs = [
      {name: 'tf.tensor'},
      {name: 'pick'},
      {name: 'pick'},
      {name: 'png'},
      {value: `[\"${pngsrc}\"]`},
      {value: 0},
      {value: '\"blob\"'},
      {value: '{shape: [28,28,3], dtype: \'float32\'}'}, // Unused #DELETE
      {name: 'call'},
      {value: '\"Uint8Array.from\"'},
      {name: 'filter'},
      {value: '(v, index) => (index+1)%4!=0'},
      {name: 'tf.conv2d'}, // 12
      {value: '[28, 28, 3]'},
      {value: '\"float32\"'},
      {value: '[[[[1], [1], [1]], [[1], [1], [1]]], [[[1], [1], [1]], [[1], [1], [1]]]]'}, // 15
      {value: '2'},
      {value: '\'same\''}
    ]
    const sequence = [
      [3, 4],
      [2, 3],
      [2, 5],
      [1, 2],
      [1, 6], //gets the blob
      [10, 1],
      [10, 11], // removes the alpha channel
      [8, 9],
      [8, 10], // converts to Uint8Array
      [0, 8],
      [0, 13],
      [0, 14], // converts to a tensor
      [12, 0],
      [12, 15],
      [12, 16],
      [12, 17],
    ]
    const {nodes, functions, values} = state2(defs, sequence)

    return {defs, nodes, functions, values}
  }
}