import { Product } from '../../../utils/products.js'

let app = getApp()

var Phrases = {
  navTitle: {
    'zh': '商品详情',
    'en': 'Commodity Details',
    'ara': ' تفاصيل المنتج ',
    'kor': '상품 설명',
  },
  pricesTitle: {
    'zh': '批发价格',
    'en': 'Wholesale Price',
    'ara': ' سعر الجملة ',
    'kor': '도매 가격',
  },
  propsTitle: {
    'zh': '商品属性',
    'en': 'Commodity Attribute',
    'ara': ' السلع صفة ',
    'kor': '상품 특성',
  }
}

Page({

  data: {
    youImageMode: app.youImageMode
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let lang = app.lang
    let phrases = {
      navTitle: Phrases['navTitle'][lang],
      pricesTitle: Phrases['pricesTitle'][lang],
      propsTitle: Phrases['propsTitle'][lang],
    }
    wx.setNavigationBarTitle({
      title: phrases.navTitle,
    })

    Product.getProduct({id}).then(function (product) {
      this.setData({
        phrases,
        product,
        language: lang,
        ready: true,
      })
    }.bind(this))
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