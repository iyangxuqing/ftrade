let config = require('config.js')

/*
  网络请求
  在没有网络时，wx.request会引发fail错误，回报{errMsg: 'request:fail'}
  当请求超时，同样引发fail错误，回报{errMsg: 'request: fail timeout'}
  在没有fail错误发生时，success收到的数据也可能由于服务器的原因，
  或数据本身逻辑错误，使得res.data中为服务器的报错信息。
  检查数据的完整性，应当查看res.data中存在相关字段或res.data.error===''。
*/

function get(options) {
  return new Promise(function (resolve, reject) {
    let app = getApp()
    if (!options.slient) {
      app.loading.show()
    }
    wx.request({
      url: config.apiUrl + options.url,
      header: {
        'sid': config.sid,
        'version': config.version,
        'token': wx.getStorageSync('token'),
        'Content-Type': 'application/json',
      },
      data: options.data,
      success: function (res) {
        if (res.statusCode == 200 && res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        if (!options.slient) {
          app.loading.hide()
        }
      }
    })
  })
}

export var http = {
  get: get,
};