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

    if (options.cache) {
      if (__products[lang] && __products[lang][_cid]) {
        resolve(__products[lang][_cid])
        return
      }
    }

    if(!__products[lang]) __products[lang] = []
    if(!__products[lang][_cid]) __products[lang][_cid] = []

    http.get({
      url: '_ftrade/product.php?m=get',
      data: { cid: options.cid }
    }).then(function (res) {
      if (!res.error) {
        let products = res
        for (let i in products) {
          let product = products[i]
          product.images = JSON.parse(product.images)
          product.prices = JSON.parse(product.prices)
          product.props = JSON.parse(product.props)

          product.title = product.title.escape(false)
          for (let i in product.prices) {
            let price = product.prices[i]
            price.label = price.label.escape(false)
            price.value = price.value.escape(false)
          }
          for (let i in product.props) {
            let prop = product.props[i]
            prop.label = prop.label.escape(false)
            prop.value = prop.value.escape(false)
          }

          let lang = product.lang
          if (!__products[lang]) __products[lang] = []
          if (!__products[lang][_cid]) __products[lang][_cid] = []
          __products[lang][_cid].push(product)
        }
        resolve(__products[lang][_cid])
      }
    })
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

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang || 'zh'
  let _cid = '_' + product.cid
  let products = __products[lang][_cid]
  if (!id) {
    let max = -1
    for (let i in products) {
      if (products[i].sort > max) max = products[i].sort
    }
    product.id = Date.now()
    product.sort = Number(max) + 1
    products.push(product)
  } else {
    for (let i in products) {
      if (products[i].id == id) {
        products[i] = product
        break
      }
    }
  }

  let _product = JSON.parse(JSON.stringify(product))
  _product.title = _product.title.escape()
  for (let i in _product.prices) {
    _product.prices[i].label = _product.prices[i].label.escape()
    _product.prices[i].value = _product.prices[i].value.escape()
  }
  for (let i in _product.props) {
    _product.props[i].label = _product.props[i].label.escape()
    _product.props[i].value = _product.props[i].value.escape()
  }

  if (_product.title.length > 20) {
    _product.title = _product.title.substr(0, 20)
  }
  while (JSON.stringify(_product.images).length >= 500) {
    _product.images.pop()
  }
  while (JSON.stringify(_product.prices).length >= 200) {
    _product.prices.pop()
  }
  while (JSON.stringify(_product.props).length >= 500) {
    _product.props.pop()
  }

  let url = '_ftrade/product.php?m=add'
  if (id) url = '_ftrade/product.php?m=set'
  http.get({
    url: url,
    data: _product
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
  set: set,
  del: del,
  sort: sort
}