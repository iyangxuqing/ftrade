let config = require('config.js')

function checkResponse(res) {
  return true;
}

function showRequestFailedTip() {
  // getApp().listener.trigger('tip', {
  //     title: '网络错误，请重试...',
  // })
}

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
        checkResponse(res)
        resolve(res.data)
      },
      fail: function (error) {
        showRequestFailedTip()
        reject(error)
      }
    })
  })
}

function post(options) {
  return new Promise(function (resolve, reject) {
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
        checkResponse(res)
        resolve(res.data)
      },
      fail: function (res) {
        showRequestFailedTip()
        reject(res)
      }
    })
  })
}

/*
    options.paths = []
    options.uploadDir = ''
*/
function upload(options) {
  var uploadedNum = 0
  var uploadedFiles = []
  var paths = options.paths || []
  var uploadDir = options.uploadDir || config.uploadDir
  var uploadUrl = config.apiUrl + 'upload/uploadImage.php'

  return new Promise(function (resolve, reject) {
    if (paths.length == 0) {
      resolve({
        uploadedFiles: []
      })
      return
    }
    for (let i in paths) {
      var path = paths[i]
      wx.uploadFile({
        url: uploadUrl,
        filePath: path,
        name: 'file',
        header: {
          'sid': config.sid,
          'version': config.version,
          'token': wx.getStorageSync('token')
        },
        formData: {
          source: path,
          uploadDir: uploadDir
        },
        success: function (res) {
          console.log(res)
          var data = JSON.parse(res.data)
          if (data.target) {
            uploadedFiles.push({
              source: data.source,
              target: data.target
            })
          } else {
            reject(res)
          }
        },
        fail: function (res) {
          reject(res)
        },
        complete: function () {
          uploadedNum++;
          if (uploadedNum == paths.length) {
            resolve({
              uploadedFiles: uploadedFiles
            })
          }
        }
      })
    }
  })
}

export var http = {
  get: get,
  post: post,
  upload: upload
};