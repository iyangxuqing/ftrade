import { Product } from '../../utils/products.js'

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadFavorites()
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
    this.loadFavorites()
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