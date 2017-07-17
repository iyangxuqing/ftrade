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
  },

  init: function () {
    this.toptip = new Toptip()
    this.loading = new Loading()
    this.listener = new Listener()
    this.youImageMode = config.youImage.mode
    if (!wx.getStorageSync('language')) {
      wx.setStorageSync('language', 'en')
    }
    this.lang = wx.getStorageSync('language')
    this.cache = true
  },

  login: function (cb) {
    wx.login({
      success: function (res) {
        if (res.code) {
          http.get({
            url: '_ftrade/user.php?m=login',
            data: { code: res.code },
            slient: true
          }).then(function (res) {
            if (res.errno === 0) {
              wx.setStorageSync('token', res.token)
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  },

  requestTask: {},
  autoRequestTask: [],

})