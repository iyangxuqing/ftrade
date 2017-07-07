import { Toptip } from '../../templates/toptip/toptip.js'
import { Mobile } from '../../templates/mobile/mobile.js'

Page({

  data: {

  },

  onMobileVerified: function (options) {
    if(options.mobileVerified){
      let user = getApp().user
      user.role = options.role
      user.mobile = options.mobile
      user.mobileVerified = options.mobileVerified
      setTimeout(function(){
        wx.redirectTo({
          url: '../shoper/shoper',
        })
      }, 1000)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toptip = new Toptip()
    this.mobile = new Mobile(this.onMobileVerified)
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