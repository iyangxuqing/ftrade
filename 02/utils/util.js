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
  String.prototype.escape = function (escape = true) {
    let value = this
    if (escape) {
      let temp = ''
      for (let i = 0; i < value.length; i++) {
        let char = value[i]
        let ascii = value.charCodeAt(i)
        if (ascii == 10) char = 'u000A' //换行符 \r
        else if (ascii == 13) char = 'u000D' //回车符 \n
        else if (ascii == 34) char = 'u0022' //双行号 "
        else if (ascii == 39) char = 'u0027' //单行号 '
        else if (ascii == 92) char = 'u005C' //反斜杠 \
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
