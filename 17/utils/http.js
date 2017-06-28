let config = require('config.js')

function checkResponse(res) {
  return true;
}

function showRequestFailedTip() {
  // getApp().listener.trigger('tip', {
  //     title: '网络错误，请重试...',
  // })
  console.log('net fail.')
}

/*
  网络请求
  在没有网络时，wx.request会引发fail错误，回报{errMsg: 'request:fail'}
  当请求超时，同样引发fail错误，回报{errMsg: 'request: fail timeout'}
  在没有fail错误发生时，success收到的数据也可能由于服务器的原因，
  或数据本身逻辑错误，使得res.data中为服务器的报错信息。
  检查数据的完整性，应当查看res.data中存在相关字段或res.data.error==''。
*/

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
      },
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
    sae upload
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
          var data = JSON.parse(res.data)
          if (data.target) {
            uploadedFiles.push({
              source: data.source,
              target: data.target
            })
          } else {
            reject(res)
            return
          }
        },
        fail: function (res) {
          reject(res)
          return
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

function ossUpload(options) {
  return new Promise(function (resolve, reject) {
    let dir = options.dir
    let filePath = options.sourcePath
    let targetPath = options.targetPath
    http.get({
      url: '_ftrade/oss.php?m=postObject',
      data: {
        dir: 'ftrade/',
        file: targetPath,
      }
    }).then(function (res) {
      if (res.signature) {
        let url = res.host
        let key = res.dir + targetPath
        let OSSAccessKeyId = res.accessid
        let policy = res.policy
        let signature = res.signature
        wx.uploadFile({
          url: url,
          name: 'file',
          filePath: filePath,
          formData: {
            key,
            policy,
            signature,
            OSSAccessKeyId,
          },
          success: function (res) {
            if (res.statusCode && res.statusCode == 204) {
              resolve({
                sourcePath: filePath,
                targetPath: url + "/" + key,
              })
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

export var http = {
  get: get,
  post: post,
  upload: upload,
  ossUpload: ossUpload,
};