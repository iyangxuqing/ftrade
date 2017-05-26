import { Category } from '../../utils/category.js'

var touch = {}

Page({

  /**
   * 页面的初始数据
   */
  cid: '',

  data: {
    moveId: '',
    offset: {
      left: -1000,
      top: -1000
    },

    moving: {
      top: 0,
      left: 0,
      display: 'none',
      product: {},
      sourceIndex: -1,
      targetIndex: -1,
    }

  },

  touchstart: function (e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let products = this.data.products
    this.data.moving.sourceIndex = index
    this.data.moving.product = products[index]

    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.offsetLeft = e.currentTarget.offsetLeft
    touch.offsetTop = e.currentTarget.offsetTop
  },

  touchmove: function (e) {
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    let x = touch.x2 - touch.x1 + touch.offsetLeft
    let y = touch.y2 - touch.y1 + touch.offsetTop

    let i = Math.round(y / 140)
    let j = Math.round(x / 110)
    let targetIndex = i * 3 + j
    let moving = this.data.moving
    moving.left = x
    moving.top = y
    moving.display = 'block'
    moving.targetIndex = targetIndex
    this.setData({
      moving: moving
    })
  },

  touchend: function (e) {
    let moving = this.data.moving
    let sourceIndex = moving.sourceIndex
    let targetIndex = moving.targetIndex
    let products = this.data.products
    let product = products[sourceIndex]
    products.splice(sourceIndex, 1)
    products.splice(targetIndex, 0, product)
    moving.display = 'none'
    moving.sourceIndex = -1
    moving.targetIndex = -1
    this.setData({
      products: products,
      moving: moving,
    })
  },

  onProductAdd: function (e) {
    let cid = this.data.cate.id
    wx.navigateTo({
      url: '../product/product?cid=' + cid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.id || 89
    this.cid = cid
    let cpid = options.pid || 85
    let cate = { id: cid, pid: cpid }
    Category.get().then(function (cates) {
      wx.setStorageSync('cates', cates)
      for (let i in cates) {
        if (cates[i].id == cpid) {
          cate.ptitle = cates[i].title
          cate.pthumb = cates[i].thumb
        }
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cid) {
            cate.title = cates[i].children[j].title
            cate.thumb = cates[i].children[j].thumb
            break
          }
        }
        if (cate.title) break;
      }
      this.setData({
        cate: cate
      })
    }.bind(this))

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
    let cid = this.cid
    let _products = wx.getStorageSync('products')
    let products = []
    for (let i in _products) {
      _products[i].images = _products[i].images_remote
      if (_products[i].cid == cid) {
        products.push(_products[i])
      }
    }
    this.setData({
      products: products
    })

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