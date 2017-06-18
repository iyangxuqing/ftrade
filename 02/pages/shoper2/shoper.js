import { Toptip } from '../../templates/toptip/toptip.js'
import { Mobile } from '../../templates/mobile/mobile.js'

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
    editor: {}
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
    let editor = this.editor
    if (editor && editor.show) return

    let offsetTop = e.currentTarget.offsetTop
    let offsetLeft = e.currentTarget.offsetLeft
    console.log(offsetTop, offsetLeft)
    
    this.setData({
      editor: {
        show: true,
        top: offsetTop,
        left: offsetLeft,
        type: 'shop-name',
        focus: true,
        value: this.data.shop.name,
        placeholder: '输入店铺名称',
      }
    })
  },

  onShopPhoneTap: function (e) {
    let editor = this.editor
    if (editor && editor.show) return

    let offsetTop = e.currentTarget.offsetTop
    let offsetLeft = e.currentTarget.offsetLeft
    this.setData({
      editor: {
        show: true,
        top: offsetTop,
        left: offsetLeft,
        type: 'shop-phone',
        focus: true,
        value: this.data.shop.phone,
        placeholder: '输入电话号码',
      }
    })
  },

  onShopAddressTap: function (e) {
    let editor = this.editor
    if (editor && editor.show) return

    let offsetTop = e.currentTarget.offsetTop
    let offsetLeft = e.currentTarget.offsetLeft
    this.setData({
      editor: {
        show: true,
        top: offsetTop,
        left: offsetLeft,
        type: 'shop-address',
        focus: true,
        value: this.data.shop.address,
        placeholder: '输入店铺地址',
      }
    })
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
      this.setData({
        'editor.show': false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let platform = wx.getSystemInfoSync().platform
    this.setData({
      platform
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