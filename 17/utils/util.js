/**
 * fix me utils/categorys.js中读取到的category.title需要反转义
 * 
 */

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

(function stringEscape() {
  String.prototype.json = function () {
    let value = this
    let temp = ''
    for (let i = 0; i < value.length; i++) {
      let char = value[i]
      let ascii = value.charCodeAt(i)
      if (ascii === 0) char = 'u0000' //null
      else if (ascii === 8) char = 'u0008' //回退符 \b
      else if (ascii === 9) char = 'u0009' //制表符 \t
      else if (ascii == 10) char = 'u000A' //换行符 \r
      else if (ascii == 11) char = 'u000B' //制表符 \v
      else if (ascii == 12) char = 'u000C' //换页符 \f
      else if (ascii == 13) char = 'u000D' //回车符 \n
      // else if (ascii == 34) char = 'u0022' //双引号 \"
      // else if (ascii == 39) char = 'u0027' //单引号 \'
      else if (ascii == 92) char = 'u005C' //反斜杠 \\
      temp += char
    }
    try {
      let object = JSON.parse(temp, function (key, val) {
        if (key === '') return val
        if (typeof val == 'string') {
          val = val.replace(/u0000/g, '\0')
          val = val.replace(/u0008/g, '\b')
          val = val.replace(/u0009/g, '\t')
          val = val.replace(/u000A/g, '\r')
          val = val.replace(/u000B/g, '\v')
          val = val.replace(/u000C/g, '\f')
          val = val.replace(/u000D/g, '\n')
          val = val.replace(/u0022/g, '"')
          val = val.replace(/u0027/g, "'")
          val = val.replace(/u005C/g, '\\')
        }
        return val
      })
      return object
    } catch (e) {
      return null
    }
  }

  String.prototype.escape = function (escape = true) {
    let value = this
    if (escape) {
      let temp = ''
      for (let i = 0; i < value.length; i++) {
        let char = value[i]
        let ascii = value.charCodeAt(i)
        // if (ascii == 0) char = 'u0000' //空字符 null
        // if (ascii === 8) char = 'u0008' //回退符 \b
        // if (ascii === 9) char = 'u0009' //制表符 \t
        // if (ascii == 10) char = 'u000A' //换行符 \r
        // else if (ascii == 11) char = 'u000B' //制表符 \v
        // else if (ascii == 12) char = 'u000C' //换页符 \f
        // else if (ascii == 13) char = 'u000D' //回车符 \n
        // else if (ascii == 34) char = 'u0022' //双行号 \"
        // else if (ascii == 39) char = 'u0027' //单行号 \'
        // else if (ascii == 92) char = 'u005C' //反斜杠 \\
        temp += char
      }
      return temp
    } else {
      value = value.replace(/u000A/g, String.fromCharCode(10))
      value = value.replace(/u000D/g, String.fromCharCode(13))
      value = value.replace(/u0022/g, '"')
      value = value.replace(/u0027/g, "'")
      value = value.replace(/u005C/g, '\\')
      return value
    }
  }
})()

module.exports = {
  formatTime: formatTime
}
