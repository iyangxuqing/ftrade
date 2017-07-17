import { Shop } from '../../../utils/shop.js'
import { Product } from '../../../utils/products.js'
import { Category } from '../../../utils/categorys.js'
import { http } from '../../../utils/http.js'

let touch = {}
let app = getApp()

let Phrases = {
  'languages': {
    'zh': '中文',
    'en': 'English',
    'ara': ' عربي ',
    'kor': '한국어',
  },
  'productList': {
    'zh': '商品列表',
    'en': 'Product List',
    'ara': ' قائمة المنتجات ',
    'kor': '상품 목록',
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

Page({

  data: {
    leftOpen: '',
    languages: Phrases['languages'],
    youImageMode: app.youImageMode,
  },

  onPopupTouchStart: function (e) {
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
      if (dx < -20) this.onPopupSwipeLeft()
    }
  },

  onMaskTouchStart: function (e) {
    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.t1 = e.timeStamp;
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
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
    this.onMaskTap()
  },

  onPopupSwipeLeft: function (id) {
    this.setData({ leftOpen: '' })
  },

  onMenuTriggerTap: function (e) {
    let leftOpen = this.data.leftOpen
    leftOpen = leftOpen ? '' : 'left-open'
    this.setData({ leftOpen })
  },

  onMaskTap: function (e) {
    this.setData({ leftOpen: '' })
  },

  onLanguageTap: function (e) {
    let lang = e.currentTarget.dataset.id
    app.lang = lang
    wx.setStorageSync('language', lang)
    this.loadCategorys()
    wx.setNavigationBarTitle({
      title: Phrases['productList'][lang],
    })
    this.setData({
      leftOpen: '',
      language: lang,
      categoryEmpty: Phrases['categoryEmpty'][lang],
      productEmpty: Phrases['productEmpty'][lang],
    })
  },

  onCateTap: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid

    let cates = this.data.cates
    let activeCateId = this.data.activeCateId
    let activeChildCateId = ''
    if (pid == 0) {
      for (let i in cates) {
        if (cates[i].id == id) {
          activeCateId = id
          activeChildCateId = cates[i].activeChildId
          break
        }
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            if (cates[i].children[j].id == id) {
              cates[i].activeChildId = id
              activeChildCateId = id
              break
            }
          }
        }
      }
    }
    this.setData({
      cates,
      activeCateId,
    })

    let cid = activeChildCateId
    this.loadProducts(cid)
  },

  onProductTap: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  onReloadCategorys: function (e) {
    this.loadCategorys()
  },

  onReloadProducts: function (e) {
    let cates = this.data.cates
    let activeCateId = this.data.activeCateId
    let activeChildCateId = ''
    for (let i in cates) {
      if (cates[i].id == activeCateId) {
        activeChildCateId = cates[i].activeChildId
        break
      }
    }
    this.loadProducts(activeChildCateId)
  },

  loadCategorys: function () {
    Category.getCategorys()
      .then(function (cates) {
        let activeCateId = ''
        let activeChildCateId = ''
        // 某种语言下可能还没有类目
        if (cates.length > 0) activeCateId = cates[0].id
        for (let i in cates) {
          // 某种类目下可能还没有子类目
          if (cates[i].children.length > 0) {
            cates[i].activeChildId = cates[i].children[0].id
            if (!activeChildCateId) {
              activeChildCateId = cates[i].children[0].id
            }
          }
        }
        this.setData({
          categorysFail: false,
          activeCateId: activeCateId,
          cates: cates,
          ready: true,
        })
        let cid = activeChildCateId
        this.loadProducts(cid)
      }.bind(this))
      .catch(function (res) {
        this.setData({
          categorysFail: true
        })
      }.bind(this))
  },

  loadProducts: function (cid) {
    this.setData({
      productsFail: false,
      productsNone: false,
    })
    Product.getProducts({ cid })
      .then(function (products) {
        this.setData({
          products,
          productsFail: false,
          productsNone: products.length == 0,
        })
      }.bind(this))
      .catch(function (res) {
        console.log(res)
        this.setData({
          products: [],
          productsFail: true,
          productsNone: false,
        })
      }.bind(this))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.listener.on('network-none', this.onNetworkNone)

    let lang = app.lang
    wx.setNavigationBarTitle({
      title: Phrases['productList'][lang],
    })
    this.setData({
      language: lang,
      categoryEmpty: Phrases['categoryEmpty'][lang],
      productEmpty: Phrases['productEmpty'][lang],
    })

    this.loadCategorys()
    Shop.get({ slient: true }).then(function (shop) {
      this.setData({ shop })
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