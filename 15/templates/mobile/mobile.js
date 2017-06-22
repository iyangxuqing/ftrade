import { http } from '../../utils/http.js'

let data = {
  number: '',
  code: '',
  verified: '',
  showCodeInput: true,
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
      url: '_ftrade/mobile.php?m=codeRequest',
      data: {
        tplId: 29922,
        mobile: number
      }
    })

    let second = 60
    page.setData({
      'mobile.number': number,
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
      url: '_ftrade/mobile.php?m=codeVerify',
      data: { code, mobile: number },
    }).then(function (res) {
      if (res.mobileVerified) {
        page.setData({
          'mobile.verified': 'verified'
        })
        setTimeout(function () {
          page.setData({
            'mobile.showCodeInput': false
          })
          this.success && this.success({
            mobile: number,
            verified: true
          })
        }.bind(this), 300)
      } else {
        page.setData({
          'mobile.codeError': 'message-error'
        })
        page.toptip.show('验证码输入有误')
      }
    }.bind(this))
  },

}

export class Mobile {

  constructor(success) {
    this.success = success
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