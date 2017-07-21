import { Loading } from '../../templates/loading/loading.js'
import { Product } from '../../utils/products.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode
  },

  onReloadProduct: function (e) {
    let id = this.data.id
    let cid = this.data.cid
    this.loadProduct(id, cid)
  },

  loadProduct: function (id, cid) {
    let page = this
    page.loading.show()
    Product.getProduct({ id, cid })
      .then(function (product) {
        page.setData({
          ready: true,
          product: product,
          productFail: false,
        })
        page.loading.hide()
      })
      .catch(function (res) {
        page.setData({
          productFail: true,
        })
        page.loading.hide()
      })
  },

  onLoad: function (options) {
    this.loading = new Loading(this)

    let id = options.id
    let cid = options.cid
    let lang = app.lang
    wx.setNavigationBarTitle({
      title: app.phrases.productDetail[lang],
    })
    this.setData({
      id: id,
      cid: cid,
      language: lang,
      phrases: {
        productDetail: app.phrases.productDetail[lang],
        pricesTitle: app.phrases.pricesTitle[lang],
        propsTitle: app.phrases.propsTitle[lang],
        networkFail: app.phrases.networkFail[lang],
      }
    })
    this.loadProduct(id, cid)
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