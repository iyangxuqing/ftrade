import { http } from 'http.js'
import { Product } from 'products.js'

let app = getApp()

/**
 * options = {
 *  nocache: false,
 * }
 */
function getCategorys(options = {}) {
  return new Promise(function (resolve, reject) {
    let cates = app.cates
    let cache = !options.nocache
    if (cates && cache) {
      resolve(cates)
    } else {
      getCategorysFromServer(options).then(function (cates) {
        cates = transformCategorys(cates, 'zh')
        app.cates = cates
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

/**
 * 由类目id取得该类目信息，供products等页面调用。
 * 由于在那样的使用场景下，categorys数据肯定已经在本地准备好了，
 * 所以可以使用同步的方式来提供数据。
*/
function getCategory(id) {
  let cates = app.cates
  for (let i in cates) {
    for (let j in cates[i].children) {
      if (cates[i].children[j].id == id) {
        return {
          id: id,
          pid: cates[i].id,
          title: cates[i].children[j].title,
          ptitle: cates[i].title,
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
  let cates = app.cates
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
  if (app.user.role == 'admin') {
    http.get({
      url: '_ftrade/category.php?m=set_v2',
      data: {
        id: cate.id,
        pid: cate.pid,
        sort: cate.sort,
        title: cate.title
      }
    }).then(function (res) {
      cb && cb(cates)
    })
  }
  /* server end */
  return cates
}

function set(cate, cb) {
  let cates = app.cates
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
  if (app.user.role == 'admin') {
    http.get({
      url: '_ftrade/category.php?m=set_v2',
      data: {
        id: cate.id,
        pid: cate.pid,
        title: cate.title
      }
    }).then(function (res) {
      cb && cb(cates)
    })
  }
  /* server end */
  return cates
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
    let cates = app.cates
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
      Product.getProducts({ cid: cate.id })
        .then(function (products) {
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
    let cates = app.cates
    testDelete(cate).then(function (res) {
      if (res.error) {
        resolve(res)
        /**
         * 这里检测到前端不可被删除后，需要直接退出，
         * 因为后面代码中有服务端代码，如果不直接退出，
         * 非演示类用户会继续执行服务器代码，
         * 这时就会在界面上提示两次不可删除。
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
      }
    })

    /* server start */
    if (app.user.role == 'admin') {
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
  let cates = app.cates
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
  if (app.user.role == 'admin') {
    for (let i in cates) {
      if (cates[i].sort != i) {
        cates[i].sort = i
        http.get({
          url: '_ftrade/category.php?m=set_v2',
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
            url: '_ftrade/category.php?m=set_v2',
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
  return cates
}

export var Category = {
  getCategorys: getCategorys,
  getCategory: getCategory,
  set: set,
  add: add,
  del: del,
  sort: sort,
}
