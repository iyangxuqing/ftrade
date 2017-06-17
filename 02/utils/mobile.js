import { http } from 'http.js'

function mobileCodeRequest(number) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sms/codeRequest.php',
      data: {
        tplId: 29922,
        mobile: number
      }
    }).then(function (res) {
      resolve(res)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function mobileCodeVerify(number, code) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sms/codeVerify.php',
      data: { code, number },
    }).then(function (res) {
      resolve(res)
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var Mobile = {
  codeRequest: mobileCodeRequest,
  codeVerify: mobileCodeVerify
}