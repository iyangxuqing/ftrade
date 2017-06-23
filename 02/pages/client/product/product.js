import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'

var Phrases = {
  navTitle: {
    'zh': '商品详情',
    'en': 'Commodity details',
    'ara': ' تفاصيل المنتج ',
    'kor': '상품 설명',
  },
  pricesTitle: {
    'zh': '批发价格',
    'en': 'Wholesale price',
    'ara': ' سعر الجملة ',
    'kor': '도매 가격',
  },
  propsTitle: {
    'zh': '商品属性',
    'en': 'Commodity attribute',
    'ara': ' السلع صفة ',
    'kor': '상품 특성',
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onFavoriteTap: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    for (let i in products) {
      if (products[i].id == id) {
        products[i].favorite = !products[i].favorite
        break
      }
    }
    this.setData({
      products: products
    })

    let favorites = []
    for (let i in products) {
      if (products[i].favorite == true) {
        favorites.push(products[i].id)
      }
    }
    wx.setStorageSync('favorites', favorites)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let cid = options.cid
    let language = wx.getStorageSync('language') || 'en'
    let favorites = wx.getStorageSync('favorites') || []
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
          if (products[i].id == favorites[j]) {
            products[i].favorite = true
            break
          }
        }
      }
      this.setData({
        phrases,
        products,
        language,
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