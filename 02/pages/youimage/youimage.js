let config = require('../../utils/config.js')
import { http } from '../../utils/http.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  cosList: function (options = {}) {
    let self = this
    let host = 'https://sh.file.myqcloud.com/files/v2/'
    let dir = '1253299728/ftrade/' + config.sid + '/'
    let url = host + dir
    if (!options.infos) options.infos = []
    http.get({
      url: '_ftrade/cos.php?m=signature',
    }).then(function (res) {
      wx.request({
        url,
        header: {
          Authorization: res.multi_signature
        },
        data: {
          op: 'list',
          num: 1000,
          context: options.context || ''
        },
        success: function (res) {
          if (res.data && res.data.message == 'SUCCESS') {
            let data = res.data.data
            options.infos = options.infos.concat(data.infos)
            if (data.listover == false) {
              self.cosList({
                context: data.context,
                infos: options.infos,
                success: options.success
              })
            } else {
              options.success && options.success(options.infos)
            }
          }
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cosList({
      success: function (res) {
        console.log(res)
      }
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