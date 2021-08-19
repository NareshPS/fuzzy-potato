

export const errorInfo = (err) => {
  return err.stack? err.stack.toString(): `${err.name}: ${err.message}`
}