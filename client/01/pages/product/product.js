import { Product } from '../../utils/products.js'

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

  loadData: function (id, cid) {
    let page = this
    page.setData({ id, cid })
    Product.getProducts({ cid })
      .then(function (products) {
        let current = 0
        let favorites = wx.getStorageSync('favorites')
        for (let i in products) {
          if (products[i].id == id) {
            current = i
          }
          if (favorites['i' + products[i].id]) {
            products[i].favorite = true
          }
        }
        page.setData({
          ready: true,
          current: current,
          products: products,
        })
      })
  },

  onLoad: function (options) {
    let id = options.id
    let cid = options.cid
    let lang = app.lang
    wx.setNavigationBarTitle({
      title: app.phrases.productDetail[lang],
    })
    this.setData({
      language: lang,
      phrases: {
        productDetail: app.phrases.productDetail[lang],
        pricesTitle: app.phrases.pricesTitle[lang],
        propsTitle: app.phrases.propsTitle[lang],
        networkFail: app.phrases.networkFail[lang],
      }
    })
    this.loadData(id, cid)
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