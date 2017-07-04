// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  runAsync: function () {
    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('执行完成')
        resolve('随便什么数据1')
      }, 2000)
    })
    return p
  },
  runAsync1: function () {
    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('异步任务一执行完成')
        resolve('随便什么数据1')
      }, 2000)
    })
    return p
  },
  runAsync2: function () {
    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('异步任务二执行完成')
        resolve('随便什么数据2')
      }, 1100)
    })
    return p
  },
  runAsync3: function () {
    let p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        console.log('异步任务三执行完成')
        resolve('随便什么数据3')
      }, 2000)
    })
    return p
  },

  getNumber: function () {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        var num = Math.ceil(Math.random() * 10)
        if (num <= 5) {
          resolve(num)
        } else {
          reject('数字太大了')
        }
      }, 2000)
    })
    return p
  },

  requestImg: function () {
    var p = new Promise(function (resolve, reject) {
      var img = new Image()
      img.onload = function () {
        resolve(img)
      }
      img.src = 'xxxxxx'
    })
    return p
  },

  timeout: function(){
    var p = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject('图片请求超时')
      }, 3000)
    })
    return p
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // Promise.race([this.requestImg(), this.timeout()])
    // .then(function(res){
    //   console.log(res)
    // }, function(res){
    //   console.log(res)
    // })
    // .catch(function(res){
    //   console.log(res)
    // })

    // Promise.race([this.runAsync1(), this.runAsync2(), this.runAsync3()]).then(function (res) {
    //   console.log(res)
    // })

    // Promise.all([this.runAsync1(), this.runAsync2(), this.runAsync3()])
    // .then(function(res){
    //   console.log(res)
    // })

    // this.getNumber()
    // .then(function(res){
    //   console.log(res)
    //   console.log(somedata)
    // })
    // .catch(function(res){
    //   console.log(res)
    // })

    // this.getNumber()
    // .then(function(res){
    //   console.log(res)
    // }.bind(this), function(res){
    //   console.log(res)
    // }.bind(this))

    // this.runAsync1()
    // .then(function(res){
    //   console.log(res)
    //   // return this.runAsync2()
    //   return '直接返回数据'
    // }.bind(this))
    // .then(function(res){
    //   console.log(res)
    //   return this.runAsync3()
    // }.bind(this))
    // .then(function(res){
    //   console.log(res)
    // })


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