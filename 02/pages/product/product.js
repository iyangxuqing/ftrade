import { http } from '../../utils/http.js'

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
      prices: [],
      props: [],
      newPrice: {},
      newProp: {},
    }
  },

  onImageAdd: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        let images = this.data.product.images
        images.push({
          client: tempFilePaths[0],
          remote: '',
        })
        this.setData({
          'product.images': images
        })
        http.upload({
          paths: tempFilePaths
        }).then(function (res) {
          for (let i in images) {
            if (images[i].client == res.uploadedFiles[0].source) {
              images[i].remote = res.uploadedFiles[0].target
              this.data.product.images = images
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

  onItemBlur: function (e) {
    let value = e.detail.value
    let type = e.currentTarget.dataset.type
    let newPrice = this.data.product.newPrice
    let newProp = this.data.product.newProp
    if (type == 'price-label') newPrice.label = value
    if (type == 'price-value') newPrice.value = value
    if (type == 'prop-label') newProp.label = value
    if (type == 'prop-label') newProp.value = value
    if (newPrice.label && newPrice.value) {
      let prices = this.data.product.prices
      prices.push({
        id: Date.now(),
        label: newPrice.label,
        value: newPrice.value
      })
      this.setData({
        'product.prices': prices,
        'product.newPrice': { label: '', value: '' }
      })
    } else if (newProp.label && newProp.value) {
      let props = this.data.product.props
      props.push({
        id: Date.now(),
        label: newProp.label,
        value: newProp.value
      })
      this.setData({
        'product.props': props,
        'product.newprop': { label: '', value: '' }
      })
    }
  },

  onItemLongTap: function (e) {
    let id = e.currentTarget.dataset.id
    let prices = this.data.product.prices
    let props = this.data.product.props
    let type = ''
    let index = -1
    for (let i in prices) {
      if (prices[i].id == id) {
        type = 'price'
        index = i
        break
      }
    }
    if (type == '') {
      for (let i in props) {
        if (props[i].id == id) {
          type = 'prop'
          index = i
          break
        }
      }
    }
    if (type == 'price') {
      wx.showActionSheet({
        itemList: ['删除标签'],
        success: function (res) {
          if (res.tapIndex == 0) {
            prices.splice(index, 1)
            this.setData({
              'product.prices': prices
            })
          }
        }.bind(this)
      })
    } else if (type == 'prop') {
      wx.showActionSheet({
        itemList: ['删除属性'],
        success: function (res) {
          if (res.tapIndex == 0) {
            props.splice(index, 1)
            this.setData({
              'product.props': props
            })
          }
        }.bind(this)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cid = options.cid || 89
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