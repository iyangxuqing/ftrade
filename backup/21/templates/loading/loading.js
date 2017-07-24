export class Loading {

  constructor() {
    this.showTimer = null
  }

  show() {
    let page = getCurrentPages().pop()
    if (page) {
      page.setData({
        'loading.show': true,
      })
      clearTimeout(this.showTimer)
      this.showTimer = setTimeout(function () {
        page.setData({
          'loading.showIcon': true
        })
      }, 500)
    }
  }

  hide() {
    let page = getCurrentPages().pop()
    if (page) {
      clearTimeout(this.showTimer)
      page.setData({
        'loading.show': false
      })
    }
  }

}