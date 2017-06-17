import {http} from '../../utils/http.js'

let data = {
  number: '',
  code: '',
  numberError: false,
  codeError: false,
  codeRequestText: '发送验证码'
}

let methods = {
  onNumberSubmit: function (e) {
    let page = getCurrentPages().pop()
    let number = e.detail.value.number
    if (number == '') return

    let mobile = page.data.mobile
    if (mobile.codeRequestText != '发送验证码') return

    var reg = /^1[3|4|5|7|8]\d{9}$/
    if (!reg.test(number)) {
      page.setData({
        'mobile.numberError': 'message-error'
      })
      page.toptip.show('手机号码输入有误')
      return
    }

    http.post({
      url: 'sms/codeRequest.php',
      data: {
        tplId: 29922,
        mobile: number
      }
    })

    let second = 60
    page.setData({
      'mobile.codeRequestText': '60秒后重发'
    })
    let timer = setInterval(function () {
      second--
      if (second == 0) {
        let codeRequestText = '发送验证码'
        page.setData({
          'mobile.codeRequestText': codeRequestText
        })
        clearInterval(timer)
      } else {
        let codeRequestText = second + '秒后重发'
        if (second < 10) codeRequestText = '0' + codeRequestText
        page.setData({
          'mobile.codeRequestText': codeRequestText
        })
      }
    }, 1000)

  },

  onNumberInputFocus: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'mobile.numberError': ''
    })
  },

  onCodeInput: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'mobile.code': e.detail.value
    })
  },

  onCodeInputFocus: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'mobile.codeError': false
    })
  },

  onCodeConfirm: function (e) {
    let page = getCurrentPages().pop()
    let mobile = page.data.mobile
    let number = mobile.number
    let code = mobile.code
    if (code == '') return;

    http.post({
      url: 'sms/codeVerify.php',
      data: { code, number },
    }).then(function (res) {
      if(res.error){
        page.setData({
          'mobile.codeError': 'message-error'
        })
        page.onToptipShow('验证码输入有误')
      } else {
        page.onToptipShow('手机验证成功')
      }
    })
  },

}

export class Mobile {

  constructor() {
    let page = getCurrentPages().pop()
    page.setData({
      mobile: data
    })
    for (let key in methods) {
      page['mobile.' + key] = methods[key].bind(this)
      page.setData({
        ['mobile.' + key]: 'mobile.' + key
      })
    }
  }

}