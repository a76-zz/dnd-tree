import React, { Component } from 'react'
import PropTypes from 'prop-types'
import nodeType from 'types/node'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/AddCircle'
import CollapseIcon from '@material-ui/icons/ChevronRight'
import ExpandIcon from '@material-ui/icons/ExpandMore'

import classNames from 'classnames'

import './Node.css'

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
    const { view: {node: { type, name, children = [], expanded } } } = this.props;

    const nodeStyle = classNames({
      'TreeNode': true,
      'TreeNode--user': type === nodeType.user,
      'TreeNode--task': type === nodeType.task,
      'TreeNode--sub-task': type === nodeType.subTask
    })

    const buttonStyle = {
      root: 'TreeNode-action-button'
    }

    return (
      <div className={nodeStyle}>
        {type !== nodeType.subTask && children.length > 0 && (
          <IconButton aria-label="Expand" classes={buttonStyle} onClick={this.toggleNodeHandler}>
            {!expanded && <CollapseIcon />}
            {expanded && <ExpandIcon />}
          </IconButton>
        )}
        <span>{name}</span>
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
    );
  }
}

Node.propTypes = {
  view: PropTypes.any.isRequired,
  toggleNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  addNode: PropTypes.func.isRequired
}

export default Node

