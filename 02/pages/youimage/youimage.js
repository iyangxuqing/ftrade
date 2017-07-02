let config = require('../../utils/config.js')
import { http } from '../../utils/http.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  cosList: function (options = {}) {
    let self = this
    let host = 'https://sh.file.myqcloud.com/files/v2/'
    let dir = '1253299728/ftrade/' + config.sid + '/'
    let url = host + dir
    if (!options.infos) options.infos = []
    http.get({
      url: '_ftrade/cos.php?m=signature',
    }).then(function (res) {
      wx.request({
        url,
        header: {
          Authorization: res.multi_signature
        },
        data: {
          op: 'list',
          num: 1000,
          context: options.context || ''
        },
        success: function (res) {
          if (res.data && res.data.message == 'SUCCESS') {
            let data = res.data.data
            options.infos = options.infos.concat(data.infos)
            if (data.listover == false) {
              self.cosList({
                context: data.context,
                infos: options.infos,
                success: options.success
              })
            } else {
              options.success && options.success(options.infos)
            }
          }
        }
      })
    })
  },

  cosDel: function (youImages, productImages, index, cb) {
    let self = this
    let find = false
    if (index >= youImages.length) {
      cb && cb('end')
      return
    }
    let name = youImages[index]
    for (let j in productImages) {
      let image = productImages[j]
      if (image.indexOf(name) >= 0) {
        find = true
        break
      }
    }
    if (find) {
      console.log('used image', index, name)
      self.cosDel(youImages, productImages, index + 1, cb)
    } else {
      try {
        http.cosDelete({
          filename: config.sid + '/' + name
        }).then(function (res) {
          console.log('delete unused image', index, name)
          self.cosDel(youImages, productImages, index + 1, cb)
        })
      } catch(e){
        console.log(e)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let youImages = []
    let productImages = []
    let self = this
    this.cosList({
      success: function (res) {
        for (let i in res) {
          youImages.push(res[i].name)
        }
        http.get({
          url: '_ftrade/product.php?m=getAll'
        }).then(function (res) {
          let products = res.products
          for (let i in products) {
            products[i].images = JSON.parse(products[i].images)
            for (let j in products[i].images) {
              productImages.push(products[i].images[j])
            }
          }
          console.log(youImages.length)
          console.log(productImages.length)
          self.cosDel(youImages, productImages, 0, function (res) {
            console.log(res)
          })
        })
      }
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