import update from 'immutability-helper'

import { toggleNode, addNode, removeNode, dragNodeView, endDragNodeView } from 'actions/types'
import nodeType from 'types/node'
import { findNodeView } from 'utils'

// Flattened view of tree is more convenient for some type of operations 
// It allows to keep data model clean from representational details and simplify rendering
function flattenTree(node, result=[], id={ value: 0 }, level=-1, parent=undefined) {
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
// It should modify tree data structure in some way
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

const isPossibleDropping = (atIndex, flattening, sourceView) => {
  const atView = flattening[atIndex]

  if (atView.level === sourceView.level) {
    return true
  }

  if (atView.level === sourceView.level - 1) {
    const previousView = flattening[atIndex - 1]
    const nextView = flattening[atIndex + 1]

    return (previousView && previousView.level === sourceView.level - 1) 
      || previousView.level === sourceView.level 
      || (!nextView || nextView.level === atView.level - 1)
  }

  return false
}

const reduceDragNodeView = (state, { id, atIndex }) => {
  const { flattening } = state
  const { index, view } = findNodeView(id, flattening)
  
  if (isPossibleDropping(atIndex, flattening, view)) {
    return update(state, {
      flattening: {
        $splice: [[index, 1], [atIndex, 0, view]],
      }
    })
  } else {
    return state;
  }
}

const unlinkSourceNode = (flattening, id) => {
  const { view: { parent: { children }, node } } = findNodeView(id, flattening)

  const nodeIndex = children.indexOf(node)
  children.splice(nodeIndex, 1)
  return node
}

const insertSourceNode = (flattening, atIndex, sourceNode) => {
  const previousView = flattening[atIndex-1]
  const view = flattening[atIndex]

  if (previousView) {
    const { level } = view;
    const { level: previousLevel } = previousView;

    if (level === previousLevel) {
      // siblings 
      const { parent: { children }, node } = previousView
      const nodeIndex = children.indexOf(node)
      children.splice(nodeIndex + 1, 0, sourceNode)
    }

    if (level === previousLevel + 1) {
      // parent
      const { node: { children = [] }, node } = previousView
      node.children = children
      children.push(sourceNode)
    }
  }
}

const reduceEndDragNodeView = (state, action) => doAction(state, action, ({ id, atIndex, originalIndex }) => {
  const { flattening } = state
  
  if (atIndex !== originalIndex) {
    const sourceNode = unlinkSourceNode(flattening, id)
    insertSourceNode(flattening, atIndex, sourceNode)
  }
  
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
  // tree data model
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

    case dragNodeView:
      return reduceDragNodeView(state, action)

    case endDragNodeView:
      return reduceEndDragNodeView(state, action)
  
    default:
      return state
  }
}

export default tree