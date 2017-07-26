import { http } from 'http.js'

function login() {
  wx.login({
    success: function (res) {
      if (res.code) {
        http.get({
          url: '_ftrade/client/user.php?m=login',
          data: { 
            code: res.code,
            mina: 'client',
          }
        }).then(function (res) {
          if (res.errno === 0) {
            let token = res.token
            wx.setStorageSync('token', token)
          }
        })
      }
    }
  })
}

export var User = {
  login: login,
}