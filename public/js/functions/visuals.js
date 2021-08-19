const valuefn = ({value}) => value
const itemfn = ({item}) => item
const truefn = _ => true
const falsefn = _ => false
const validvaluefn = ({value: v}) => v != undefined

export const canvas = {name: 'canvas', cond: validvaluefn, func: valuefn}
export const network = {name: 'network', cond: truefn, func: valuefn}
export const pobject = {name: 'pobject', cond: truefn, func: itemfn}
export const none = {name: 'none', cond: falsefn, func: itemfn}