import { Category } from '../../utils/categorys.js'
import { __cates } from '../../utils/categorys.js'

var touch = {}

Page({

  data: {
    cates: [],
    newValue: '',
    expandId: '',
    swipeLeftId: '',
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
    this.setData({
      swipeLeftId: id
    })
  },

  onSwiperRight: function (id) {
    this.setData({
      swipeLeftId: ''
    })
  },

  onCateExpand: function (e) {
    let id = e.currentTarget.dataset.id
    if (this.data.expandId == id) id = ''
    this.setData({
      expandId: id
    })
  },

  onCateAdd: function (e) {
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    if (title == '') return
    let cates = Category.add({ pid, title },
      function (res) {
        this.setData({
          cates: res,
        })
      }.bind(this)
    )
    this.setData({
      cates: cates,
      newValue: ''
    })
  },

  onTitleEdit: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    let cates = Category.set({ id, pid, title })
    if (cates) this.setData({ cates: cates })
  },

  onThumbEdit: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let thumb = res.tempFilePaths[0]
        let cates = Category.set(
          { id, pid, thumb },
          // function (res) {
          //   this.setData({
          //     cates: res
          //   })
          // }.bind(this)
        )
        this.setData({
          cates: cates
        })
      }.bind(this)
    })
  },

  onCateSortUp: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = Category.sort({ id, pid }, true)
    this.setData({
      cates: cates,
      swipeLeftId: ''
    })
  },

  onCateSortDown: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = Category.sort({ id, pid }, false)
    this.setData({
      cates: cates,
      swipeLeftId: ''
    })
  },

  onCateDelete: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = Category.del({ id, pid })
    this.setData({
      cates: cates
    })
  },

  onNavProducts: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '../products/products?id=' + id + '&pid=' + pid
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    Category.get().then(function (cates) {
      this.setData({
        cates: cates,
        dataReady: true
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