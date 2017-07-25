import { http } from 'http.js'

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
      resolve(cates)
      getCategorysRefresh(cates)
    } else {
      getCategorysFromServer(options).then(function (cates) {
        wx.setStorageSync('cates', cates)
        cates = transformCategorys(cates, lang)
        resolve(cates)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function getCategorysFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/client/category.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        let cates = res.categorys
        resolve(cates)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getCategorysRefresh(cates) {
  let lastModified = 0
  for (let i in cates) {
    if (lastModified < cates[i].modified) lastModified = cates[i].modified
  }
  http.get({
    url: '_ftrade/client/category.php?m=refresh',
    data: {
      lastModified: lastModified
    }
  }).then(function (res) {
    if (res.errno === 0) {
      let cates = res.categorys
      if (cates) wx.setStorageSync('cates', cates)
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