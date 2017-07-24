import { Loading } from '../../templates/loading/loading.js'
import { Category } from '../../utils/categorys.js'

var touch = {}

Page({

  data: {
    cates: [],
    expandId: '',
    swipeLeftId: '',
    platform: '',
    editor: {
      top: 0,
      left: -1000,
      focus: false,
      placeholder: '',
      data: {
        id: '',
        pid: '',
        value: ''
      }
    }
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
      if (dx < -20) this.onSwipeLeft(touch.id)
      if (dx > 20) this.onSwipeRight(touch.id)
    }
  },

  onSwipeLeft: function (id) {
    this.setData({
      swipeLeftId: id
    })
  },

  onSwipeRight: function (id) {
    this.setData({
      swipeLeftId: -1
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
    if (this.data.editor.left >= 0) {
      this.setData({
        'editor.left': -1000,
        'editor.focus': false,
      })
      return
    }
    let pid = e.currentTarget.dataset.pid
    let top = e.currentTarget.offsetTop
    let left = e.currentTarget.offsetLeft
    let placeholder = pid == 0 ? '输入类目名称' : '输入子类目名称'
    this.setData({
      editor: {
        top: top,
        left: left,
        focus: true,
        placeholder: placeholder,
        data: { pid }
      }
    })
  },

  onTitleEdit: function (e) {
    if (this.data.editor.left >= 0) {
      this.setData({
        'editor.left': -1000,
        'editor.focus': false,
      })
      return
    }
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let title = e.currentTarget.dataset.title
    let top = e.currentTarget.offsetTop
    let left = e.currentTarget.offsetLeft
    this.setData({
      editor: {
        top: top,
        left: left,
        focus: true,
        placeholder: '类目名称不可为空',
        data: { id, pid, value: title }
      }
    })
  },

  onEditorBlur: function (e) {
    let id = this.data.editor.data.id
    let pid = this.data.editor.data.pid
    let value = e.detail.value
    let oldValue = this.data.editor.data.value
    this.setData({
      'editor.left': -1000,
      'editor.focus': false,
    })
    if (value == '' || value == oldValue) return

    if (!id) {
      let cates = Category.add({ pid, title: value })
      this.setData({ cates })
    } else {
      let cates = Category.setTitle({ id, pid, title: value })
      this.setData({ cates })
    }
  },

  onThumbEdit: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let thumb = res.tempFilePaths[0]
        this.loading.show()
        Category.setThumb({ id, pid, thumb }).then(function (cates) {
          this.setData({ cates })
          this.loading.hide()
        }.bind(this))
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
    Category.del({ id, pid }).then(function (res) {
      if (res.error) {
        wx.showModal({
          title: '提示',
          content: res.error,
          showCancel: false,
          success: function () {
            this.setData({
              swipeLeftId: -1
            })
          }.bind(this)
        })
      } else {
        this.setData({
          cates: res
        })
      }
    }.bind(this))
  },

  onNavProducts: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    wx.navigateTo({
      url: '../products/products?cid=' + id
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {

    this.loading = new Loading()
    this.loading.show()

    let platform = wx.getSystemInfoSync().platform
    this.setData({ platform })

    Category.getCategorys('zh').then(function (cates) {
      this.setData({
        cates: cates,
        ready: true,
      })
      this.loading.hide()
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
    if (getApp().user.role == 'admin') {
      console.log(getApp().user)
      this.loading.show()
      Category.getCategorys('zh', false).then(function (res) {
        this.setData({
          cates: res
        })
        wx.removeStorageSync('localProducts')
        wx.stopPullDownRefresh()
        this.loading.hide()
      }.bind(this))
    } else {
      setTimeout(function () {
        wx.stopPullDownRefresh()
      }, 2000)
    }
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

})