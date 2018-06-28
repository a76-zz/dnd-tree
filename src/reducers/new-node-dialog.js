import { openNewNodeDialog, closeNewNodeDialog, changeNewNodeName } from 'actions/types'
import nodeType from 'types/node'

const getChildType = parent => {
  switch (parent.type) {
    case nodeType.user:
      return nodeType.task

    case nodeType.task:
      return nodeType.subTask

    default:
      return nodeType.user
  }
}

const reduceOpenDialog = (state, { parent }) => {
  const type = getChildType(parent)
  const newNode = {
    type,
    name: null
  }

  if (type !== nodeType.subTask) {
    newNode.expanded = true
  }
  
  return {
    ...state,
    open: true,
    newNode,
    parent
  }
}

const reduceCloseDialog = state => {
  return {
    ...state,
    open: false
  }
}

const reduceChangeNewNodeName = (state, { name }) => {
  const { newNode } = state
  
  // Mutation is acceptable here because name changing should not effect rerendering
  newNode.name = name
  return state
}

const initialState = {
  open: false,
  newNode: {
    type: undefined,
    name: ''
  },
  parent: undefined
}

const newNodeDialog = (state=initialState, action) => {
  switch (action.type) {
    case openNewNodeDialog:
      return reduceOpenDialog(state, action)

    case closeNewNodeDialog:
      return reduceCloseDialog(state, action)

    case changeNewNodeName: 
      return reduceChangeNewNodeName(state, action)

    default:
      return state
  }
}

export default newNodeDialog