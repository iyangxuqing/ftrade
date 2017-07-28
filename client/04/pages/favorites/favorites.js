import { Product } from '../../utils/mina.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode
  },

  loadFavorites: function () {
    let lang = app.lang
    let favorites = wx.getStorageSync('favorites') || {}
    let ids = []
    for (let i in favorites) {
      ids.push(i.replace('i', ''))
    }
    favorites = Product.getProduct({ ids })
    app.favorites = favorites
    let myFavorite = app.phrases['myFavorite'][lang]
    let myFavoriteEmpty = app.phrases['myFavoriteEmpty'][lang]
    wx.setNavigationBarTitle({
      title: myFavorite
    })
    this.setData({
      favorites,
      myFavoriteEmpty,
      language: lang,
    })
  },

  onFavoriteTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '../favorite/favorite?id=' + id + '&cid=' + cid,
    })
  },

  onLoad: function (options) {

  },

  onShow: function (options) {
    this.loadFavorites()
  },

  onShareAppMessage: function () {

  }

})