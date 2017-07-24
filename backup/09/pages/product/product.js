import { http } from '../../utils/http.js'
import { Product } from '../../utils/products.js'

var touch = {}
var imageLongTap = false
var delImageShowTimer = null

Page({

  data: {
    cata: {
      id: '',
      pid: '',
      title: '',
      ptitle: '',
      thumb: '',
      pthumb: ''
    },
    product: {
      id: '',
      cid: '',
      title: '',
      images: [],
      prices: [],
      props: [],
    },
  },

  touchstart: function (e) {
    touch.index = e.currentTarget.dataset.index
    touch.type = e.currentTarget.dataset.type
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
      if (dx < -20) this.onSwiperLeft(touch.index, touch.type)
      if (dx > 20) this.onSwiperRight(touch.index, touch.type)
    }
  },

  onSwiperLeft: function (index, type) {
    this.setData({
      swipeLeftId: type + '-' + index
    })
  },

  onSwiperRight: function (index, type) {
    this.setData({
      swipeLeftId: -1
    })
  },

  onTitleBlur: function (e) {
    let title = e.detail.value
    this.setData({
      'product.title': title
    })
  },

  onImageAdd: function (e) {
    this.setData({
      delImageIndex: -1
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        let images = this.data.product.images
        images.push(tempFilePaths[0])
        this.setData({
          'product.images': images
        })
        http.upload({
          paths: tempFilePaths
        }).then(function (res) {
          for (let i in images) {
            if (images[i] == res.uploadedFiles[0].source) {
              images[i] = res.uploadedFiles[0].target
              this.data.product.images[i] = images[i]
              break
            }
          }
        }.bind(this))
      }.bind(this),
    })
  },

  onImageTap: function (e) {
    if (imageLongTap) {
      imageLongTap = false
      return
    }
    this.setData({
      delImageIndex: -1
    })
    let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        let images = this.data.product.images
        images[index] = tempFilePaths[0]
        this.setData({
          'product.images': images
        })
        http.upload({
          paths: tempFilePaths
        }).then(function (res) {
          for (let i in images) {
            if (images[i] == res.uploadedFiles[0].source) {
              images[i] = res.uploadedFiles[0].target
              this.data.product.images[i] = images[i]
              break
            }
          }
        }.bind(this))
      }.bind(this)
    })
  },

  onImageLongTap: function (e) {
    imageLongTap = true
    let index = e.currentTarget.dataset.index
    this.setData({
      delImageIndex: index
    })
    clearTimeout(delImageShowTimer)
    delImageShowTimer = setTimeout(function () {
      this.setData({
        delImageIndex: -1
      })
    }.bind(this), 6000)
  },

  onImageDel: function (e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.product.images
    images.splice(index, 1)
    this.setData({
      delImageIndex: -1,
      'product.images': images,
    })
  },

  onItemAdd: function (e) {
    let value = e.detail.value
    if (value == '') return
    let type = e.currentTarget.dataset.type
    let product = this.data.product
    product[type].push({
      label: value,
      value: ''
    })
    this.setData({
      newValue: '',
      product: product
    })
  },

  onItemEdit: function (e) {
    let offsetLeft = e.currentTarget.offsetLeft
    let offsetTop = e.currentTarget.offsetTop
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let value = e.currentTarget.dataset.value
    let platform = wx.getSystemInfoSync().platform
    let editor = {
      show: true,
      left: offsetLeft,
      top: offsetTop,
      index: index,
      type: type,
      value: value,
      platform: platform
    }
    let product = this.data.product
    let types = type.split('-')
    this.setData({
      editId: types[0] + '-' + types[1] + '-' + index
    })
    setTimeout(function () {
      this.setData({
        editor: editor
      })
    }.bind(this), 5)
  },

  onEditorBlur: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    let product = this.data.product
    let types = type.split('-')
    product[types[0]][index][types[1]] = value
    this.setData({
      product: product,
      editId: -1,
      'editor.show': false
    })
  },

  onItemSortUp: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let product = this.data.product
    if (index == 0) return
    let temp = product[type][index]
    product[type][index] = product[type][index - 1]
    product[type][index - 1] = temp
    this.setData({
      product: product,
      swipeLeftId: -1
    })
  },

  onItemSortDown: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let product = this.data.product
    if (index == product[type].length - 1) return
    let temp = product[type][index]
    product[type][index] = product[type][index + 1]
    product[type][index + 1] = temp
    this.setData({
      product: product,
      swipeLeftId: -1
    })
  },

  onItemDelete: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let product = this.data.product
    product[type].splice(index, 1)
    this.setData({
      product: product,
      swipeLeftId: -1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let cid = options.cid

    let cates = wx.getStorageSync('cates')
    let cate = {}
    for (let i in cates) {
      for (let j in cates[i].children) {
        if (cates[i].children[j].id == cid) {
          cate.id = cid
          cate.pid = cates[i].id
          cate.ptitle = cates[i].title
          cate.pthumb = cates[i].thumb
          cate.title = cates[i].children[j].title
          cate.thumb = cates[i].children[j].thumb
          break;
        }
      }
      if (cate.title) break
    }

    let product = {}
    if (id) {
      let products = wx.getStorageSync('products')
      for (let i in products) {
        if (products[i].id == id) {
          product = products[i]
          break
        }
      }
    } else {
      product.cid = cid
      product.images = []
      product.prices = []
      product.props = []
    }
    this.setData({
      cate: cate,
      product: product
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
  onHide: function (e) {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
    let product = this.data.product
    for (let i in product.prices) {
      if (product.prices[i].label == '') {
        product.prices.splice(i, 1)
      }
    }
    for (let i in product.props) {
      if (product.props[i].label == '') {
        product.prices.props(i, 1)
      }
    }
    if (!product.title && product.images.length == 0) return
    let products = wx.getStorageSync('products') || []
    if (!product.id) {
      Product.add(products, product)
    } else {
      Product.set(products, product)
    }
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