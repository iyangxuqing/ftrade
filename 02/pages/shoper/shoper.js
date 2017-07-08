import { http } from '../../utils/http.js'
import { Shop } from '../../utils/shop.js'

let app = getApp()
let hasChanged = false

Page({

  data: {
    youImageMode: app.youImageMode
  },

  onShopLogoTap: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0]
        http.cosUpload({
          source: tempFilePath,
          target: 'images/' + Date.now() + '.jpg'
        }).then(function (res) {
          let url = res.url
          this.setData({
            'shop.logo': url
          })
        }.bind(this))
        hasChanged = true
      }.bind(this)
    })
  },

  onShopNameBlur: function (e) {
    let value = e.detail.value
    let oldValue = this.data.shop.name
    if (value == oldValue) return
    if (value == '') value = oldValue
    this.setData({
      'shop.name': value
    })
    if (value != oldValue) hasChanged = true

  },

  onShopPhoneBlur: function (e) {
    let value = e.detail.value
    let oldValue = this.data.shop.phone
    if (value == oldValue) return
    if (value == '') value = oldValue
    this.setData({
      'shop.phone': value
    })
    if (value != oldValue) hasChanged = true
  },

  onShopAddressBlur: function (e) {
    let value = e.detail.value
    let oldValue = this.data.shop.address
    if (value == oldValue) return
    if (value == '') value = oldValue
    this.setData({
      'shop.address': value
    })
    if (value != oldValue) hasChanged = true
  },

  onManagementTap: function (e) {
    wx.navigateTo({
      url: '../categorys/categorys',
    })
  },

  onShopTap: function (e) {
    wx.redirectTo({
      url: '../client/products/products',
    })
  },

  loadShop: function () {
    Shop.get().then(function (shop) {
      this.setData({
        shop: shop,
        ready: true,
      })
    }.bind(this))
  },

  saveShop: function (cb) {
    let shop = this.data.shop
    Shop.set(shop).then(function () {
      app.listener.trigger('shopUpdate', shop)
    })
  },

  onLogin: function () {
    this.loadShop()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.listener.on('login', this.onLogin)

    if (app.token) this.loadShop()
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
    if (hasChanged) this.saveShop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (hasChanged) this.saveShop()
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