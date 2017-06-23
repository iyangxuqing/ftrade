import { http } from 'http.js'
import { Product } from 'products.js'

function getCategorysSync(lang = 'zh') {
  let cates = wx.getStorageSync('localCategorys')
  return cates[lang]
}

function getCategorys(lang = 'zh', cache = true) {
  return new Promise(function (resolve, reject) {
    let cates = wx.getStorageSync('localCategorys')
    if (cates && cache) {
      resolve(cates[lang])
    } else {
      getCategorysFromServer().then(function (cates) {
        wx.setStorageSync('localCategorys', cates)
        resolve(cates[lang])
      })
    }
  })
}

function getCategorysFromServer() {
  return new Promise(function (resolve, reject) {
    let cates = {} //最终得到的层级类目数据
    let _cates = {} //临时类目数据
    http.get({
      url: '_ftrade/category.php?m=get'
    }).then(function (res) {
      if (res.categorys) {
        // res.categorys 数据库原始记录
        for (let i in res.categorys) {
          // 对title进行编码转义
          let cate = res.categorys[i]
          cate.title = cate.title.escape(false)

          // 按语言类别进行分组
          let lang = cate.lang
          if (!_cates[lang]) _cates[lang] = []
          _cates[lang].push(cate)
        }
        // 构造层级化的类目数据
        for (let lang in _cates) {
          cates[lang] = []
          for (let i in _cates[lang]) {
            let cate = _cates[lang][i]
            let pid = cate.pid
            if (pid == 0) {
              cate.children = []
              cates[lang].push(cate)
            } else {
              for (let j in cates[lang]) {
                if (cates[lang][j].id == pid) {
                  cates[lang][j].children.push(cate)
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

/*
  由类目id取得该类目信息，供products等页面调用
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

function add(cate, cb) {
  let Cates = wx.getStorageSync('localCategorys')
  let lang = cate.lang || 'zh'
  let cates = Cates[lang]

  let max = -1
  if (cate.pid == 0) {
    for (let i in cates) {
      if (cates[i].sort > max) {
        max = cates[i].sort
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].sort > max) {
            max = cates[i].children[j].sort
          }
        }
        break
      }
    }
  }
  cate.id = Date.now()
  cate.sort = Number(max) + 1

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
  http.get({
    url: '_ftrade/category.php?m=add',
    data: {
      id: cate.id,
      pid: cate.pid,
      sort: cate.sort,
      title: cate.title.escape()
    }
  }).then(function (res) {
    if (!res.error) {
      cb && cb(cates)
    }
  })
  /* server end */

  Cates[cate.lang] = cates
  wx.setStorageSync('localCategorys', Cates)
  return cates
}

function setTitle(cate, cb) {
  let Cates = wx.getStorageSync('localCategorys')
  let lang = cate.lang || 'zh'
  let cates = Cates[lang]

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
  http.get({
    url: '_ftrade/category.php?m=set',
    data: {
      id: cate.id,
      pid: cate.pid,
      title: cate.title.escape()
    }
  }).then(function (res) {
    if (!res.error) {
      cb && cb(cates)
    }
  })
  /* server end */

  Cates[lang] = cates
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
                cates[i].children[j] = cate.thumb
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
      http.get({
        url: '_ftrade/category.php?m=set',
        data: cate
      }).then(function (res) {
        if (!res.error) {
          cb && cb(cates)
        }
      })
      /* server end */

    })
  })
}

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
        console.log(products, products.length)
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
    http.get({
      url: '_ftrade/category.php?m=del',
      data: cate
    })
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
  /* server */
  for (let i in cates) {
    if (cates[i].sort != i) {
      cates[i].sort = i
      http.get({
        url: '_ftrade/category.php?m=set',
        data: { id: cates[i].id, sort: i }
      }).then(function (res) {
        if (!res.error) {
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
          if (!res.error) {
            cates[i].children[j].sort = j
          }
        })
      }
    }
  }

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
