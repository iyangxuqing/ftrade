let config = require('utils/config.js')
import 'utils/util.js'
import { http } from 'utils/http.js'
import { Listener } from 'utils/listener.js'

App({
  onLaunch: function () {
    this.init()
    this.login()
  },

  init: function () {
    this.listener = new Listener()
    this.youImageMode = config.youImage.mode_w300
    if (!wx.getStorageSync('language')) {
      wx.setStorageSync('language', 'en')
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
            if (res.errno === 0) {
              this.user = res.user
              this.token = res.token
              wx.setStorageSync('token', res.token)
              this.listener.trigger('login')
            }
          }.bind(this))
        }
      }.bind(this)
    })
  },

  globalData: {
    userInfo: null
  }
})