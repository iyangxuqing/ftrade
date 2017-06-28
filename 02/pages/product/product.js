import { http } from '../../utils/http.js'
import { Category } from '../../utils/categorys.js'
import { Product } from '../../utils/products.js'
import { Loading } from '../../templates/loading/loading.js'

var touch = {}
var imageLongTap = false
var delImageShowTimer = null
var hasChanged = false

Page({

  data: {
    product: {
      id: '',
      cid: '',
      title: '',
      images: [],
      prices: [],
      props: [],
    },
    editor: {
      top: 0,
      left: -1000,
      blur: false,
      focus: false,
      type: '',
      index: '',
      value: '',
    },
    editId: '',
    swipeLeftId: '',
    delImageIndex: -1,
    platform: 'devtools',
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
    if ((Math.abs(dy) < Math.abs(dx) / 2 && dt < 250)) {
      if (dx < -20) this.onSwipeLeft(touch.type, touch.index)
      if (dx > 20) this.onSwipeRight(touch.type, touch.index)
    }
  },

  onSwipeLeft: function (type, index) {
    this.setData({
      swipeLeftId: type + '-' + index
    })
  },

  onSwipeRight: function (type, index) {
    this.setData({
      swipeLeftId: ''
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
        let product = this.data.product
        let images = product.images
        images.push(tempFilePaths[0])
        let index = images.length - 1
        this.setData({
          'product.images': images
        })
        http.cosUpload({
          source: tempFilePaths[0],
          target: product.id + '_' + index + '.jpg'
        }).then(function (picUrl) {
          this.data.product.images[index] = picUrl
        }.bind(this))
        hasChanged = true
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
        let product = this.data.product
        let images = product.images
        images[index] = tempFilePaths[0]
        this.setData({
          'product.images': images
        })
        http.cosUpload({
          source: tempFilePaths[0],
          target: product.id + '_' + index + '.jpg'
        }).then(function (picUrl) {
          this.data.product.images[index] = picUrl
        }.bind(this))
        hasChanged = true
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
    }.bind(this), 5000)
  },

  onImageDel: function (e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.product.images
    images.splice(index, 1)
    this.setData({
      delImageIndex: -1,
      'product.images': images,
    })
    hasChanged = true
  },

  onTitleBlur: function (e) {
    let title = e.detail.value
    let oldTitle = this.data.product.title
    if (title == '' || title == oldTitle) {
      this.setData({
        'product.title': oldTitle
      })
    } else {
      this.setData({
        'product.title': title
      })
      hasChanged = true
    }
  },

  onItemAdd: function (e) {
    if (this.data.editor.left >= 0) {
      this.setData({
        'editId': '',
        'editor.left': -1000,
        'editor.focus': false,
      })
      return
    }
    let top = e.currentTarget.offsetTop
    let left = e.currentTarget.offsetLeft
    let type = e.currentTarget.dataset.type
    let placeholder = type == 'prices' ? '新增价格标签' : '新增商品属性'
    this.setData({
      'editor.blur': false,
      'editor.type': type,
      'editor.index': -1,
      'editor.value': '',
      'editor.placeholder': placeholder
    })
    setTimeout(function () {
      this.setData({
        'editor.top': top,
        'editor.left': left,
        'editor.focus': true,
      })
    }.bind(this), 0)
  },

  onItemEdit: function (e) {
    if (this.data.editor.left >= 0) {
      this.setData({
        'editId': '',
        'editor.left': -1000,
        'editor.focus': false,
      })
      return
    }
    let top = e.currentTarget.offsetTop
    let left = e.currentTarget.offsetLeft
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let value = e.currentTarget.dataset.value
    let product = this.data.product
    let types = type.split('-')
    let placeholder = '输入价格(元)'
    if (types[0] == 'props') placeholder = '输入属性值'
    let editId = types[0] + '-' + types[1] + '-' + index
    this.setData({
      editId: editId,
      'editor.blur': false,
      'editor.type': type,
      'editor.index': index,
      'editor.value': value,
      'editor.placeholder': placeholder
    })
    setTimeout(function () {
      this.setData({
        'editor.top': top,
        'editor.left': left,
        'editor.focus': true,
      })
    }.bind(this), 0)
  },

  onEditorBlur: function (e) {
    /* android系统中隐藏在界面外的textarea，在界面滚动时会不断产生blur事件 */
    if (this.data.editor.blur) return
    let editor = this.data.editor
    editor.blur = true

    this.setData({
      'editId': '',
      'editor.left': -1000,
      'editor.focus': false,
    })

    let type = editor.type
    let index = editor.index
    let value = e.detail.value
    let oldValue = editor.value
    if (!value || value == oldValue) return

    if (type == 'title') {
      this.setData({
        'product.title': value
      })
      hasChanged = true
      return
    }

    let product = this.data.product
    if (index < 0) {
      if (value) {
        product[type].push({
          label: value,
          value: ''
        })
      }
    } else {
      let types = type.split('-')
      product[types[0]][index][types[1]] = value
    }
    this.setData({ product })
    hasChanged = true
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
    hasChanged = true
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
    hasChanged = true
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
    hasChanged = true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let cid = options.cid
    this.loading = new Loading()
    this.loading.show()

    let product = {
      cid: cid,
      images: [],
      prices: [],
      props: []
    }
    if (id) {
      product = Product.getProduct(id, cid, 'zh')
    } else {
      product.id = Date.now()
    }
    let platform = wx.getSystemInfoSync().platform
    this.setData({
      ready: true,
      product: product,
      platform: platform
    })
    this.loading.hide()
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
    if (hasChanged && product.title) {
      Product.set(product)
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