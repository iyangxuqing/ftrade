import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

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

    Product.get({ cid: activeChildId, lang:'en' }).then(function (res) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Category.get({ lang: 'zh' }).then(function (res) {
    //   console.log(res)
    // })
    // Category.get({ lang: 'en' }).then(function (res) {
    //   console.log(res)
    // })
    // return

    Category.get({ lang: 'en' }).then(function (res) {
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
      Product.get({ cid, lang:'en' }).then(function (res) {
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