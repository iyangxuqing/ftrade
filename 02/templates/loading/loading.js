export class Loading {

  constructor() {
    this.showTimer = null
  }

  show(options = {}) {
    let page = getCurrentPages().pop()
    page.setData({
      'loading.show': true,
    })
    this.showTimer = setTimeout(function () {
      page.setData({
        'loading.showIcon': true
      })
    }, 500)
  }

  hide() {
    let page = getCurrentPages().pop()
    clearTimeout(this.showTimer)
    page.setData({
      'loading.show': false
    })
  }

}

export class PageLoading {

  constructor() {
    this.showTimer = null
    this.hideTimer = null
  }

  show(options = {}) {
    let page = getCurrentPages().pop()
    page.setData({
      'pageLoading.fade': '',
      'pageLoading.show': true,
    })
    clearTimeout(this.hideTimer)
    this.showTimer = setTimeout(function () {
      page.setData({
        'pageLoading.showIcon': true
      })
    }, 500)
  }

  hide() {
    let page = getCurrentPages().pop()
    clearTimeout(this.showTimer)
    page.setData({
      'pageLoading.fade': 'fade'
    })
    this.hideTimer = setTimeout(function () {
      page.setData({
        'pageLoading.show': false
      })
    }, 200)
  }

}