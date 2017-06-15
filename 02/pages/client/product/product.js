import { Loading } from '../../../templates/loading/loading.js'
import { PageLoading } from '../../../templates/loading/loading.js'
import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'
import { Language, Languages } from '../../../utils/language.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || '1497257881135'
    let cid = options.cid || '89'
    Category.get().then(function(cates){
      Product.get({cid}).then(function(products){
        console.log(id, cid)
        let language = wx.getStorageSync('language')
        let product = Product.get({ id, cid, language })
        wx.setNavigationBarTitle({
          title: product.title,
        })
        this.setData({
          product: product
        })

      }.bind(this))
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