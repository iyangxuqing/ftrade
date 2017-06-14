import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'
import { Language, Languages } from '../../../utils/language.js'

var touch = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // loading: {
    //   show: true,
    //   transparenet: ''
    // },
    languages: Languages
  },

  onLanguageTap: function (e) {
    let id = e.currentTarget.dataset.id
    this.onLanguageChanged(id)
    this.setData({
      leftOpen: ''
    })
  },

  onLanguageChanged: function (lang) {
    let phrases = Language(lang)
    wx.setNavigationBarTitle({
      title: phrases['productList'],
    })
    this.setData({
      language: lang,
      categoryEmpty: phrases['categoryEmpty'],
      productEmpty: phrases['productEmpty'],
    })
    Category.get({ lang }).then(function (res) {
      let cates = res
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
      Product.get({ cid, lang }).then(function (res) {
        let products = []
        for (let i in res) {
          products.push(res[i])
        }
        for (let i in res) {
          products.push(res[i])
        }
        for (let i in res) {
          products.push(res[i])
        }
        products.pop()
        this.setData({
          products: products
        })
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

    let lang = this.data.language
    Product.get({ cid: activeChildId, lang })
      .then(function (res) {
        let products = []
        for (let i in res) {
          products.push(res[i])
        }
        for (let i in res) {
          products.push(res[i])
        }
        for (let i in res) {
          products.push(res[i])
        }
        products.pop()
        this.setData({
          products: products
        })
      }.bind(this))
  },

  loading: function (options) {
    let loading = this.data.loading || {}
    let defaults = { show: true, transparent: 'transparent' }
    options = Object.assign({}, defaults, options)
    if (options.show) {
      this.setData({
        'loading.show': true,
        'loading.transparent': options.transparent
      })
      loading.timer = setTimeout(function () {
        this.setData({
          'loading.showIcon': true
        })
      }.bind(this), 500)
    } else {
      clearTimeout(loading.timer)
      setTimeout(function () {
        this.setData({
          'loading.fade': 'fade'
        })
        setTimeout(function () {
          this.setData({
            'loading.show': false
          })
        }.bind(this), 500)
      }.bind(this), 0)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')

    this.loading({
      transparent: false
    })

    setTimeout(function () {
      this.loading({show: false})
    }.bind(this), 5000)

    this.onLanguageChanged('en')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
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