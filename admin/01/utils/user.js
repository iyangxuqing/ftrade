import { http } from 'http.js'

function login() {
  wx.login({
    success: function (res) {
      if (res.code) {
        http.get({
          url: '_ftrade/user.php?m=login',
          data: {
            code: res.code,
            mina: 'server',
          }
        }).then(function (res) {
          if (res.errno === 0) {
            let user = res.user
            let token = res.token
            getApp().user = user
            wx.setStorageSync('token', token)
          }
        })
      }
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