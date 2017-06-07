import { http } from 'http.js'

export var __cates = []

/*
  获取类目信息，options中存在id字段时，只获取单个类目信息，无id字段时则获取全部类目信息。cache字段用来控制是否从缓存中读取。
 */
function get(options = {}) {
  if ('id' in options) {
    return getCategory(options.id)
  } else {
    return getCategorys(options.cache)
  }
}

/*
  取得所有类目信息，包括子类目，cache=true时，如果内存中已有数据则使用内存数据
*/
function getCategorys(cache = true) {
  return new Promise(function (resolve, reject) {
    if (cache && __cates.length > 0) {
      resolve(__cates)
      return
    }

    __cates = []
    http.get({
      url: '_ftrade/category.php?m=get'
    }).then(function (res) {
      for (let i in res) {
        let cate = res[i]
        let pid = cate.pid
        if (pid == 0) {
          cate.children = []
          __cates.push(cate)
        } else {
          for (let j in __cates) {
            if (__cates[j].id == pid) {
              __cates[j].children.push(cate)
            }
          }
        }
      }
      resolve(__cates)
    })
  })
}

/*
  由类目id取得该类目信息，由products、product等页面调用
*/
function getCategory(id) {
  let cates = __cates
  for (let i in cates) {
    for (let j in cates[i].children) {
      if (cates[i].children[j].id == id) {
        return {
          id: id,
          title: cates[i].children[j].title,
          thumb: cates[i].children[j].thumb,
          pid: cates[i].id,
          ptitle: cates[i].title,
          pthumb: cates[i].thumb,
        }
      }
    }
  }
}

function add(cate, cb) {
  let cates = __cates
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
  cate.id = 'c' + Date.now()
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

  http.get({
    url: '_ftrade/category.php?m=add',
    data: {
      id: cate.id,
      pid: cate.pid,
      sort: cate.sort,
      title: cate.title,
    }
  }).then(function (res) {
    if (!res.error) {
      if (cate.pid == 0) {
        for (let i in cates) {
          if (cates[i].id == res.clientId) {
            cates[i].id = res.serverId
            break
          }
        }
      } else {
        for (let i in cates) {
          if (cates[i].id == cate.pid) {
            for (let j in cates[i].children) {
              if (cates[i].children[j].id == 'res.clientId') {
                cates[i].children[j].id = res.serverId
                break
              }
            }
            break
          }
        }
      }
      cb && cb(cates)
    }
  })

  return cates
}

function set(cate, cb) {
  if ('title' in cate) return setTitle(cate, cb)
  if ('thumb' in cate) return setThumb(cate, cb)
}

function setTitle(cate, cb) {
  let cates = __cates
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

  http.get({
    url: '_ftrade/category.php?m=set',
    data: cate
  }).then(function (res) {
    if (!res.error) {
      cb && cb(cates)
    }
  })

  return cates
}

function setThumb(cate, cb) {
  let cates = __cates
  let _cate = null
  if (cate.pid == 0) {
    for (let i in cates) {
      if (cates[i].id == cate.id) {
        _cate = cates[i]
        break
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cate.id) {
            _cate = cates[i].children[j]
            break
          }
        }
        break;
      }
    }
  }
  _cate.thumb = cate.thumb

  http.upload({
    paths: new Array(cate.thumb)
  }).then(function (res) {
    cate.thumb = res.uploadedFiles[0].target
    http.get({
      url: '_ftrade/category.php?m=set',
      data: cate
    }).then(function (res) {
      if (!res.error) {
        _cate.thumb = cate.thumb
        cb && cb(cates)
      }
    })
  })

  return cates
}

function del(cate) {
  let cates = __cates
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
  http.get({
    url: '_ftrade/category.php?m=del',
    data: cate
  })
  return cates
}

function sort(cate, up = false) {
  let cates = __cates
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
  return cates
}

export var Category = {
  get: get,
  add: add,
  set: set,
  del: del,
  sort: sort,
}
