import { Loading } from '../../../templates/loading/loading.js'
import { PageLoading } from '../../../templates/loading/loading.js'
import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'
import { Language, Languages } from '../../../utils/language.js'

var touch = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    languages: Languages
  },

  touchstart: function (e) {
    touch.id = e.currentTarget.dataset.id
    touch.x1 = e.touches[0].clientX;
    touch.y1 = e.touches[0].clientY;
    touch.t1 = e.timeStamp;
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;
    // this.setData({
    //   leftOpen: ''
    // })
  },

  touchmove: function (e) {
    touch.x2 = e.touches[0].clientX;
    touch.y2 = e.touches[0].clientY;
    touch.t2 = e.timeStamp;

    let dx = touch.x2 - touch.x1
    let dy = touch.y2 - touch.y1
    if (dx < -5 && Math.abs(dy) < 5) {
      // this.setData({
      //   leftOpen: ''
      // })
    }
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
      leftOpen: ''
    })
  },

  onSwipeRight: function (id) {
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
    let phrases = Language(language)
    wx.setNavigationBarTitle({
      title: phrases['productList'],
    })
    this.setData({
      language: language,
      categoryEmpty: phrases['categoryEmpty'],
      productEmpty: phrases['productEmpty'],
    })
    wx.setStorageSync('language', language)

    Category.get({ language }).then(function (cates) {
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
      Product.get({ cid, language }).then(function (products) {
        let _products = []
        for (let i in products) {
          _products.push(products[i])
        }
        for (let i in products) {
          _products.push(products[i])
        }
        for (let i in products) {
          _products.push(products[i])
        }
        _products.pop()
        this.setData({
          products: _products
        })
        cb && cb()
      }.bind(this))
    }.bind(this))
  },

  onMenuTriggerTap: function (e) {
    let leftOpen = this.data.openLeft
    leftOpen = leftOpen ? '' : 'left-open'
    this.setData({ leftOpen })
  },

  onMaskTap: function (e) {
    this.setData({
      leftOpen: ''
    })
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
    Product.get({ cid: activeChildId, language })
      .then(function (products) {
        let _products = []
        for (let i in products) {
          _products.push(products[i])
        }
        for (let i in products) {
          _products.push(products[i])
        }
        for (let i in products) {
          _products.push(products[i])
        }
        _products.pop()
        this.setData({
          products: _products
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
    wx.navigateTo({
      url: '/pages/categorys/categorys',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loading = new Loading()
    this.pageLoading = new PageLoading()

    this.pageLoading.show()
    let language = wx.getStorageSync('language') || 'en'
    this.onLanguageChanged(language, function () {
      this.pageLoading.hide()
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
  全局语言选项也会保存在app.language中，以方便取用。

  程序启动时，会一次性读入类目数据，包括所有语言的数据。
  除了下拉刷新外，此后不会再去读取类目数据了。
  类目数据是程序架构关键，数据量也不大，如果读入不成功，程序就不再运行。

*/