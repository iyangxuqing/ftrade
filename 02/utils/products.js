import { http } from 'http.js'

export var __products = []

function get(options) {
  let defaults = { lang: 'zh', cache: true }
  options = Object.assign(defaults, options)
  if ('id' in options && 'cid' in options) {
    return getProduct(options)
  } else if ('cid' in options) {
    return getProducts(options)
  }
}

function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let lang = options.lang
    let _cid = '_' + options.cid
    if (options.cache && __products[lang] && __products[lang][_cid]) {
      resolve(__products[lang][_cid])
    } else {
      http.get({
        url: '_ftrade/product.php?m=get',
        data: { cid: options.cid }
      }).then(function (res) {
        if (!res.error) {
          if (!__products[lang]) __products[lang] = []
          if (!__products[lang][_cid]) __products[lang][_cid] = []
          let products = res
          for (let i in products) {
            let product = products[i]
            let lang = product.lang
            product.images = JSON.parse(product.images)
            product.prices = JSON.parse(product.prices)
            product.props = JSON.parse(product.props)
            __products[lang][_cid].push(product)
          }
          resolve(__products[lang][_cid])
        }
      })
    }
  })
}

function getProduct(options) {
  let id = options.id
  let cid = options.cid
  let lang = options.lang
  let _cid = '_' + options.cid
  let products = __products[lang][_cid]
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function add(product, cb) {
  let cid = product.cid
  let lang = product.lang || 'zh'
  let _cid = '_' + product.cid
  let products = __products[lang][_cid]
  let max = -1
  for (let i in products) {
    if (products[i].sort > max) max = products[i].sort
  }
  product.id = Date.now()
  product.sort = Number(max) + 1
  products.push(product)
  http.get({
    url: '_ftrade/product.php?m=add',
    data: product
  }).then(function (res) {
    if (!res.error) {
      cb && cb(products, product)
      getApp().listener.trigger('products', products, product)
    }
  })
  return products
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang || 'zh'
  let _cid = '_' + product.cid
  let products = __products[lang][_cid]
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
  return products
}

function del(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang || 'zh'
  let _cid = '_' + product.cid
  let products = __products[lang][_cid]
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

function sort(product, sourceIndex, targetIndex, cb) {
  let lang = product.lang || 'zh'
  let _cid = '_' + product.cid
  let products = __products[lang][_cid]
  if (sourceIndex < 0 || sourceIndex >= products.length) return
  if (targetIndex < 0 || targetIndex >= products.length) return
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