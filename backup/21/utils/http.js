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
    app.loading.show()

    let timer = setTimeout(function () {
      app.toptip.show('网络超时，请稍后重试')
      app.loading.hide()
      reject('time out')
    }, 5000)

    wx.request({
      url: config.apiUrl + options.url,
      header: {
        'Content-Type': 'application/json',
        'sid': config.sid,
        'version': config.version,
        'token': wx.getStorageSync('token'),
      },
      data: options.data,
      success: function (res) {
        if (res.statusCode == 200 && res.errMsg == 'request:ok') {
          if (res.data.errno === 0) {
            resolve(res.data)
          } else {
            app.toptip.show('网络或服务器错误，请稍后重试')
            reject(res.data)
          }
        }
      },
      fail: function (res) {
        app.toptip.show('当前没有网络连接')
        app.listener.trigger('network-none')
        reject(res)
      },
      complete: function (res) {
        app.loading.hide()
        clearTimeout(timer)
      }
    })
  })
}

function post(options) {
  return new Promise(function (resolve, reject) {
    let app = getApp()
    app.loading.show()

    let timer = setTimeout(function () {
      app.toptip.show('网络超时，请稍后重试')
      app.loading.hide()
      reject('time out')
    }, 5000)

    wx.request({
      url: config.apiUrl + options.url,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'sid': config.sid,
        'version': config.version,
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      data: options.data,
      success: function (res) {
        if (res.statusCode == 200 && res.errMsg == 'request:ok') {
          if (res.data.errno === 0) {
            resolve(res.data)
          } else {
            app.toptip.show('网络或服务器错误，请稍后重试')
            reject(res.data)
          }
        }
      },
      fail: function (res) {
        app.toptip.show('当前没有网络连接')
        app.listener.trigger('network-none')
        reject(res)
      },
      complete: function (res) {
        app.loading.hide()
        clearTimeout(timer)
      }
    })
  })
}

/**
 * options = {
 *  source: source,
 *  target: target,
 * }
 */
function cosUpload(options) {
  return new Promise(function (resolve, reject) {
    let app = getApp()

    app.loading.show()
    let timer = setTimeout(function () {
      app.toptip.show('网络超时，请稍后重试')
      app.loading.hide()
      reject('time out')
    }, 6000)

    let source = options.source
    let target = config.sid + '/' + options.target
    http.get({
      url: '_ftrade/cos.php?m=signature',
      data: { filename: target }
    }).then(function (res) {
      if (res.errno === 0) {
        let url = res.url
        let sign = res.multi_signature
        wx.uploadFile({
          url: url,
          name: 'filecontent',
          filePath: source,
          header: {
            Authorization: sign,
          },
          formData: {
            op: 'upload',
            insertOnly: 0,
          },
          success: function (res) {
            if (res.statusCode == 200) {
              let data = JSON.parse(res.data)
              if (data.message && data.message == 'SUCCESS') {
                let host = config.youImage.host
                let url = host + target
                resolve({
                  url,
                  target,
                  errno: 0,
                  error: '',
                })
              } else {
                app.toptip.show('网络或服务器错误，请稍后重试')
                reject(res)
              }
            }
          },
          fail: function (res) {
            app.toptip.show('当前没有网络连接')
            app.listener.trigger('network-none')
            reject(res)
          },
          complete: function (res) {
            app.loading.hide()
            clearTimeout(timer)
          }
        })
      }
    })
  })
}

/**
 * options = {
 *  filename: filename
 * }
 */
function cosDelete(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/cos.php?m=signature',
      data: {
        filename: options.filename
      }
    }).then(function (res) {
      let url = res.url
      let sign = res.once_signature
      wx.request({
        url: url,
        header: {
          'Content-Type': 'application/json',
          'Authorization': sign,
        },
        method: 'POST',
        data: { op: "delete" },
        success: function (res) {
          if (res.statusCode === 200) {
            let data = res.data
            if (data.message && data.message === 'SUCCESS') {
              resolve({ errno: 0, error: '' })
            }
          }
        },
      })
    })
  })
}

export var http = {
  get: get,
  post: post,
  cosUpload: cosUpload,
  cosDelete: cosDelete,
};