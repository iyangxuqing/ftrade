import 'utils/util.js'
import { http } from 'utils/http.js'
import { Listener } from 'utils/listener.js'

App({
  onLaunch: function () {
    this.login()
    this.listener = new Listener()

    var language = wx.getStorageSync('language')
    if (!language) {
      language = 'en'
      wx.setStorageSync('language', language)
    }

  },

  login: function (cb) {
    wx.login({
      success: function (res) {
        if (res.code) {
          http.get({
            url: '_ftrade/user.php?m=login',
            data: { code: res.code }
          }).then(function (res) {
            if(res.token){
              wx.setStorageSync('token', res.token)
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  }
})