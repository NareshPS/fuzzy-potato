const subvalue = (o = {}, elements = [], defaultValue) => {
  const key = elements.shift()
  const sv = o[key]

  return elements.length? subvalue(sv, elements, defaultValue): (sv || defaultValue)
}

export const lookup = (o = {}, path, defaultValue) => {
  const elements = path.split('.')

  return subvalue(o, elements, defaultValue)
}