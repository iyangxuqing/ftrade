import { Loading } from '../../../templates/loading/loading.js'

import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'

var Phrases = {
  'languages': {
    'zh': '中文',
    'en': 'English',
    'ara': ' عربي ',
    'kor': '한국어',
  },
  'productList': {
    'zh': '商品列表',
    'en': 'Product list',
    'ara': ' قائمة المنتجات ',
    'kor': '상품 목록',
  },
  'productDetails': {
    'zh': '商品详情',
    'en': 'Commodity details',
    'ara': ' تفاصيل المنتج ',
    'kor': '상품 설명',
  },
  'categoryEmpty': {
    'zh': '该类目下没有子类目',
    'en': 'There are no subcategories in this category',
    'ara': ' هذا  التصنيف  لا  تصنيف  فرعي ',
    'kor': '이 类目 다음 없는 사람 类目',
  },
  'productEmpty': {
    'zh': '该类目下没商品',
    'en': 'There is no goods under this category',
    'ara': ' هذا  التصنيف  لا  السلع ',
    'kor': '이 类目 다음 없는 상품',
  },
}

var touch = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    languages: Phrases['languages']
  },

  onMaskTouchStart: function (e) {
    touch.id = e.currentTarget.dataset.id
    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.t1 = e.timeStamp;
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
    this.onMaskTouch(touch.id)
  },

  onMaskTouchMove: function (e) {
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  onMaskTouchEnd: function (e) {
    touch.t2 = e.timeStamp
    let dx = touch.x2 - touch.x1
    let dy = touch.y2 - touch.y1
    let dt = touch.t2 - touch.t1
    if ((Math.abs(dy) < Math.abs(dx) / 2 && dt < 250)) {
      if (dx < -20) this.onMaskSwipeLeft(touch.id)
      if (dx > 20) this.onMaskSwipeRight(touch.id)
    }
  },

  onPopupTouchStart: function (e) {
    touch.id = e.currentTarget.dataset.id
    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.t1 = e.timeStamp;
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  onPopupTouchMove: function (e) {
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
  },

  onPopupTouchEnd: function (e) {
    touch.t2 = e.timeStamp
    let dx = touch.x2 - touch.x1
    let dy = touch.y2 - touch.y1
    let dt = touch.t2 - touch.t1
    if ((Math.abs(dy) < Math.abs(dx) / 2 && dt < 250)) {
      if (dx < -20) this.onPopupSwipeLeft(touch.id)
      if (dx > 20) this.onPopupSwipeRight(touch.id)
    }
  },

  onMaskTouch: function (id) {
    this.setData({ leftOpen: '' })
  },

  onMaskSwipeLeft: function (id) {
  },

  onMaskSwipeRight: function (id) {
  },

  onPopupSwipeLeft: function (id) {
    this.setData({ leftOpen: '' })
  },

  onPopupSwipeRight: function (id) {
  },

  onMenuTriggerTap: function (e) {
    let leftOpen = this.data.openLeft
    leftOpen = leftOpen ? '' : 'left-open'
    this.setData({ leftOpen })
  },

  onMaskTap: function (e) {
    this.setData({ leftOpen: '' })
  },

  onLanguageTap: function (e) {
    let id = e.currentTarget.dataset.id
    this.loading.show()
    this.onLanguageChanged(id, function () {
      this.loading.hide()
    }.bind(this))
    this.setData({
      leftOpen: ''
    })
  },

  onLanguageChanged: function (language, cb) {
    wx.setNavigationBarTitle({
      title: Phrases['productList'][language],
    })
    this.setData({
      language: language,
      categoryEmpty: Phrases['categoryEmpty'][language],
      productEmpty: Phrases['productEmpty'][language],
    })
    wx.setStorageSync('language', language)

    Category.getCategorys(language).then(function (cates) {
      let activeId = cates[0].id
      for (let i in cates) {
        // 有的类目可能在其下面还没建子类目
        if (cates[i].children.length) {
          cates[i].activeId = cates[i].children[0].id
        }
      }
      this.setData({
        activeId: activeId,
        cates: cates
      })
      let cid = cates[0].children[0].id
      Product.getProducts(cid, language).then(function (products) {
        this.setData({
          products: products
        })
        cb && cb()
      }.bind(this))
    }.bind(this))
  },

  onCateTap: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = this.data.cates
    let activeId = this.data.activeId

    let activeChildId = ''
    if (pid == 0) {
      for (let i in cates) {
        if (cates[i].id == id) {
          activeId = id
          activeChildId = cates[i].activeId
          break;
        }
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            if (cates[i].children[j].id == id) {
              cates[i].activeId = id
              activeChildId = id
              break;
            }
          }
        }
      }
    }

    this.setData({
      activeId,
      cates,
    })

    this.loading.show()
    let language = this.data.language
    Product.getProducts(activeChildId, language)
      .then(function (products) {
        this.setData({
          products: products
        })
        this.loading.hide()
      }.bind(this))
  },

  onProductTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '../product/product?id=' + id + '&cid=' + cid,
    })
  },

  onAdminTap: function (e) {
    let user = getApp().user
    if (user.mobileVerified == true) {
      wx.redirectTo({
        url: '/pages/shoper/shoper',
      })
    } else {
      wx.navigateTo({
        url: '/pages/mobile/mobile',
      })
    }
  },

  onLogin: function () {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getApp().listener.on('login', this.onLogin)
    this.loading = new Loading()
    this.loading.show()

    let language = wx.getStorageSync('language') || 'en'
    this.onLanguageChanged(language, function () {
      this.setData({ ready: true })
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

/* 数据传输 */
/*
  程序启动时，会有一个语言选择页面，当作程序封面页。
  选择了语言后，会把语言选项保存在localStorage中，当作全局变量。
  保存在localStorage中，也为了用户后续进入程序时，可以避开语言选择页面。
  在开发初期由于语言选择页面还未接入，为方便开发在app.js中提供默认语言'en'。

  程序启动时，会一次性读入类目数据，包括所有语言的数据。
  除了下拉刷新外，此后不会再去读取类目数据了。
  类目数据是程序架构关键，数据量也不大，如果读入不成功，程序就不再运行。

*/