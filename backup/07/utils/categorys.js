import { http } from 'http.js'

export var __cates = []

function get() {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/category.php?m=get'
    }).then(function (res) {
      let cates = []
      for (let i in res) {
        let cate = res[i]
        let pid = cate.pid
        if (pid == 0) {
          cate.children = []
          cates.push(cate)
        } else {
          for (let j in cates) {
            if (cates[j].id == pid) {
              cates[j].children.push(res[i])
            }
          }
        }
      }
      __cates = cates
      resolve(cates)
    })
  })
}

function add(cates, cate) {
  let max = 0
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
      }
    }
  }
  cate.sort = Number(max) + 1

  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/category.php?m=add',
      data: cate
    }).then(function (res) {
      if (!res.error) {
        cate.id = res.insertId
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
        resolve(cates)
        __cates = cates
      }
    })
  })
}

function set(cates, cate, clientfn, serverfn) {
  if (cate.title) setTitle(cates, cate)
  if (cate.thumb) setThumb(cates, cate, clientfn, serverfn)
}

function setTitle(cates, cate) {
  /* client */
  if (cate.pid == 0) {
    for (let i in cates) {
      if (cates[i].id == cate.id) {
        if (cates[i].title == cate.title) return
        cates[i].title = cate.title
        break
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          let child = cates[i].children[j]
          if (child.id == cate.id) {
            if (child.title == cate.title) return
            child.title = cate.title
            break
          }
        }
      }
    }
  }
  __cates = cates

  /* server */
  http.get({
    url: '_ftrade/category.php?m=set',
    data: cate
  })
}

function setThumb(cates, cate, clientfn, serverfn) {
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
        if (_cate) break;
      }
    }
  }
  _cate.thumb = cate.thumb
  __cates = cates
  clientfn && clientfn()

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
        __cates = cates
        serverfn && serverfn()
      }
    })
  })
}

function del(cates, cate) {
  http.get({
    url: '_ftrade/category.php?m=del',
    data: cate
  }).then(function (res) {

  })
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
      }
    }
  }
  __cates = cates
}

function sort(cates, cate, up = false) {
  /* client */
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
      }
    }
  }

  /* server */
  for (let i in cates) {
    if (cates[i].sort != i) {
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

    /* client */
    cates[i].sort = i
    for (let j in cates[i].children) {
      cates[i].children[j].sort = j
    }
    __cates = cates

  }
}

export var Category = {
  get: get,
  add: add,
  set: set,
  del: del,
  sort: sort,
}
