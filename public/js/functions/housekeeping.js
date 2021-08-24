

export const errorInfo = (err) => {
  return err.stack? err.stack.toString(): `${err.name}: ${err.message}`
}

export const ensurePromise = (v) => v instanceof Promise? v: Promise.resolve(v)