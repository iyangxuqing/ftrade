import { http } from 'http.js'

/**
 * options = {
 *  nocache: false,
 * }
 */
function login(options = {}) {
  return new Promise(function (resolve, reject) {
    let token = wx.getStorageSync('token')
    let cache = !options.nocache
    if (token && cache) {
      resolve(token)
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            http.get({
              url: '_ftrade/user.php?m=login',
              data: { code: res.code }
            }).then(function (res) {
              if (res.errno === 0) {
                let token = res.token
                wx.setStorageSync('token', token)
                resolve(token)
              }
            })
          }
        }
      })
    }
  })
}

function getUser() {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/user.php?m=get'
    }).then(function (res) {
      if (res.errno === 0) {
        let user = res.user
        resolve(user)
      }
    })
  })
}

export var User = {
  login: login,
  get: getUser,
}