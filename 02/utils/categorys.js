import { http } from 'http.js'
import { Product } from 'products.js'

function getCategorys(lang = 'zh', cache = false) {
  return new Promise(function (resolve, reject) {
    let cates = wx.getStorageSync('localCategorys') || {}
    if (cates[lang] && cache) {
      resolve(cates[lang])
    } else {
      getCategorysFromServer().then(function (cates) {
        /**
         * 注意空数据的处理
         * 在新用户创建时，用户的类别数据是空的。
         * 也有些语言，由于翻译的滞后，可能数据为空。
         * 空数据也是一种有效数据，所以用[]来表示，而不能用null来表示。
         * null表示数据读取不到，不是有效数据。
         */
        if (!cates[lang]) cates[lang] = []
        wx.setStorageSync('localCategorys', cates)
        resolve(cates[lang])
      })
    }
  })
}

function getCategorysFromServer() {
  return new Promise(function (resolve, reject) {
    let cates = {}
    http.get({
      url: '_ftrade/category.php?m=get'
    }).then(function (res) {
      if (res.errno === 0) {
        let _cates = {}
        for (let i in res.categorys) {
          let category = res.categorys[i]
          let id = category.id
          let pid = category.pid
          let thumb = category.thumb
          let sort = category.sort
          // fix me 这里的title需要转义回来
          let titles = JSON.parse(category.title)
          for (let lang in titles) {
            if (!_cates[lang]) _cates[lang] = []
            /**
             * 用户输入的数据，可能包含单引号、双引号、反斜杠、换行符等，
             * 这些字符会使sql语句执行错误，或者使json转换发生错误，
             * 因此在送去服务器前会它们进行转义，数据库保存的是转义后的字符，
             * 从服务器读取到数据后，则需要反转义来正确显示其本来的面目。
             */
            let title = titles[lang].escape(false)
            _cates[lang].push({ id, pid, title, thumb, sort })
          }
        }
        for (let lang in _cates) {
          cates[lang] = []
          for (let i in _cates[lang]) {
            let cate = _cates[lang][i]
            if (cate.pid == 0) {
              cate.children = []
              cates[lang].push(cate)
            } else {
              for (let j in cates[lang]) {
                if (cate.pid == cates[lang][j].id) {
                  cates[lang][j].children.push(cate)
                  break
                }
              }
            }
          }
        }
        resolve(cates)
      }
    })
  })
}

/**
 * 在什么情况下可以使用getCategorysSync？
 * 只有在确保当前场景下数据已经准备好，
 * 如果数据未准备好，不可能来到当前场景时，
 * 为了代码简化，可以使用getCategorysSync。
 */
function getCategorysSync(lang = 'zh') {
  let cates = wx.getStorageSync('localCategorys')
  return cates[lang]
}

/**
 * 由类目id取得该类目信息，供products等页面调用。
 * 由于在那样的使用场景下，categorys数据肯定已经在本地准备好了，
 * 所以可以使用同步的方式来提供数据。
*/
function getCategory(id, lang = 'zh') {
  let cates = getCategorysSync(lang)
  for (let i in cates) {
    for (let j in cates[i].children) {
      if (cates[i].children[j].id == id) {
        return {
          id: id,
          pid: cates[i].id,
          title: cates[i].children[j].title,
          thumb: cates[i].children[j].thumb,
          ptitle: cates[i].title,
          pthumb: cates[i].thumb,
        }
      }
    }
  }
}

/**
 * 增加一个新类目，可以是一级类目或子类目
 * cb为写服务器后调用的回调函数
 */
