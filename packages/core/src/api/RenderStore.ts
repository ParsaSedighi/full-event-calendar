export class RenderStore {
  subscribers: any = []
  state = new Map()
  constructor() {
    this.subscribers = []
  }

  subscribe(subscriber: any) {
    this.subscribers.push(subscriber)

    // Return a function to unsubscribe
    return () => {
      this.subscribers = this.subscribers.filter((sub: any) => sub !== subscriber)
    }
  }

  dispatch(customRender: any) {
    this.state.set(customRender.id, customRender)
    // console.log('slot render req',customRender)

    // Notify subscribers about the state change
    this.subscribers.forEach((subscriber: any) => {
      if (typeof subscriber === 'function') {
      }
      subscriber(this.state)
    })
  }

  remove(id: any) {
    if (this.state.delete(id)) {
      // notify subscribers so portals into removed targets are cleaned up
      this.subscribers.forEach((subscriber: any) => {
        subscriber(this.state)
      })
    }
  }

  getState() {
    return this.state
  }
}
