let config = require('config.js')
import { Utils } from 'utils.js'

function get(options) {
  return new Promise(function (resolve, reject) {

    let startTime = Date.now()

    let requestTask = wx.request({
      url: config.apiUrl + options.url,
      header: {
        'sid': config.sid,
        'version': config.version,
        'Content-Type': 'application/json',
        'token': wx.getStorageSync('token'),
      },
      data: options.data,
      success: function (res) {
        if (res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        clearTimeout(timer)
        // netlog(startTime, options, res.errMsg)
      }
    })

    let timer = setTimeout(function () {
      requestTask.abort()
      // netlog(startTime, options, '30s timeout')
      reject('30s timeout')
    }, 30000)

  })
}

function netlog(startTime, options, status) {
  let endTime = Date.now()
  let dt = endTime - startTime
  let log = {
    startTime: Utils.formatDateTime(startTime),
    diffTime: endTime - startTime,
    url: options.url.split('/')[2],
    data: options.data || '',
    status: status
  }
  wx.request({
    url: config.apiUrl + '_ftrade/client/netlog.php?m=add',
    header: {
      'Content-Type': 'application/json',
      'token': wx.getStorageSync('token'),
    },
    data: log,
  })
}

export var http = {
  get: get,
};