function add(cate, cb) {
  let Cates = wx.getStorageSync('localCategorys')
  if (!cate.lang) cate.lang = 'zh'
  let cates = Cates[cate.lang]

  let max = -1
  if (cate.pid == 0) {
    for (let i in cates) {
      if (Number(cates[i].sort) > max) {
        max = Number(cates[i].sort)
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          if (Number(cates[i].children[j].sort) > max) {
            max = Number(cates[i].children[j].sort)
          }
        }
        break
      }
    }
  }
  cate.id = Date.now()
  cate.sort = max + 1
  cate.thumb = ''

  if (cate.pid == 0) {
    cate.children = []
    cates.push(cate)
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        cates[i].children.push(cate)
        break
      }
    }
  }

  /* server start */
  if (getApp().user.role == 'admin') {
    http.get({
      url: '_ftrade/category.php?m=add',
      data: {
        id: cate.id,
        pid: cate.pid,
        lang: cate.lang,
        sort: cate.sort,
        /* 对输入中的单引号、双引号、反斜杠、换行符进行转义 */
        title: cate.title.escape()
      }
    }).then(function (res) {
      cb && cb(cates)
    })
  }
  /* server end */

  Cates[cate.lang] = cates
  wx.setStorageSync('localCategorys', Cates)
  return cates
}

function setTitle(cate, cb) {
  let Cates = wx.getStorageSync('localCategorys')
  if (!cate.lang) cate.lang = 'zh'
  let cates = Cates[cate.lang]

  if (cate.pid == 0) {
    for (let i in cates) {
      if (cates[i].id == cate.id) {
        cates[i].title = cate.title
        break
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cate.id) {
            cates[i].children[j].title = cate.title
            break
          }
        }
        break
      }
    }
  }

  /* server start */
  if (getApp().user.role == 'admin') {
    http.get({
      url: '_ftrade/category.php?m=set',
      data: {
        id: cate.id,
        pid: cate.pid,
        lang: cate.lang,
        title: cate.title.escape()
      }
    }).then(function (res) {
      cb && cb(cates)
    })
  }
  /* server end */

  Cates[cate.lang] = cates
  wx.setStorageSync('localCategorys', Cates)
  return cates
}

function setThumb(cate, cb) {
  return new Promise(function (resolve, reject) {
    http.upload({
      paths: new Array(cate.thumb)
    }).then(function (res) {
      cate.thumb = res.uploadedFiles[0].target
      let Cates = wx.getStorageSync('localCategorys')
      let lang = cate.lang || 'zh'
      let cates = Cates[lang]
      if (cate.pid == 0) {
        for (let i in cates) {
          if (cates[i].id == cate.id) {
            cates[i].thumb = cate.thumb
            break
          }
        }
      } else {
        for (let i in cates) {
          if (cates[i].id == cate.pid) {
            for (let j in cates[i].children) {
              if (cates[i].children[j].id == cate.id) {
                cates[i].children[j].thumb = cate.thumb
                break
              }
            }
            break;
          }
        }
      }
      Cates[lang] = cates
      wx.setStorageSync('localCategorys', Cates)
      resolve(cates)

      /* server start */
      if (getApp().user.role == 'admin') {
        http.get({
          url: '_ftrade/category.php?m=set',
          data: {
            id: cate.id,
            pid: cate.pid,
            thumb: cate.thumb
          }
        }).then(function (res) {
          cb && cb(cates)
        })
      }
      /* server end */

    })
  })
}

/**
 * 用于检测类目是否可以被删除，
 * 这里主要用于前端数据检测，看在前端的缓存数据中，
 * 要被删除的类目是否包含子类目或下属商品。
 * 在演示版本中，由于用户不被允许操作数据库数据，
 * 所以前端缓存数据和后台服务器数据是不一致的，
 * 所以需要进行前端数据检测。
 */
function testDelete(cate) {
  return new Promise(function (resolve, reject) {
    let Cates = wx.getStorageSync('localCategorys')
    let lang = cate.lang || 'zh'
    let cates = Cates[lang]
    if (cate.pid == 0) {
      for (let i in cates) {
        if (cates[i].id == cate.id) {
          if (cates[i].children.length > 0) {
            resolve({
              errno: -1,
              error: '该类目下存在子类目，不可删除。'
            })
          } else {
            resolve({
              errno: 0,
              error: ''
            })
          }
          break
        }
      }
    } else {
      Product.getProducts(cate.id, lang).then(function (products) {
        if (products.length > 0) {
          resolve({
            errno: -2,
            error: '该类目下存在商品，不可删除。'
          })
        } else {
          resolve({
            errno: 0,
            error: ''
          })
        }
      })
    }
  })
}

