
var touch = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {

    product: {
      images: new Array(5),
      prices: [],
      props: [],
      newPrice: {},
      newProp: {},
    },

  },

  touchstart: function (e) {
    touch.id = e.currentTarget.dataset.id
    touch.type = e.currentTarget.dataset.type
    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.t1 = e.timeStamp;
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  touchmove: function (e) {
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  touchend: function (e) {
    touch.t2 = e.timeStamp
    let dx = touch.x2 - touch.x1
    let dy = touch.y2 - touch.y1
    let dt = touch.t2 - touch.t1
    if ((Math.abs(dy) < Math.abs(dx) && dt < 250)) {
      if (dx < -20) this.onSwiperLeft(touch.id, touch.type)
      if (dx > 20) this.onSwiperRight(touch.id, touch.type)
    }
  },

  onSwiperLeft: function (id, type) {
    let items = []
    if (type == 'price') {
      items = this.data.product.prices
    } else if (type == 'prop') {
      items = this.data.product.props
    }
    for (let i in items) {
      items[i].swipeLeft = false
      items[i].swipeRight = false
      if (items[i].id == id) {
        items[i].swipeLeft = true
      }
    }
    if (type == 'price') {
      this.setData({
        'product.prices': items,
      })
    } else if (type == 'prop') {
      this.setData({
        'product.props': items
      })
    }
  },

  onSwiperRight: function (id, type) {
    let items = []
    if (type == 'price') {
      items = this.data.product.prices
    } else if (type == 'prop') {
      items = this.data.product.props
    }
    for (let i in items) {
      items[i].swipeLeft = false
      items[i].swipeRight = false
      if (items[i].id == id) {
        items[i].swipeRight = true
      }
    }
    if (type == 'price') {
      this.setData({
        'product.prices': items,
      })
    } else if (type == 'prop') {
      this.setData({
        'product.props': items
      })
    }
  },

  onItemLabelAdd: function (e) {
    let label = e.detail.value
    let type = e.currentTarget.dataset.type
    let items = []
    let newItem = {}
    if (type == 'prop') {
      items = this.data.product.props
      newItem = this.data.product.newProp
    } else if (type == 'price') {
      items = this.data.product.prices
      newItem = this.data.product.newPrice
    }
    newItem.id = Date.now()
    newItem.label = label
    if (newItem.label && newItem.value) {
      items.push(newItem)
      if (type == 'prop') {
        this.setData({
          'product.props': items,
          'product.newProp': { label: '', value: '' },
        })
      } else if (type == 'price') {
        this.setData({
          'product.prices': items,
          'product.newPrice': { label: '', value: '' },
        })
      }
    }
  },

  onItemValueAdd: function (e) {
    let label = e.detail.value
    let type = e.currentTarget.dataset.type
    let items = []
    let newItem = {}
    if (type == 'prop') {
      items = this.data.product.props
      newItem = this.data.product.newProp
    } else if (type == 'price') {
      items = this.data.product.prices
      newItem = this.data.product.newPrice
    }
    newItem.value = label
    if (newItem.label && newItem.value) {
      items.push(newItem)
      if (type == 'prop') {
        this.setData({
          'product.props': items,
          'product.newProp': { label: '', value: '' },
        })
      } else if (type == 'price') {
        this.setData({
          'product.prices': items,
          'product.newPrice': { label: '', value: '' },
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.cid || 89
    let cates = wx.getStorageSync('cates')
    let cate = {}
    for (let i in cates) {
      for (let j in cates[i].children) {
        if (cates[i].children[j].id == cid) {
          cate.id = cid
          cate.pid = cates[i].id
          cate.ptitle = cates[i].title
          cate.pthumb = cates[i].thumb
          cate.title = cates[i].children[j].title
          cate.thumb = cates[i].children[j].thumb
          break;
        }
      }
      if (cate.title) break
    }
    this.setData({
      cate: cate
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})