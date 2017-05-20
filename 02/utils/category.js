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
      resolve(cates)
    })
  })
}

function add(cates, cate) {
  if (cate.pid == 0) {
    cates.push({
      id: cate.pid + '-' + Date.now(),
      pid: cate.pid,
      title: cate.title,
      thumb: '',
      children: []
    })
  } else {
    for (let i in cates) {
      if (cates[i].id == cate.pid) {
        cates[i].children.push({
          id: cate.pid + '-' + Date.now(),
          pid: cate.pid,
          title: cate.title,
          thumb: ''
        })
      }
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

export var Category = {
  get: get,
  add: add,
  set: set,
  del: del,
  sort: sort
}
