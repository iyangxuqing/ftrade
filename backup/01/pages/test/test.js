import { http } from '../../utils/http.js'
import { Category } from '../../utils/category.js'

var touch = {}
var cates = []

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expandId: '',
    swipeLeftId: '-1',
  },

  touchstart: function (e) {
    touch.id = e.currentTarget.dataset.id
    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.t1 = e.timeStamp;
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  touchmove: function (e) {
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  touchend: function (e) {
    touch.t2 = e.timeStamp
    let dx = touch.x2 - touch.x1
    let dy = touch.y2 - touch.y1
    let dt = touch.t2 - touch.t1
    if ((Math.abs(dy) < Math.abs(dx) && dt < 250)) {
      if (dx < -20) this.onSwiperLeft(touch.id)
      if (dx > 20) this.onSwiperRight(touch.id)
    }
  },

  onSwiperLeft: function (id) {
    let cates = this.data.cates
    for (let i in cates) {
      cates[i].swipeLeft = false
      cates[i].swipeRight = false
      if (cates[i].id == id) {
        cates[i].swipeLeft = true
      }
      for (let j in cates[i].children) {
        cates[i].children[j].swipeLeft = false
        cates[i].children[j].swipeRight = false
        if (cates[i].children[j].id == id) {
          cates[i].children[j].swipeLeft = true
        }
      }
    }
    this.setData({
      cates: cates
    })
  },

  onSwiperRight: function (id) {
    let cates = this.data.cates
    for (let i in cates) {
      cates[i].swipeLeft = false
      cates[i].swipeRight = false
      if (cates[i].id == id) {
        cates[i].swipeRight = true
      }
      for (let j in cates[i].children) {
        cates[i].children[j].swipeLeft = false
        cates[i].children[j].swipeRight = false
        if (cates[i].children[j].id == id) {
          cates[i].children[j].swipeRight = true
        }
      }
    }
    this.setData({
      cates: cates
    })
  },

  onExpandTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cates = this.data.cates
    for (let i in cates) {
      if (cates[i].id == id) {
        cates[i].expand = !cates[i].expand
      } else {
        cates[i].expand = false
      }
    }
    this.setData({
      cates: cates
    })
  },

  onCategoryTap: function (e) {
    console.log(e)
  },

  longTap: function (e) {
    console.log(e)
  },

  onThumbTap: function (e) {
    wx.chooseImage({
      success: function (res) {
        console.log(res)
      },
    })
  },

  onCateTitleBlur: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    let cates = this.data.cates
    Category.set(cates, { id, pid, title })
    this.setData({
      cates: cates
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Category.get().then(function (cates) {
      this.setData({
        cates: cates
      })
    }.bind(this))
  },

  onCateSortUp: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    console.log(cates)
    Category.sort(cates, { id, pid }, true)
    console.log(cates)
    this.setData({
      cates: cates
    })
  },

  onCateSortDown: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    Category.sort(cates, { id, pid }, false)
    this.setData({
      cates: cates
    })
  },

  onCateDelete: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    Category.del(cates, { id, pid })
    this.setData({
      cates: cates
    })
  },

  onCateAdd: function (e) {
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    Category.add(cates, pid)
    this.setData({
      cates: cates
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})