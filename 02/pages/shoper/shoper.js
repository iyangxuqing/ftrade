import { http } from '../../utils/http.js'
import { Shop } from '../../utils/shop.js'
import { Loading } from '../../templates/loading/loading.js'

let hasChanged = false

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShopLogoTap: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0]
        http.cosUpload({
          source: tempFilePath,
          target: 'images/shoplogo.png'
        }).then(function (res) {
          let url = res.url
          this.setData({
            'shop.logo': url + "&t=" + Date.now()
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

  // onEditorBlur: function (e) {
  //   let editor = this.data.editor
  //   let type = editor.type
  //   let value = e.detail.value
  //   let oldValue = editor.value

  //   setTimeout(function () {
  //     this.setData({
  //       'editor.left': -1000,
  //       'editor.focus': false,
  //     })
  //   }.bind(this), 0)

  //   if (value == '' || value == oldValue) return

  //   if (type == 'shop-name') {
  //     this.setData({
  //       'shop.name': value
  //     })
  //   }
  //   if (type == 'shop-phone') {
  //     this.setData({
  //       'shop.phone': value
  //     })
  //   }
  //   if (type == 'shop-address') {
  //     this.setData({
  //       'shop.address': value
  //     })
  //   }
  // },

  onLogin: function () {
    this.loadShop()
  },

  loadShop: function () {
    this.loading.show()
    Shop.get().then(function (shop) {
      this.setData({
        shop: shop,
        ready: true
      })
      this.loading.hide()
    }.bind(this))
  },

  saveShop: function (cb) {
    let shop = this.data.shop
    Shop.set(shop).then(function(){
      let app = getApp()
      app.shop = shop
      app.listener.trigger('shopUpdate')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading = new Loading()
    getApp().listener.on('login', this.onLogin)
    let platform = wx.getSystemInfoSync().platform
    this.setData({ platform })

    let token = wx.getStorageSync('token')
    if (token) this.loadShop()
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
    console.log('onHide')
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