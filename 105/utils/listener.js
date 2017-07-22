export class Listener {
  constructor() {
    this.listener = {}
  }

  on(eventName, callback) {
    if (!this.listener[eventName]) this.listener[eventName] = []
    this.listener[eventName].push(callback)
  }

  off(eventName, callback) {
    var listener = this.listener[eventName]
    if (!callback) {
      this.listener[eventName] = []
    } else {
      var index = listener.indexOf(callback)
      if (index >= 0) listener.splice(index, 1)
    }
  }

  trigger(eventName) {
    var args = Array.prototype.slice.apply(arguments).slice(1)
    var listener = this.listener[eventName]
    if (!Array.isArray(listener)) return
    listener.forEach(function (callback) {
      try {
        callback.apply(this, args)
      } catch (e) {
        console.error(e)
      }
    })
  }
}