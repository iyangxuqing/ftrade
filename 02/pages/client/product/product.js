import { Category } from '../../../utils/categorys.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [
      '/images/p01.jpg',
      '/images/p02.jpg',
      '/images/p03.jpg',
      '/images/p04.jpg',
      '/images/p05.jpg',
    ],
    open: 'open'
  },

  onMenuTap: function (e) {
    if (this.data.open) {
      this.setData({
        open: ''
      })
    } else {
      this.setData({
        open: 'open'
      })
    }
  },

  onMaskTap: function (e) {
    this.setData({
      open: ''
    })
  },

  onItemTap: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    console.log(id, pid)
    let cates = this.data.cates
    if (pid == 0) {
      for (let i in cates) {
        if (cates[i].id == id) {
          let collapse = !cates[i].collapse
          cates[i].collapse = collapse
          if (collapse) {
            cates[i].childrenHeight = 0
          } else {
            cates[i].childrenHeight = 102 * cates[i].children.length
          }
          break
        }
      }
      this.setData({
        cates: cates
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Category.get().then(function (res) {
      console.log(res)
      let cates = res
      for (let i in cates) {
        cates[i].childrenHeight = 102 * cates[i].children.length
      }
      this.setData({
        cates: res
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