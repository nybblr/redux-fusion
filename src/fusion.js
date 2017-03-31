import { Component, createElement } from 'react'
import { mapPropsStream } from 'recompose'
import { Observable } from 'rxjs'

export default propStream$ => (StreamedComponent) => {
  class ComponentFromStream extends Component {
    render() {
      if (!this.context.store) {
        throw new Error(
          `fuse() error: Missing Redux store in context.
           Did you forget to <Provide> it?`
        )
      }
      const { store } = this.context;
      return createElement(
        mapPropsStream(
          propStream$(Observable.from(store), store.dispatch, store.getState)
        )(StreamedComponent)
      )
    }
  }
  ComponentFromStream.contextTypes = {
    store: (props, propName) => {
      // custom validation via Observable.from
      try {
        Observable.from(props[propName])
      } catch (e) {
        return
          `fuse() error: context.store must implement observable` // eslint-disable-line
      }
      return null
    }
  }

  return ComponentFromStream
}
