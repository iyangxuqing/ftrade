import { http } from '../../utils/http.js'
import { Category } from '../../utils/categorys.js'
import { Product } from '../../utils/products.js'

let touch = {}
let imageLongTap = false
let delImageShowTimer = null
let hasChanged = false
let app = getApp()

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
    youImageMode: app.youImageMode,
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

  onImageTap: function (e) {
    if (imageLongTap) {
      imageLongTap = false
      return
    }

    this.setData({
      delImageIndex: -1
    })

    let index = e.currentTarget.dataset.index
    let ctx = wx.createCanvasContext('canvas')
    let canvasWidth = 300
    let canvasHeight = 300

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0]
        let product = this.data.product
        let images = product.images
        if (index == -1) {
          index = product.images.length
        }

        let platform = wx.getSystemInfoSync().platform
        if (platform === 'devtools') {
          http.cosUpload({
            source: tempFilePath,
            target: Date.now() + '.jpg'
          }).then(function (res) {
            if (res.errno === 0) {
              images[index] = res.url
              this.setData({
                'product.images': images
              })
              hasChanged = true
            }
          }.bind(this))
        } else {
          wx.getImageInfo({
            src: tempFilePath,
            success: function (res) {
              let x = 0
              let y = 0
              let width = res.width //原图宽
              let height = res.height //原图高
              let rate = width / canvasWidth //以宽为基准的缩放比例
              let width2 = canvasWidth //校正后的宽
              let height2 = height / rate //校正后的高
              if (height2 >= canvasHeight) {
                x = 0
                y = (canvasHeight - height2) / 2
              } else {
                rate = height / canvasHeight //以高为基准的缩放比例
                width2 = width / rate //校正后的宽
                height2 = canvasHeight //校正后的高
                x = (canvasWidth - width2) / 2
                y = 0
              }
              ctx.drawImage(tempFilePath, x, y, width2, height2)
              ctx.draw()
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function (res) {
                  http.cosUpload({
                    source: res.tempFilePath,
                    target: Date.now() + '.jpg'
                  }).then(function (res) {
                    if (res.errno === 0) {
                      images[index] = res.url
                      this.setData({
                        'product.images': images
                      })
                      hasChanged = true
                    }
                  }.bind(this))
                }.bind(this)
              })
            }.bind(this)
          })
        }
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
    /**
     * 商品删除图片时，只在数据库中删除该图片链接，
     * 并不会立即将图片库中的图片删除，
     * 因为不光是删除图片，更换图片、删除商品等操作，
     * 都会产生大量的孤立图片，
     * 将这些孤立图片统一由后台删除，可以减低前端代码复杂度，
     * 另外，产品编辑的保存是滞后的，
     * 删除图片后，并未立即从图床上删除图片，
     * 在由于其他原因致使产品编辑未被保存时，产品图片依然有效。
     */
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

    let product = {}
    if (id) {
      product = Product.getProduct({cid, id})
    } else {
      product = {
        id: Date.now(),
        cid: cid,
        title: '',
        images: [],
        prices: [],
        props: []
      }
    }
    let platform = wx.getSystemInfoSync().platform
    this.setData({
      ready: true,
      product: product,
      platform: platform
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
    let product = this.data.product
    if (hasChanged) Product.set(product)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
    let product = this.data.product
    if (hasChanged) Product.set(product)
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