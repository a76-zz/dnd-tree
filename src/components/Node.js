import React, { Component } from 'react'
import PropTypes from 'prop-types'

import flow from 'lodash/flow'

import {
	DragSource,
	DropTarget
} from 'react-dnd'

import nodeType from 'types/node'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/AddCircle'
import CollapseIcon from '@material-ui/icons/ChevronRight'
import ExpandIcon from '@material-ui/icons/ExpandMore'

import classNames from 'classnames'

import './Node.css'

const nodeSource = {
	beginDrag({ view: { id }, findNodeView}) {
		return {
      id,
      originalIndex: findNodeView(id).index
		}
	},

	endDrag({ findNodeView, endDragNodeView }, monitor) {
    const { id: draggedId, originalIndex } = monitor.getItem()
    
		const didDrop = monitor.didDrop()

		if (!didDrop) {
      const { index: dropIndex } = findNodeView(draggedId)
      endDragNodeView(draggedId, dropIndex, originalIndex)
		}
	}
}

const nodeTarget = {
	canDrop() {
		return false
	},

	hover({ view: { id: overId }, findNodeView, dragNodeView }, monitor) {
		const { id: draggedId } = monitor.getItem()

		if (draggedId !== overId) {
			const { index: overIndex } = findNodeView(overId)
			dragNodeView(draggedId, overIndex)
		}
	}
}

class Node extends Component {
  toggleNodeHandler = e => {
    const { view: { node }, toggleNode } = this.props
    
    e.stopPropagation()
    toggleNode(node)
  }

  removeNodeHandler = e => {
    const { view: { node, parent }, removeNode } = this.props
    
    e.stopPropagation()
    removeNode(node, parent)
  }

  addNodeHandler = e => {
    const { view: { node: parent }, addNode } = this.props
    
    e.stopPropagation()
    addNode(parent)
  }

  render() {
    const { view: {node: { type, name, children = [], expanded } }, connectDragSource, connectDropTarget, isDragging } = this.props;

    const nodeStyle = classNames({
      'TreeNode': true,
      'TreeNode--user': type === nodeType.user,
      'TreeNode--task': type === nodeType.task,
      'TreeNode--sub-task': type === nodeType.subTask
    })

    const buttonStyle = {
      root: 'TreeNode-action-button'
    }

    const opacity = isDragging ? 0 : 1

    return (
      connectDragSource &&
			connectDropTarget &&
			connectDragSource(
				connectDropTarget(
          <div className={nodeStyle} style={{opacity}}>
            {type !== nodeType.subTask && children.length > 0 && (
              <IconButton aria-label="Expand" classes={buttonStyle} onClick={this.toggleNodeHandler}>
                {!expanded && <CollapseIcon />}
                {expanded && <ExpandIcon />}
              </IconButton>
            )}
            <span>{name}</span>
            {type !== nodeType.subTask && (<span className="TreeNode-counter">{ children.length }</span>)}
            <div className="TreeNode-actions">
              {type !== nodeType.subTask && (
                <IconButton aria-label="Add" classes={buttonStyle} onClick={this.addNodeHandler}>
                  <AddIcon />
                </IconButton>
              )}
              <IconButton aria-label="Delete" classes={buttonStyle} onClick={this.removeNodeHandler}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        )
      )
    )
  }
}

Node.propTypes = {
  view: PropTypes.any.isRequired,
  toggleNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  addNode: PropTypes.func.isRequired,
  dragNodeView: PropTypes.func.isRequired,
  endDragNodeView: PropTypes.func.isRequired,
  findNodeView: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired
}

export default flow(
  DropTarget('node', nodeTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
  })),
  DragSource('node', nodeSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))
)(Node)
