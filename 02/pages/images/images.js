import { Category } from '../../utils/categorys.js'
import { Product } from '../../utils/products.js'
import { http } from '../../utils/http.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    Category.getCategorys().then(function (cates) {
      for (let i in cates) {
        for (let j in cates[i].children) {
          let cate = cates[i].children[j]
          let cid = cate.id
          Product.getProducts(cid).then(function (products) {
            for (let k in products) {
              let product = products[k]
              let images = product.images
              for (let l in images) {
                let image = images[l]
                wx.downloadFile({
                  url: image,
                  success: function (res) {
                    let tempFilePath = res.tempFilePath
                    http.cosUpload({
                      source: tempFilePath,
                      target: Date.now() + '.jpg'
                    }).then(function(res){
                      let filename = res.url.split('?')[0]
                      console.log(filename)
                      image = filename
                    })
                  }
                })
              }
              break
            }
          })
          break
        }
        break
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