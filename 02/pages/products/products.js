import { Category } from '../../utils/category.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onProductAdd: function (e) {
    let cid = this.data.cate.id
    wx.navigateTo({
      url: '../product/product?cid=' + cid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.id || 89
    let cpid = options.pid || 85
    let cate = { id: cid, pid: cpid }
    Category.get().then(function (cates) {
      wx.setStorageSync('cates', cates)
      for (let i in cates) {
        if (cates[i].id == cpid) {
          cate.ptitle = cates[i].title
          cate.pthumb = cates[i].thumb
        }
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cid) {
            cate.title = cates[i].children[j].title
            cate.thumb = cates[i].children[j].thumb
            break
          }
        }
        if (cate.title) break;
      }
      this.setData({
        cate: cate
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