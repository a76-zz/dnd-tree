import { toggleNode, removeNode, dragNodeView, endDragNodeView, addNode, openNewNodeDialog, closeNewNodeDialog, changeNewNodeName } from './types';

const toggleNodeAction = node => ({
  type: toggleNode,
  node
})

const removeNodeAction = (node, parent) => ({
  type: removeNode,
  node,
  parent
})

const addNodeAction = (node, parent) => ({
  type: addNode,
  node,
  parent
})

const openNewNodeDialogAction = parent => ({
  type: openNewNodeDialog,
  parent
})

const closeNewNodeDialogAction = () => ({
  type: closeNewNodeDialog
})

const changeNewNodeNameAction = name => ({
  type: changeNewNodeName,
  name
})

const dragNodeViewAction = (id, atIndex) => ({
  type: dragNodeView,
  id,
  atIndex
})

const endDragNodeViewAction = (id, atIndex, originalIndex) => ({
  type: endDragNodeView,
  id,
  atIndex,
  originalIndex
})

const applyNewNodeAction = () => (dispatch, getState) => {
  const { newNodeDialog: { newNode, parent } } = getState()
  
  dispatch(closeNewNodeDialogAction())
  dispatch(addNodeAction(newNode, parent))
}

export default {
  toggleNodeAction,
  removeNodeAction,
  addNodeAction,
  dragNodeViewAction,
  endDragNodeViewAction,
  openNewNodeDialogAction,
  closeNewNodeDialogAction,
  changeNewNodeNameAction,
  applyNewNodeAction
}