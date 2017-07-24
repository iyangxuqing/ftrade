export class Toptip {

  constructor() {
    this.timer = null
  }

  show(title) {
    let page = getCurrentPages().pop()
    if (page) {
      page.setData({
        'toptip.show': 'show',
        'toptip.title': title,
      })
      clearTimeout(this.timer)
      this.timer = setTimeout(function () {
        page.setData({
          'toptip.show': ''
        })
      }, 1500)
    }
  }

}