
const nodeValue = (node, functions) => {
  const unroll = (item /** item */, ps /**params */) => {
    const fn = functions[item.name]
    console.info(`unroll: `, item, fn, ps)

    return Promise.resolve(fn.func(...Promise.all(ps)))
  }

  const valuefn = (item /**item */) => {
    const fn = functions[item.name]

    return fn.func(item.value)
  }
  // const params = []
  console.info(`nodeValue: `, node, functions)

  const reducefn = (params, item) => {
    console.info(item.type)
    switch(item.type) {
      case 'function':
        {
          const value = unroll(item, params.reverse())
          console.info('unrolled: ',  value)

          return [value]
        }

      case 'valuefunction':
        {
          console.info(`graph.valuefunction: `, item, params.reverse())

          const value = valuefn(item)
          params.push(value)
          return params
        }
  
      case 'pobject':
      case 'wobject':
        const ci = nodeValue(item, functions) // computed item
        params.push(ci.value)
        return params
    }

  }

  node.value = node.value || node.items.reduceRight(reducefn , [])[0]

  return node
}

export const value = (node, functions) => nodeValue(node, functions).value