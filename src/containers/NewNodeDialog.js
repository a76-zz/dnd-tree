import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import nodeType from 'types/node'
import actions from 'actions'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

const typeTitles = {
  [nodeType.user]: 'User',
  [nodeType.task]: 'Task',
  [nodeType.subTask]: 'Sub Task'
}

const mapStateToProps = ({ newNodeDialog: { open, newNode: { type } } }) => ({
  open,
  type
})

const mapDispatchToProps = dispatch => {
  const { applyNewNodeAction: handleAddNode, closeNewNodeDialogAction: handleClose, changeNewNodeNameAction } = bindActionCreators(actions, dispatch)

  return {
    handleClose,
    handleAddNode,
    handleChangeName: e => changeNewNodeNameAction(e.target.value) 
  }
}

const NewNodeDialog = ({open, type, handleAddNode, handleChangeName, handleClose }) => (
  <Dialog
    open={open}
    onClose={this.handleClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Add {typeTitles[type]}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Please specify title of {typeTitles[type]}.
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        label="Title"
        type="text"
        fullWidth
        onChange={handleChangeName}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleAddNode} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
)

NewNodeDialog.propTypes = {
  open: PropTypes.bool,
  type: PropTypes.string,
  handleAddNode: PropTypes.func.isRequired,
  handleChangeName: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(NewNodeDialog)