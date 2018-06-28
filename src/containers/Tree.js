import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import actions from 'actions'

import Node from 'components/Node'

import './Tree.css'

const mapStateToProps = ({ tree: { flattening } }) => ({
  flattening
})

const mapDispatchToProps = dispatch => {
  const { toggleNodeAction, removeNodeAction, openNewNodeDialogAction } = bindActionCreators(actions, dispatch)

  return { toggleNodeAction, removeNodeAction, openNewNodeDialogAction }
}

const Tree = ({ flattening = [], toggleNodeAction, removeNodeAction, openNewNodeDialogAction }) => (
  <div className="Tree">
    {flattening.map(view => <Node key={view.id} view={view} toggleNode={toggleNodeAction} removeNode={removeNodeAction} addNode={openNewNodeDialogAction} />)}
  </div>
)

Tree.propTypes = {
  flattening: PropTypes.array,
  toggleNodeAction: PropTypes.func,
  removeNodeAction: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree)

