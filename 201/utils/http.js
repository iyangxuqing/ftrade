let config = require('config.js')

function get(options) {
  return new Promise(function (resolve, reject) {
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
            reject(res)
          }
        }
      },
      fail: function (res) {
        reject(res)
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
                reject(res)
              }
            }
          },
          fail: function (res) {
            reject(res)
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
  cosUpload: cosUpload,
  cosDelete: cosDelete,
};