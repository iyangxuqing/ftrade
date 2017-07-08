let config = require('../../../utils/config.js')
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
      let langs = []
      let cates = getApp().cates
      for (let lang in cates) {
        langs.push(lang)
      }
      for (let i in langs) {
        let lang = langs[i]
        let product = Product.getProduct(id, cid, lang)
        if (!favorites[lang]) favorites[lang] = []
        favorites[lang].push(product)
        if (favorites[lang].length > 60) {
          favorites[lang].shift()
        }
      }
      wx.setStorageSync('favorites', favorites)
    } else {
      for (let lang in favorites) {
        for (let i in favorites[lang]) {
          if (favorites[lang][i].id == id) {
            favorites[lang].splice(i, 1)
            break
          }
        }
      }
      wx.setStorageSync('favorites', favorites)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let cid = options.cid
    let language = wx.getStorageSync('language')
    let favorites = wx.getStorageSync('favorites') || {}
    favorites = favorites[language]

    let phrases = {
      navTitle: Phrases['navTitle'][language],
      pricesTitle: Phrases['pricesTitle'][language],
      propsTitle: Phrases['propsTitle'][language],
    }
    wx.setNavigationBarTitle({
      title: phrases.navTitle,
    })

    Product.getProducts(cid, language).then(function (products) {
      let index = -1
      for (let i in products) {
        if (products[i].id == id) index = i
        for (let j in favorites) {
          if (products[i].id == favorites[j].id) {
            products[i].favorite = true
            break
          }
        }
      }
      this.setData({
        phrases,
        language,
        products,
        ready: true,
        current: index,
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