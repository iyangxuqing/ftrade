export class Loading {

  constructor() {
    this.count = 0
    this.timer = null
  }

  show() {
    this.count++
    let page = getCurrentPages().pop()
    if (page) {
      if (this.count == 1) {
        page.setData({
          'loading.show': true,
        })
        this.timer = setTimeout(function () {
          page.setData({
            'loading.showIcon': true
          })
        }, 300)
      }
    }
  }

  hide() {
    this.count--
    let page = getCurrentPages().pop()
    if (page) {
      if (this.count == 0) {
        clearTimeout(this.timer)
        page.setData({
          'loading.show': false
        })
      }
    }
  }

}