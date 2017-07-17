import { http } from 'http.js'

let app = getApp()

/**
 * options = {
 *  slient: false
 * }
 */
function getCategorys(options = {}) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = app.cache
    let cates = app.cates
    if (cates && cache) {
      cates = transformCategorys(cates, lang)
      resolve(cates)
    } else {
      getCategorysFromServer(options).then(function (cates) {
        app.cates = cates
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
      url: '_ftrade/category.php?m=get',
      slient: options.slient
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