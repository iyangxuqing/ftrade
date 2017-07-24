import { Category } from '../../utils/categorys.js'
import { __cates } from '../../utils/categorys.js'
import { Product } from '../../utils/products.js'

var touchPositionX = 0
var touchPositionY = 0
var productlongtap = false
var productEditTimer = null

Page({

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
    this.setData({
      editId: -1
    })
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
    let cid = this.data.cate.id
    let moving = this.data.moving
    let sourceIndex = moving.sourceIndex
    let targetIndex = moving.targetIndex
    let products = Product.sort(cid, sourceIndex, targetIndex)
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
    let cid = this.data.cate.id
    let products = this.data.products
    this.setData({
      editId: -1
    })
    wx.navigateTo({
      url: '../product/product?id=' + id + '&cid=' + cid,
    })
  },

  onProductLongTap: function (e) {
    productlongtap = true
    let id = e.currentTarget.dataset.id
    this.setData({
      editId: id
    })
    clearTimeout(productEditTimer)
    productEditTimer = setTimeout(function () {
      this.setData({
        editId: -1
      })
    }.bind(this), 6000)
  },

  onProductDel: function (e) {
    let id = e.currentTarget.dataset.id
    let cid = this.data.cate.id
    let products = Product.del({ id, cid })
    console.log('products-del', products)
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

  onProductsUpdate: function (products, product) {
    console.log('onProductsUpdate')
    this.setData({
      products: products
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().listener.on('products', this.onProductsUpdate)

    let cid = options.id
    let cate = Category.get({ id: cid })
    this.setData({
      cate: cate
    })
    Product.get({ cid: cid }).then(function (res) {
      this.setData({
        products: res
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