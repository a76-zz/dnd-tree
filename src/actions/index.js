import { toggleNode, removeNode, addNode, openNewNodeDialog, closeNewNodeDialog, changeNewNodeName } from './types';

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

const applyNewNodeAction = () => (dispatch, getState) => {
  const { newNodeDialog: { newNode, parent } } = getState()
  
  dispatch(closeNewNodeDialogAction())
  dispatch(addNodeAction(newNode, parent))
}

export default {
  toggleNodeAction,
  removeNodeAction,
  addNodeAction,
  openNewNodeDialogAction,
  closeNewNodeDialogAction,
  changeNewNodeNameAction,
  applyNewNodeAction
}