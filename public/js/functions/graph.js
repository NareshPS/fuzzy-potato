const nodeValue = (node, functions, values) => {
  const unroll = (item /** item */, ps /**params */) => {
    const fn = functions[item.name]
    return Promise.all(ps)
    .then(results => (
      (console.log(`nodeValue: unrolling: fn: %O`, fn, ...results)), 
      fn.func(...results))
    )
  }

  const valuefn = (item /**item */) => {
    const fn = functions[item.name]
    return Promise.resolve(fn.func(values[item.id]))
  }

  const reducefn = (params, item) => {
    switch(item.type) {
      case 'function': {
        const value = unroll(item, params.reverse())
        console.info('nodeValue: unrolled item: %O value: %O ', item, value)

        return [value]
      }

      case 'valuefunction': {
        const value = valuefn(item)
        params.push(value)
        
        console.info(`graph.valuefunction: item: %O params: %O value: %O`, item, params, value)
        return params
      }
  
      case 'pobject':
      case 'block':
        const value = nodeValue(item, functions, values) // computed item
        params.push(value)

        console.info(`graph.{p,w}object: item: %O params: %O `, item, params)
        return params
    }
  }

  console.info(`nodeValue: node: %O values: %O value: %O`, node, values, values[node.id])

  const value = values[node.id] || node.items.reduceRight(reducefn , [])[0]
  values[node.id] = value

  return value
}

const nodeLayout = (node, functions, values) => {
  const {nodes, edges} = traversal.dfs([node])
  // console.info(`graph.layout: nodes: %O`, nodes, edges)

  return {nodes, edges}
}

/**
 * Reference: https://en.wikipedia.org/wiki/Depth-first_search
 * 
 */
const traversal = {
  dfs: (heads) => {
    const NODES = []
    const EDGES = []
    const VISITED = {}
    const MARKED = {}

    const nid = ({id}) => id // node id
    const nchs = ({items = []}) => items // node children
    const visit = (head) => {
      const visitchildren = (n) => (/**console.info(`graph visit children: `, n),*/ nchs(n).forEach((nch) => visit(nch)))
      const cycleerrfn = (n) => {throw `Cycle detected at: ${n}`}

      // Visiting functions
      const visitn = (n) => VISITED[nid(n)] = n
      const isvisited = (n) => VISITED[nid(n)]

      // Marking functions
      const mark = (n) => MARKED[nid(n)] = n
      const unmark = (n) => delete MARKED[(nid(n))]
      const ismarked = (n) => MARKED[nid(n)]

      // Edge functions
      const edges = (n) => nchs(n).map((nch) => [nid(n), nid(nch)])

      // Visitation
      const friendlyvisit = (n) => {
        mark(n)
        visitchildren(n)
        unmark(n)
        visitn(n)
        NODES.push(n)
        EDGES.push(...edges(n))
      }

      isvisited(head)? ({}): ismarked(head)? cycleerrfn(head): friendlyvisit(head)
    }

    Object.values(heads).forEach((head) => visit(head))

    return {nodes: NODES, edges: EDGES}
  }
}

export const value = (node, functions, values) => nodeValue(node, functions, values)
export const layout = (node, functions, values) => nodeLayout(node, functions, values)
export const nodes = (heads = []) => traversal.dfs(heads).nodes