import { http } from '../../utils/http.js'
let config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  onTestTap: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      //sizeType: ['original'],
      success: function (res) {
        let sourcePath = res.tempFilePaths[0]
        let targetPath = Date.now() + '.jpg'
        let dir = 'ftrade/' + config.sid
        this.cosUpload({
          dir: dir,
          sourcePath,
          targetPath: Date.now() + '.jpg',
        }).then(function (res) {
          this.setData({
            image: res.targetPath
          })
        }.bind(this))
      }.bind(this)
    })
  },

  cosUpload: function (options) {
    return new Promise(function (resolve, reject) {
      let filePath = options.sourcePath
      http.get({
        url: '_ftrade/cos.php?m=signature',
        data: {
          dir: options.dir,
          filename: options.targetPath
        }
      }).then(function (res) {
        let url = res.url
        let sign = res.multi_signature
        wx.uploadFile({
          url: url,
          name: 'filecontent',
          filePath: filePath,
          header: {
            Authorization: sign,
          },
          formData: {
            op: 'upload',
            insertOnly: 0,
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              let data = JSON.parse(res.data)
              if (data.message && data.message == 'SUCCESS') {
                resolve({
                  errno: 0,
                  error: '',
                  targetPath: data.data.source_url
                })
              }
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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