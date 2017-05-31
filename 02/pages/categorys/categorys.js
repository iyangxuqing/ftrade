import { http } from '../../utils/http.js'
import { Category } from '../../utils/categorys.js'

var touch = {}

Page({

  data: {
    newValue: '', //用于清空新增类目输入框
    cates: []
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

  onCateExpand: function (e) {
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

  onCateAdd: function (e) {
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    let cates = this.data.cates
    if (title == '') return
    Category.add(cates, { pid, title })
      .then(function (cates) {
        this.setData({
          cates: cates,
          newValue: '' //清空新增类目输入框
        })
      }.bind(this))
  },

  onTitleEdit: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    let cates = this.data.cates
    if (title) Category.set(cates, { id, pid, title })
    this.setData({
      cates: cates
    })
  },

  onThumbEdit: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let thumb = res.tempFilePaths[0]
        Category.set(cates,
          { id, pid, thumb },
          function () {
            this.setData({
              cates: cates
            })
          }.bind(this),
          function () {
            // this.setData({
            //   cates: cates
            // })
          }.bind(this))
      }.bind(this)
    })
  },

  onCateSortUp: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    for (let i in cates) {
      cates[i].swipeLeft = false
      cates[i].swipeRight = false
      for (let j in cates[i].children) {
        cates[i].children[j].swipeLeft = false
        cates[i].children[j].swipeRight = false
      }
    }
    Category.sort(cates, { id, pid }, true)
    this.setData({
      cates: cates
    })
  },

  onCateSortDown: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    for (let i in cates) {
      cates[i].swipeLeft = false
      cates[i].swipeRight = false
      for (let j in cates[i].children) {
        cates[i].children[j].swipeLeft = false
        cates[i].children[j].swipeRight = false
      }
    }
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