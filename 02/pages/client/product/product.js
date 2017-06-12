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
    menuOpen: ''
  },

  onMenuTap: function (e) {
    if (this.data.menuOpen) {
      this.setData({
        menuOpen: ''
      })
    } else {
      this.setData({
        menuOpen: 'menuOpen'
      })
    }
  },

  onMaskTap: function (e) {
    this.setData({
      menuOpen: ''
    })
  },

  onItemTap: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    if (pid == 0) {
      for (let i in cates) {
        if (cates[i].id == id) {
          cates[i].expand = !cates[i].expand
          break
        }
      }
      this.setData({
        cates: cates
      })
      return
    }

    this.setData({
      menuOpen: ''
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Category.get().then(function (res) {
      let cates = res
      for (let i in cates) {
        cates[i].height = 80
        let count = cates[i].children.length
        if (count > 0) {
          cates[i].height += count * 102 - 2
        }
      }
      cates[0].expand = true
      this.setData({
        cates: cates
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