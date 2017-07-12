let config = require('utils/config.js')
import 'utils/util.js'
import { http } from 'utils/http.js'
import { Listener } from 'utils/listener.js'
import { Toptip } from 'templates/toptip/toptip.js'
import { Loading } from 'templates/loading/loading.js'

App({
  onLaunch: function () {
    this.init()
    this.login()
    let time = 1499760727000
    let str = new Date(time)
    console.log(str)
  },

  init: function () {
    this.toptip = new Toptip()
    this.loading = new Loading()
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