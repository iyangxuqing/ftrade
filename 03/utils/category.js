import { http } from 'http.js'

let newId = 0
let cates = []

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
              cates.children.push(res[i])
            }
          }
        }
      }
      addNew(cates)
      resolve(cates)
    })
  })
}

function addNew(cates) {
  let empty = false
  for (let i in cates) {
    if (cates[i].title == '') {
      empty = true
      break
    }
  }
  if (!empty) {
    cates.push({
      id: '0-' + Date.now(),
      pid: 0,
      title: '',
      thumb: '',
      children: []
    })
  }
  for (let i in cates) {
    let empty = false
    for (let j in cates[i].children) {
      if (cates[i].children[j].title == '') {
        empty = true
        break
      }
    }
    if (!empty) {
      cates[i].children.push({
        id: cates[i].id + '-' + Date.now(),
        pid: cates[i].id,
        title: '',
        thumb: ''
      })
    }
  }
}

function set(cates, cate) {
  if (cate.pid == 0) {
    for (let i in cates) {
      if (cates[i].id == cate.id) {
        if (cate.title) cates[i].title = cate.title
        if (cate.thumb) cates[i].thumb = cate.thumb
        break
      }
    }
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cate.id) {
            if (cate.title) cates[i].children[j].title = cate.title
            if (cate.thumb) cates[i].children[j].thumb = cate.thubm
            break
          }
        }
      }
    }
  }
  addNew(cates)
}

function del(cates, cate) {
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
          }
        }
      }
    }
  }
}

function sort(cates, cate, up = false) {
  let _cate = {}
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
            cates[i] = cates[parseInt(i) + 1]
            cates[parseInt(i) + 1] = temp
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
                cates[i].children[j] = cates[i].children[parseInt(j) + 1]
                cates[i].children[parseInt(j) + 1] = temp
              }
            }
            break
          }
        }
      }
    }
  }
}

function generateId(cates) {
  if (newId == 0) {
    let max = 0
    for (let i in cates) {
      if (cates[i].id > max) max = cates[i].id
      for (let j in cates[i].children) {
        if (cates[i].children[j].id > max) {
          max = cates[i].children[j].id
        }
      }
    }
    newId = max + 1
  } else {
    newId = newId + 1
  }
}

export var Category = {
  get: get,
  set: set,
  del: del,
  sort: sort
}
