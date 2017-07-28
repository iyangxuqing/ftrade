import { User, config } from 'utils/mina.js'

App({
  onLaunch: function () {
    this.init()
  },

  init: function () {
    this.youImageMode = config.youImage.mode
    this.phrases = config.phrases
    if (!wx.getStorageSync('language')) {
      wx.setStorageSync('language', 'en')
    }
    this.lang = wx.getStorageSync('language')
    User.login()
  },

})