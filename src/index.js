import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'
import registerServiceWorker from './registerServiceWorker'

import './index.css'

const logger = createLogger()
const middleware = [thunk, logger]

const store = createStore(rootReducer, applyMiddleware(...middleware))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
