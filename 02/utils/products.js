import { http } from 'http.js'

function getProductsSync(cid, lang = 'zh') {
  let products = wx.getStorageSync('localProducts')
  return products[lang]['_' + cid]
}

function getProducts(cid, lang = 'zh', cache = true) {
  return new Promise(function (resolve, reject) {
    let _cid = '_' + cid
    let products = wx.getStorageSync('localProducts')
    if (!products) products = {}
    if (!products[lang]) products[lang] = {}
    if (cache && products[lang][_cid]) {
      resolve(products[lang][_cid])
    } else {
      getProductsFromServer(options).then(function (res) {
        let products = res
        resolve(products[lang][_cid])
      })
    }
  })
}

function getProductsFromServer(cid) {
  return new Promise(function (resolve, reject) {
    let products = wx.getStorageSync('localProducts') || {}
    http.get({
      url: '_ftrade/product.php?m=get',
      data: { cid: cid }
    }).then(function (res) {
      if (res.products) {
        for (let i in res.products) {
          let product = res.products[i]
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

          let _cid = '_' + cid
          let lang = product.lang
          if (!products[lang]) products[lang] = {}
          if (!products[lang][_cid]) products[lang][_cid] = []
          products[lang][_cid].push(product)
        }
        wx.setStorageSync('localProducts', products)
        resolve(products)
      }
    })
  })
}

function getProduct(id, cid, lang = 'zh') {
  let products = getProductsSync(cid, lang)
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang
  let products = getProductsSync(cid, lang)
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
  let lang = product.lang
  let products = getProductsSync(cid, lang);
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
  let cid = product.cid
  let lang = product.lang
  let products = getProductsSync(cid, lang)
  if (sourceIndex < 0 || sourceIndex >= products.length) {
    return products
  }
  if (targetIndex < 0 || targetIndex >= products.length) {
    return products
  }
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
  getProducts: getProducts,
  getProduct: getProduct,
  set: set,
  del: del,
  sort: sort
}