function del(cate) {
  return new Promise(function (resolve, reject) {
    let Cates = wx.getStorageSync('localCategorys')
    let lang = cate.lang || 'zh'
    let cates = Cates[lang]

    testDelete(cate).then(function (res) {
      if (res.error) {
        resolve(res)
        /**
         * 这里检测到前端不可被删除后，需要直接退出，
         * 因为后面代码中有服务端代码，如果不直接退出，
         * 非演示类用户会继续执行服务器代码，
         * 这时会在界面上提示两次不可删除。
         */
        return
      } else {
        if (cate.pid == 0) {
          for (let i in cates) {
            if (cates[i].id == cate.id) {
              cates.splice(i, 1)
              break
            }
          }
        } else {
          for (let i in cates) {
            if (cates[i].id == cate.pid) {
              for (let j in cates[i].children) {
                if (cates[i].children[j].id == cate.id) {
                  cates[i].children.splice(j, 1)
                  break
                }
              }
              break
            }
          }
        }
        resolve(cates)
        Cates[lang] = cates
        wx.setStorageSync('localCategorys', Cates)
      }
    })

    /* server start */
    if (getApp().user.role == 'admin') {
      http.get({
        url: '_ftrade/category.php?m=del',
        data: cate
      }).then(function (res) {
        /**
         * 如果后台数据库检测中该类目不可被删除，
         * 则返回错误信息，信息中包含不可被删除的原因，
         * 不可被删除的原因需要在界面上进行提示。
         */
        if (res.error) {
          resolve(res)
        }
      })
    }
    /* server end */

  })
}

function sort(cate, up = false) {
  let Cates = wx.getStorageSync('localCategorys')
  let lang = cate.lang || 'zh'
  let cates = Cates[lang]

  if (cate.pid == 0) {
    for (let i in cates) {
      if (cates[i].id == cate.id) {
        let temp = cates[i]
        if (up) {
          if (i > 0) {
            cates[i] = cates[i - 1]
            cates[i - 1] = temp
          }
        } else {
          if (i < cates.length - 1) {
            cates[i] = cates[Number(i) + 1]
            cates[Number(i) + 1] = temp
          }
        }
        break
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cate.id) {
            let temp = cates[i].children[j]
            if (up) {
              if (j > 0) {
                cates[i].children[j] = cates[i].children[j - 1]
                cates[i].children[j - 1] = temp
              }
            } else {
              if (j < cates[i].children.length - 1) {
                cates[i].children[j] = cates[i].children[Number(j) + 1]
                cates[i].children[Number(j) + 1] = temp
              }
            }
            break
          }
        }
        break
      }
    }
  }

  /* server start */
  if (getApp().user.role == 'admin') {
    for (let i in cates) {
      if (cates[i].sort != i) {
        cates[i].sort = i
        http.get({
          url: '_ftrade/category.php?m=set',
          data: { id: cates[i].id, sort: i }
        }).then(function (res) {
          if (res.errno === 0) {
            cates[i].sort = i
          }
        })
      }
      for (let j in cates[i].children) {
        if (cates[i].children[j].sort != j) {
          cates[i].children[j].sort = j
          http.get({
            url: '_ftrade/category.php?m=set',
            data: { id: cates[i].children[j].id, sort: j }
          }).then(function (res) {
            if (res.errno === 0) {
              cates[i].children[j].sort = j
            }
          })
        }
      }
    }
  }
  /* server end */

  Cates[lang] = cates
  wx.setStorageSync('localCategorys', Cates)
  return cates
}

export var Category = {
  getCategorys: getCategorys,
  getCategory: getCategory,
  setTitle: setTitle,
  setThumb: setThumb,
  add: add,
  del: del,
  sort: sort,
}
