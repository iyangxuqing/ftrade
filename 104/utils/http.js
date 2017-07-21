let config = require('config.js')

function get(options) {
  return new Promise(function (resolve, reject) {

    let time1 = new Date()

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

        // let time2 = new Date()
        // let dt = time2.getTime() - time1.getTime()
        // let recode = {}
        // recode.startTime = time1.Format("yyyy-MM-dd hh:mm:ss")
        // recode.dt = dt
        // recode.url = options.url
        // recode.data = options.data
        // recode.statusCode = res.statusCode
        // wx.request({
        //   url: config.apiUrl + '_ftrade/client/net.php?m=add',
        //   header: {
        //     'sid': config.sid,
        //     'version': config.version,
        //     'token': wx.getStorageSync('token'),
        //     'Content-Type': 'application/json',
        //   },
        //   data: recode,
        // })

      }
    })
  })
}

export var http = {
  get: get,
};