import { toggleNode, addNode, removeNode } from 'actions/types'
import nodeType from 'types/node'

// Flattened view of tree is more convenient for some type of operations 
// It allows to keep data model clean from representational details and simplify rendering
function flattenTree(node, result=[], id={ value: -1 }, level=-1, parent=undefined) {
  // Not necessary to flatten formal root node
  if (level > -1) {
    result.push({
      node,
      level,
      id: id.value,
      parent
    })
    id.value++; 
  }
  
  // Always flatten formal root node or try to flatten any other node if it is expanded
  if (level ===-1 || node.expanded) {
    (node.children || []).forEach(child => flattenTree(child, result, id, level+1, parent=node))
  }
}

// High level function which is reused in reducers
// Action Handler should return true if action is completed successfuly
// It should modify data structure in some way
function doAction(state, action, actionHandler) {
  const { data } = state
  const flattening = [];

  if (actionHandler(action)) {
    flattenTree(data, flattening)

    return {
      ...state,
      flattening
    }
  } else {
    return state
  }
}

const reduceToggleNode = (state, action) => doAction(state, action, ({ node }) => {
  const { type, expanded } = node

  if (type !== nodeType.subTask) {
    node.expanded = !expanded
    return true
  }
})

const reduceAddNode = (state, action) => doAction(state, action, ({ node, parent }) => {
  const { children = [] } = parent
  parent.children = children

  parent.expanded = true

  children.push(node)
  return true
})

const reduceRemoveNode = (state, action) => doAction(state, action, ({ node, parent }) => {
  const { children } = parent

  const nodeIndex = children.findIndex(child => child === node)
  children.splice(nodeIndex, 1)

  return true
})

// Initial tree state
const data = {
  children: [
    {type: nodeType.user, expanded: true, name: 'Dave', children: [
      {type: nodeType.task, expanded: true, name: 'clean car', children: [
        {type: nodeType.subTask, name: 'clean wheels'},
        {type: nodeType.subTask, name: 'clean windows'},
        {type: nodeType.subTask, name: 'clean seats'}
      ]},
      {type: nodeType.task, expanded: false, name: 'clean world', children: [
        {type: nodeType.subTask, name: 'clean Ocean'},
        {type: nodeType.subTask, name: 'clean Air'},
        {type: nodeType.subTask, name: 'clean Soul'}
      ]}
    ]},
    {type: nodeType.user, expanded: true, name: 'Simon', children: [
      {type: nodeType.task, name: 'clean house'}
    ]}
  ]
}

const flattening = []
flattenTree(data, flattening)

const initialState = {
  // data model
  data,
  // flattened view model
  flattening
}

const tree = (state = initialState, action) => {
  switch (action.type) {
    case toggleNode:
      return reduceToggleNode(state, action)

    case addNode:
      return reduceAddNode(state, action)

    case removeNode:
      return reduceRemoveNode(state, action)
  
    default:
      return state
  }
}

export default tree