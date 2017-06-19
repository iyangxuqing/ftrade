import { http } from '../../utils/http.js'
import { Loading } from '../../templates/loading/loading.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop: {
      logo: '/images/icon/logo.png',
      name: '尹美饰品',
      phone: '(+086)15855556688',
      address: '国际商贸城一区123066号'
    },
    editor: {
      left: -1000
    }
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
      }.bind(this)
    })
  },

  onShopNameTap: function (e) {
    if (this.data.editor.left > -1) {
      this.setData({ 'editor.left': -1000 })
      return
    }
    let offsetTop = e.currentTarget.offsetTop
    let offsetLeft = e.currentTarget.offsetLeft
    this.setData({
      'editor.type': 'shop-name',
      'editor.value': this.data.shop.name,
      'editor.placeholder': '输入店铺名称',
    })
    setTimeout(function () {
      this.setData({
        'editor.focus': true,
        'editor.top': offsetTop,
        'editor.left': offsetLeft,
      })
    }.bind(this), 10)
  },

  onShopPhoneTap: function (e) {
    if (this.data.editor.left > -1) {
      this.setData({ 'editor.left': -1000 })
      return
    }
    let offsetTop = e.currentTarget.offsetTop
    let offsetLeft = e.currentTarget.offsetLeft
    console.log(offsetTop, offsetLeft)
    this.setData({
      'editor.type': 'shop-phone',
      'editor.value': this.data.shop.phone,
      'editor.placeholder': '输入电话号码',
    })
    setTimeout(function () {
      this.setData({
        'editor.focus': true,
        'editor.top': offsetTop,
        'editor.left': offsetLeft,
      })
    }.bind(this), 10)
  },

  onShopAddressTap: function (e) {
    if (this.data.editor.left > -1) {
      this.setData({ 'editor.left': -1000 })
      return
    }
    let offsetTop = e.currentTarget.offsetTop
    let offsetLeft = e.currentTarget.offsetLeft
    console.log(offsetTop, offsetLeft)
    this.setData({
      'editor.type': 'shop-address',
      'editor.value': this.data.shop.address,
      'editor.placeholder': '输入店铺地址',
    })
    setTimeout(function () {
      this.setData({
        'editor.focus': true,
        'editor.top': offsetTop,
        'editor.left': offsetLeft,
      })
    }.bind(this), 10)
  },

  onManagementTap: function (e) {
    wx.navigateTo({
      url: '../categorys/categorys',
    })
  },

  onEditorBlur: function (e) {
    let editor = this.data.editor
    let type = editor.type
    let oldValue = editor.value
    let value = e.detail.value

    setTimeout(function () {
      this.setData({ 'editor.left': -1000 })
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

    http.get({
      url: '_ftrade/shop.php?m=set',
      data: this.data.shop
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading = new Loading()
    this.loading.show()

    let platform = wx.getSystemInfoSync().platform
    this.setData({ platform })

    http.get({
      url: '_ftrade/shop.php?m=get'
    }).then(function (res) {
      let shop = res.shop || this.data.shop
      this.setData({
        shop: shop,
        ready: true
      })
      this.loading.hide()
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