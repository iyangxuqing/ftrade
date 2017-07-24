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
    this.youImageMode = config.youImage.mode
    this.phrases = config.phrases
    if (!wx.getStorageSync('language')) {
      wx.setStorageSync('language', 'en')
    }
    this.lang = wx.getStorageSync('language')
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

  requestTasks: [
    {
      task: 'categorys',
      arg: null,
      cycle: 1,
      finished: false,
    },
    {
      task: 'products',
      arg: '',
      cycle: 1,
      finished: false,
    },
    {
      task: 'product',
      arg: '',
      cycle: 2,
      finished: false
    }
  ]

})