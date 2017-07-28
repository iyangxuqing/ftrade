import { Product } from '../../utils/mina.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode
  },

  onFavoriteTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cid = e.currentTarget.dataset.cid
    let favorite = false
    let products = this.data.products
    for (let i in products) {
      if (products[i].id == id) {
        favorite = !products[i].favorite
        products[i].favorite = favorite
        break
      }
    }
    this.setData({
      products: products
    })

    let favorites = wx.getStorageSync('favorites') || {}
    if (favorite) {
      favorites['i' + id] = true
    } else {
      delete favorites['i' + id]
    }
    wx.setStorageSync('favorites', favorites)
  },

  onLoad: function (options) {
    let id = options.id
    let cid = options.cid
    let lang = app.lang
    let phrases = {
      pricesTitle: app.phrases['pricesTitle'][lang],
      propsTitle: app.phrases['propsTitle'][lang],
    }
    wx.setNavigationBarTitle({
      title: app.phrases['productDetail'][lang],
    })

    let products = app.favorites
    let index = 0
    for (let i in products) {
      products[i].favorite = true
      if (products[i].id == id) {
        index = i
      }
    }
    this.setData({
      phrases,
      products,
      ready: true,
      current: index,
      language: lang,
    })
  },

  onShareAppMessage: function () {

  }

})