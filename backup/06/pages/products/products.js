import { Category } from '../../utils/category.js'
import { Product } from '../../utils/products.js'

var touchPositionX = 0
var touchPositionY = 0
var productlongtap = false
var productDeleteTimer = null

Page({

  /**
   * 页面的初始数据
   */
  cid: '',

  data: {

    moving: {
      top: 0,
      left: 0,
      product: {},
      sourceIndex: -1,
      targetIndex: -1,
      display: 'none',
    }

  },

  touchstart: function (e) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let row = Math.floor(index / 3)
    let col = index % 3
    let offsetLeft = col * 110
    let offsetTop = row * 140
    touchPositionX = x - offsetLeft
    touchPositionY = y - offsetTop

    let products = this.data.products
    this.data.moving.sourceIndex = index
    this.data.moving.product = products[index]
  },

  touchmove: function (e) {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let left = x - touchPositionX
    let top = y - touchPositionY

    let row = Math.round(top / 140)
    let col = Math.round(left / 110)
    if (col < 0) col = 0
    if (col > 2) col = 2
    let targetIndex = row * 3 + col

    let moving = this.data.moving
    moving.left = left
    moving.top = top
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
    Product.sort(products, sourceIndex, targetIndex)
    moving.display = 'none'
    moving.sourceIndex = -1
    moving.targetIndex = -1
    this.setData({
      products: products,
      moving: moving,
    })
  },

  onProductTap: function (e) {
    if (productlongtap) {
      productlongtap = false
      return
    }
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    wx.navigateTo({
      url: '../product/product?id=' + id + '&cid=' + this.cid,
    })
  },

  onProductLongTap: function (e) {
    productlongtap = true
    let index = e.currentTarget.dataset.index
    let products = this.data.products
    for (let i in products) {
      products[i].editor = false
    }
    products[index].editor = true
    this.setData({
      products: products
    })

    clearTimeout(productDeleteTimer)
    productDeleteTimer = setTimeout(function () {
      let products = this.data.products
      for (let i in products) {
        products[i].editor = false
      }
      this.setData({
        products: products
      })
    }.bind(this), 6000)
  },

  onProductDel: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    Product.del(products, id)
    this.setData({
      products: products
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