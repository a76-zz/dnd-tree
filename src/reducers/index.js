import { combineReducers } from 'redux'
import tree from './tree'
import newNodeDialog from './new-node-dialog'

export default combineReducers({
  tree,
  newNodeDialog
})