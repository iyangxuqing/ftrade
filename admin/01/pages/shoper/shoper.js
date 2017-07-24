import { http } from '../../utils/http.js'
import { Shop } from '../../utils/shop.js'
import { Loading } from '../../templates/loading/loading'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode,
  },

  onShopLogoTap: function (e) {
    let page = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePath = res.tempFilePaths[0]
        page.setData({
          'shop.logo': tempFilePath
        })
        http.cosUpload({
          source: tempFilePath,
          target: 'images/' + Date.now() + '.jpg'
        }).then(function (res) {
          if(res.errno===0){
            let url = res.url
            Shop.set({ logo: url })
          }
        })
      }
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
    if (value != oldValue) {
      Shop.set({ name: value })
    }

  },

  onShopPhoneBlur: function (e) {
    let value = e.detail.value
    let oldValue = this.data.shop.phone
    if (value == oldValue) return
    if (value == '') value = oldValue
    this.setData({
      'shop.phone': value
    })
    if (value != oldValue) {
      Shop.set({ phone: value })
    }
  },

  onShopAddressBlur: function (e) {
    let value = e.detail.value
    let oldValue = this.data.shop.address
    if (value == oldValue) return
    if (value == '') value = oldValue
    this.setData({
      'shop.address': value
    })
    if (value != oldValue) {
      Shop.set({ address: value })
    }
  },

  onManagementTap: function (e) {
    wx.navigateTo({
      url: '../categorys/categorys',
    })
  },

  onNetFailRetry: function () {
    this.loadShop()
  },

  loadShop: function () {
    let page = this
    page.loading.show()
    Shop.get()
      .then(function (shop) {
        page.setData({
          shop: shop,
          ready: true,
          'netfail.show': false,
        })
        page.loading.hide()
      })
      .catch(function (res) {
        page.setData({
          ready: false,
          'netfail.show': true,
        })
        page.loading.hide()
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading = new Loading(this)
    this.loadShop()
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