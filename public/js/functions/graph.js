
const nodeValue = (node, functions, values) => {
  const unroll = (item /** item */, ps /**params */) => {
    const fn = functions[item.name]
    console.info(`unroll: `, fn, ps)

    return Promise.all(ps).then(results => fn.func(...results))
  }

  const valuefn = (item /**item */) => {
    const fn = functions[item.name]

    console.info(`value: `, values[item.id])

    return fn.func(values[item.id])
  }
  // const params = []
  console.info(`nodeValue: `, node, node.value, values[node.id])
  console.info(`values: `, values)

  const reducefn = (params, item) => {
    switch(item.type) {
      case 'function':
        {
          console.info('case function: ', item, params)
          const value = unroll(item, params.reverse())
          console.info('unrolled: ',  value)

          return [value]
        }

      case 'valuefunction':
        {
          console.info(`graph.valuefunction: pre `, item, params, values)
          
          const value = valuefn(item)
          params.push(value)
          
          console.info(`graph.valuefunction: post `, item, params)
          return params
        }
  
      case 'pobject':
      case 'wobject':
        const value = nodeValue(item, functions, values) // computed item
        params.push(value)
        return params
    }

  }

  const value = node.value || values[node.id] || node.items.reduceRight(reducefn , [])[0]
  console.info(`value: `, node.value, values[node.id], value)
  node.value = value
  values[node.id] = value

  return value
}

export const value = (node, functions, values) => nodeValue(node, functions, values)