export class Loading {

  constructor(page) {
    this.page = page
    this.timer = null
  }

  show() {
    let page = this.page
    page.setData({
      'loading.show': true,
    })
    this.timer = setTimeout(function () {
      page.setData({
        'loading.showIcon': true
      })
    }, 500)
  }

  hide() {
    clearTimeout(this.timer)
    this.page.setData({
      'loading.show': false
    })
  }

}