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

  onPriceAdd: function (e) {
    let prices = this.data.product.prices
    for (let i in prices) {
      if (prices[i].label == '') return
      if (prices[i].value == '') return
    }
    prices.push({
      label: '',
      value: ''
    })
    this.setData({
      'product.prices': prices,
    })
  },

  onPropAdd: function (e) {
    let props = this.data.product.props
    for (let i in props) {
      if (props[i].label == '') return
      if (props[i].value == '') return
    }
    props.push({
      label: '',
      value: ''
    })
    this.setData({
      'product.props': props
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
    product[types[0]][index][types[1]] = value
    product[types[0]][index].editing = types[1]
    this.setData({
      product: product
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
    product[types[0]][index].editing = ''
    this.setData({
      product: product,
      'editor.show': false
    })
  },

  onItemSortUp: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    if (index == 0) return
    let product = this.data.product
    let items = []
    if (type == 'prices') items = product.prices
    if (type == 'props') items = product.props
    let temp = items[index]
    items[index] = items[index - 1]
    items[index - 1] = temp
    for (let i in items) {
      items[i].swipeLeft = false
      items[i].swipeRight = false
    }
    this.setData({
      product: product
    })
  },

  onItemSortDown: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let product = this.data.product
    let items = []
    if (type == 'prices') items = product.prices
    if (type == 'props') items = product.props
    if (index == items.length - 1) return
    let temp = items[index]
    items[index] = items[index + 1]
    items[index + 1] = temp
    for (let i in items) {
      items[i].swipeLeft = false
      items[i].swipeRight = false
    }
    this.setData({
      product: product
    })
  },

  onItemDelete: function (e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let product = this.data.product
    let items = []
    if (type == 'prices') items = product.prices
    if (type == 'props') items = product.props
    items.splice(index, 1)
    this.setData({
      product: product
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