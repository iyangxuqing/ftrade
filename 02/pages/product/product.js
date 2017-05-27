import { http } from '../../utils/http.js'

var touch = {}
var longtap = false

Page({

  /**
   * 页面的初始数据
   */
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
      images_remote: [],
      prices: [],
      props: [],
      newPrice: {},
      newProp: {},
    }
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
    let product = this.data.product
    for (let i in product.prices) {
      product.prices[i].swipeLeft = false
      product.prices[i].swipeRight = false
    }
    for (let i in product.props) {
      product.props[i].swipeLeft = false
      product.props[i].swipeRight = false
    }
    if (type == 'price') {
      product.prices[index].swipeLeft = true
    } else if (type == 'prop') {
      product.props[index].swipeLeft = true
    }
    this.setData({
      product: product
    })
  },

  onSwiperRight: function (index, type) {
    let product = this.data.product
    if (type == 'price' && !product.prices[index].swipeLeft) return
    if (type == 'prop' && !product.props[index].swipeLeft) return

    for (let i in product.prices) {
      product.prices[i].swipeLeft = false
      product.prices[i].swipeRight = false
    }
    for (let i in product.props) {
      product.props[i].swipeLeft = false
      product.props[i].swipeRight = false
    }
    if (type == 'price') {
      product.prices[index].swipeRight = true
    } else if (type == 'prop') {
      product.props[index].swipeRight = true
    }
    this.setData({
      product: product
    })
  },

  onImageAdd: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        let images = this.data.product.images
        let images_remote = this.data.product.images_remote
        images.push(tempFilePaths[0])
        this.setData({
          'product.images': images
        })
        http.upload({
          paths: tempFilePaths
        }).then(function (res) {
          for (let i in images) {
            if (images[i] == res.uploadedFiles[0].source) {
              images_remote[i] = res.uploadedFiles[0].target
              this.data.product.images_remote = images_remote
              break
            }
          }
        }.bind(this))
      }.bind(this),
    })
  },

  onImageTap: function (e) {
    if (longtap) {
      longtap = false
      return
    }
  },

  onImageLongTap: function (e) {
    longtap = true
    let index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          let images = this.data.product.images
          images.splice(index, 1)
          this.setData({
            'product.images': images
          })
        }
      }.bind(this)
    })
  },

  onTitleBlur: function (e) {
    let title = e.detail.value
    console.log(title)
    this.setData({
      'product.title': title
    })
  },

  onPriceAdd: function (e) {
    let prices = this.data.product.prices
    for (let i in prices) {
      if (prices[i].label == '') return
    }
    prices.push({
      label: '',
      value: ''
    })
    this.setData({
      'product.prices': prices
    })
  },

  onPropAdd: function (e) {
    let props = this.data.product.props
    for (let i in props) {
      if (props[i].label == '') return
    }
    props.push({
      label: '',
      value: ''
    })
    this.setData({
      'product.props': props
    })
  },

  onItemBlur: function (e) {
    let value = e.detail.value
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let product = this.data.product
    if (index >= 0) {
      if (type == 'price-label') product.prices[index].label = value
      if (type == 'price-value') product.prices[index].value = value
      if (type == 'prop-label') product.props[index].label = value
      if (type == 'prop-value') product.props[index].value = value
    }
    this.setData({
      product: product
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 'p1495777209160'
    let cid = options.cid || '89'
    console.log(id, cid)
    this.data.product.cid = cid
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
    this.setData({
      cate: cate
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
    console.log(e, 'hide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
    let product = this.data.product
    if (!product.title && product.images.length == 0) return
    let products = wx.getStorageSync('products') || []
    product.id = 'p' + Date.now()
    products.push(product)
    wx.setStorageSync('products', products)
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