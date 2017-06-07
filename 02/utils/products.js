import { http } from 'http.js'

export var __products = []

function get(options) {
  if ('id' in options && 'cid' in options) {
    return getProduct(options)
  } else if ('cid' in options) {
    return getProducts(options)
  }
}

function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let cid = options.cid
    let lang = options.lang || 'zh'
    /* 设置cache默认为true */
    if (!('cache' in options)) options.cache = true
    if (options.cache && __products[cid]) {
      resolve(__products[cid])
    } else {
      http.get({
        url: '_ftrade/product.php?m=get',
        data: { cid: cid }
      }).then(function (res) {
        if (!res.error) {
          let products = res
          for (let i in products) {
            let title = products[i].title.replace("u0027", "'")
            let prices = products[i].prices.replace("u0027", "'")
            let props = products[i].props.replace("u0027", "'")
            products[i].title = JSON.parse(title)[lang]
            products[i].images = JSON.parse(products[i].images)
            products[i].prices = JSON.parse(prices)[lang]
            products[i].props = JSON.parse(props)[lang]
          }
          __products[cid] = products
          resolve(__products[cid])
        }
      })
    }
  })
}

function getProduct(options) {
  let id = options.id
  let cid = options.cid
  let products = __products[cid]
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function add(product, cb) {
  let cid = product.cid
  let products = __products[cid]
  let max = -1
  for (let i in products) {
    if (products[i].sort > max) max = products[i].sort
  }
  product.id = 'p' + Date.now()
  product.sort = Number(max) + 1
  products.push(product)

  http.get({
    url: '_ftrade/product.php?m=add',
    data: product
  }).then(function (res) {
    if (!res.error) {
      product.id = res.serverId
      for (let i in products) {
        if (products[i].id == res.clientId) {
          products[i].id = res.serverId
          break
        }
      }
      cb && cb(products, product)
      getApp().listener.trigger('products', products, product)
    }
  })
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = __products[cid]
  for (let i in products) {
    if (products[i].id == id) {
      products[i] = product
      break
    }
  }

  http.get({
    url: '_ftrade/product.php?m=set',
    data: product
  }).then(function (res) {
    if (!res.error) {
      cb && cb(products, product)
      getApp().listener.trigger('products', products, product)
    }
  })
}

function del(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = __products[cid]
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }
  http.get({
    url: '_ftrade/product.php?m=del',
    data: { id: id }
  }).then(function (res) {
    if (!res.error) {
      cb && cb(products, product)
      getApp().listener.trigger('products', products, product)
    }
  })
  return products
}

function sort(cid, sourceIndex, targetIndex, cb) {
  let products = __products[cid]
  if (sourceIndex < 0 || sourceIndex >= products.length) return
  if (targetIndex < 0 || targetIndex >= products.length) return
  let product = products[sourceIndex]
  products.splice(sourceIndex, 1)
  products.splice(targetIndex, 0, product)

  for (let i in products) {
    if (products[i].sort != i) {
      products[i].sort = i
      http.get({
        url: '_ftrade/product.php?m=set',
        data: {
          id: products[i].id,
          sort: products[i].sort
        }
      }).then(function (res) {
        if (!res.error) {
          cb && cb(products, product)
          getApp().listener.trigger('products', products)
        }
      })
    }
  }
  return products
}

export var Product = {
  get: get,
  add: add,
  set: set,
  del: del,
  sort: sort
}