import { http } from '../../utils/http.js'
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
        var tempFilePaths = res.tempFilePaths
        this.setData({
          'shop.logo': tempFilePaths[0]
        })
        hasChanged = true
        http.upload({
          paths: tempFilePaths
        }).then(function (res) {
          let logo = res.uploadedFiles[0].target
          this.data.shop.logo_remote = logo
        }.bind(this))
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

  onEditorBlur: function (e) {
    let editor = this.data.editor
    let type = editor.type
    let value = e.detail.value
    let oldValue = editor.value

    setTimeout(function () {
      this.setData({
        'editor.left': -1000,
        'editor.focus': false,
      })
    }.bind(this), 0)

    if (value == '' || value == oldValue) return

    if (type == 'shop-name') {
      this.setData({
        'shop.name': value
      })
    }
    if (type == 'shop-phone') {
      this.setData({
        'shop.phone': value
      })
    }
    if (type == 'shop-address') {
      this.setData({
        'shop.address': value
      })
    }
  },

  onLogin: function () {
    this.loadShop()
  },

  loadShop: function (cb) {
    this.loading.show()
    http.get({
      url: '_ftrade/shop.php?m=get'
    }).then(function (res) {
      if (res.errno === 0) {
        let shop = res.shop || {}
        if (!shop.mobile) shop.phone = getApp().user.mobile
        this.setData({
          shop: shop,
          ready: true
        })
        this.loading.hide()
        cb && cb(shop)
      }
    }.bind(this))
  },

  saveShop: function (cb) {
    let shop = this.data.shop
    if (shop.logo_remote) {
      shop.logo = shop.logo_remote
    }
    delete shop.logo_remote
    http.get({
      url: '_ftrade/shop.php?m=set',
      data: shop
    }).then(function (res) {
      cb && cb(res)
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