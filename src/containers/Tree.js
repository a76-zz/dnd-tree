import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import flow from 'lodash/flow'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import actions from 'actions'

import Node from 'components/Node'
import nodeType from 'types/node'

import './Tree.css'

import { findNodeView } from 'utils'

const mapStateToProps = ({ tree: { flattening } }) => ({
  flattening,
  findNodeView: id => findNodeView(id, flattening)
})

const mapDispatchToProps = dispatch => {
  const { toggleNodeAction, removeNodeAction, dragNodeViewAction, endDragNodeViewAction, openNewNodeDialogAction } = bindActionCreators(actions, dispatch)
  return { toggleNodeAction, removeNodeAction, dragNodeViewAction, endDragNodeViewAction, openNewNodeDialogAction }
}

const Tree = ({ 
  flattening = [], 
  toggleNodeAction, 
  removeNodeAction,
  dragNodeViewAction,
  endDragNodeViewAction, 
  openNewNodeDialogAction, 
  findNodeView 
}) => (
  <div className="Tree">
    {flattening.map(view => 
      <Node 
        key={view.id} 
        view={view} 
        toggleNode={toggleNodeAction} 
        removeNode={removeNodeAction} 
        dragNodeView={dragNodeViewAction}
        endDragNodeView={endDragNodeViewAction}
        findNodeView={findNodeView}
        addNode={openNewNodeDialogAction} 
      />
    )}
  </div>
)


Tree.propTypes = {
  flattening: PropTypes.array.isRequired,
  toggleNodeAction: PropTypes.func.isRequired,
  removeNodeAction: PropTypes.func.isRequired,
  dragNodeViewAction: PropTypes.func.isRequired,
  endDragNodeViewAction: PropTypes.func.isRequired,
  findNodeView: PropTypes.func.isRequired
}

export default flow(
  DragDropContext(HTML5Backend),
  connect(mapStateToProps, mapDispatchToProps)
)(Tree)

