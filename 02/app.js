import 'utils/util.js'
import { Listener } from 'utils/listener.js'

App({
  onLaunch: function () {
    this.listener = new Listener()

    var language = wx.getStorageSync('language')
    if (!language) {
      language = 'en'
      wx.setStorageSync('language', language)
    }
    
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})