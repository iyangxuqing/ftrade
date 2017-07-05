export class Toptip {

  constructor() {
    this.timer = null
    // let page = getCurrentPages().pop()
    // page.setData({
    //   toptip: {
    //     show: '',
    //     title: '',
    //     onClose: 'toptip.onClose'
    //   }
    // })
    // page['toptip.onClose'] = this.hide
  }

  show(title) {
    let page = getCurrentPages().pop()
    if (page) {
      page.setData({
        'toptip.show': 'show',
        'toptip.title': title,
        'toptip.onClose': 'toptip.onClose'
      })
      page['toptip.onClose'] = this.hide
      clearTimeout(this.timer)
      this.timer = setTimeout(function () {
        page.setData({
          'toptip.show': ''
        })
      }, 3000)
    }
  }

  hide() {
    let page = getCurrentPages().pop()
    if (page) {
      clearTimeout(this.timer)
      page.setData({
        'toptip.show': ''
      })
    }
  }

}