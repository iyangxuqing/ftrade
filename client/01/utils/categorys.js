import { http } from 'http.js'
import { DataVer } from 'dataver.js'

let app = getApp()

/**
 * options = {
 *  nocache: false,
 * }
 */
function getCategorys(options = {}) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = !options.nocache
    let cates = wx.getStorageSync('cates')
    if (cates && cache) {
      cates = transformCategorys(cates, lang)
      getCategorysRefresh()
      resolve(cates)
    } else {
      getCategorysFromServer(options)
        .then(function (cates) {
          wx.setStorageSync('cates', cates)
          let dataver = wx.getStorageSync('dataver') || {}
          dataver['categorys'] = Math.floor(Date.now() / 1000)
          wx.setStorageSync('dataver', dataver)
          cates = transformCategorys(cates, lang)
          resolve(cates)
        })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

function getCategorysFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/client/category.php?m=get',
    })
      .then(function (res) {
        if (res.errno === 0) {
          let cates = res.categorys
          resolve(cates)
        } else {
          reject(res)
        }
      })
      .catch(function (res) {
        reject(res)
      })
  })
}

function getCategorysRefresh() {
  DataVer.get().then(function (dataVer) {
    let localDataVer = wx.getStorageSync('dataver') || {}
    if (localDataVer.categorys < dataVer.categorys) {
      http.get({
        url: '_ftrade/client/category.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let cates = res.categorys
          wx.setStorageSync('cates', cates)
          let dataver = wx.getStorageSync('dataver') || {}
          dataver['categorys'] = Math.floor(Date.now() / 1000)
          wx.setStorageSync('dataver', dataver)
        }
      })
    }
  })
}

function transformCategorys(cates, lang) {
  cates = JSON.parse(JSON.stringify(cates))
  for (let i in cates) {
    cates[i].title = cates[i].title.json()[lang]
  }
  let _cates = []
  for (let i in cates) {
    let cate = cates[i]
    if (cate.pid == 0) {
      cate.children = []
      _cates.push(cate)
    } else {
      for (let j in _cates) {
        if (cate.pid == _cates[j].id) {
          _cates[j].children.push(cate)
          break
        }
      }
    }
  }
  return _cates
}

export var Category = {
  getCategorys: getCategorys,
}