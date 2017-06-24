import { http } from 'http.js'

function getProductsSync(cid, lang = 'zh') {
  let products = wx.getStorageSync('localProducts')
  return products[lang]['_' + cid]
}

function getProducts(cid, lang = 'zh', cache = false) {
  return new Promise(function (resolve, reject) {
    let _cid = '_' + cid
    let products = wx.getStorageSync('localProducts')
    if (!products) products = {}
    if (!products[lang]) products[lang] = {}
    if (cache && products[lang][_cid]) {
      resolve(products[lang][_cid] || [])
    } else {
      getProductsFromServer(cid).then(function (products) {
        let Products = wx.getStorageSync('localProducts')
        if (products.length == 0) {
          products[lang] = []
        }
        for (let lang in products) {
          if (!Products[lang]) Products[lang] = {}
          Products[lang][_cid] = products[lang]
        }
        wx.setStorageSync('localProducts', Products)
        resolve(products[lang])
      })
    }
  })
}

function getProductsFromServer(cid) {
  return new Promise(function (resolve, reject) {
    let products = {}
    http.get({
      url: '_ftrade/product.php?m=get',
      data: { cid: cid }
    }).then(function (res) {
      if (res.errno == 0) {
        for (let i in res.products) {
          let product = res.products[i]
          let id = product.id
          let cid = product.cid
          let sort = product.sort
          let images = JSON.parse(product.images)
          let _title = JSON.parse(product.title)
          let _prices = JSON.parse(product.prices)
          let _props = JSON.parse(product.props)
          for (let lang in _title) {
            if (!products[lang]) products[lang] = []
            let title = _title[lang] || ''
            title = title.escape(false)
            let __prices = _prices[lang] || []
            let prices = []
            for (let n = 0; n < __prices.length; n += 2) {
              prices.push({
                label: __prices[Number(n) + 0].escape(false),
                value: __prices[Number(n) + 1].escape(false),
              })
            }
            let __props = _props[lang] || []
            let props = []
            for (let n = 0; n < __props.length; n += 2) {
              props.push({
                label: __props[Number(n) + 0].escape(false),
                value: __props[Number(n) + 1].escape(false),
              })
            }
            products[lang].push({
              id, cid, title, images, prices, props, sort
            })
          }
        }
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
  let lang = product.lang || 'zh'
  let Products = wx.getStorageSync('localProducts')

  let products = Products[lang]['_' + cid] || []
  if (!id) {
    let max = -1
    for (let i in products) {
      if (Number(products[i].sort) > max) max = products[i].sort
    }
    product.id = Date.now()
    product.sort = Number(max) + 1
    console.log(product.sort)
    products.push(product)
  } else {
    for (let i in products) {
      if (products[i].id == id) {
        products[i] = product
        break
      }
    }
  }
  Products[lang]['_' + cid] = products
  wx.setStorageSync('localProducts', Products)
  cb && cb(products, product)
  getApp().listener.trigger('products', products, product)

  /* server start */
  if (getApp().user.role == 'admin') {
    let _product = JSON.parse(JSON.stringify(product))
    _product.lang = lang
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
    })
  }
  /* server end */
}

function del(product, cb) {
  let id = product.id
  let cid = product.cid
  let lang = product.lang || 'zh'
  let Products = wx.getStorageSync('localProducts')
  let products = Products[lang]['_' + cid]
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }

  /* server start */
  if (getApp().user.role == 'admin') {
    http.get({
      url: '_ftrade/product.php?m=del',
      data: { id: id }
    }).then(function (res) {
      if (!res.error) {
        cb && cb(products, product)
        getApp().listener.trigger('products', products, product)
      }
    })
  }
  /* server end */

  Products[lang]['_' + cid] = products
  wx.setStorageSync('localProducts', Products)
  return products
}

function sort(product, sourceIndex, targetIndex, cb) {
  let cid = product.cid
  let lang = product.lang || 'zh'
  let Products = wx.getStorageSync('localProducts')
  let products = Products[lang]['_' + cid]
  if (sourceIndex < 0 || sourceIndex >= products.length) {
    return products
  }
  if (targetIndex < 0 || targetIndex >= products.length) {
    return products
  }
  products.splice(sourceIndex, 1)
  products.splice(targetIndex, 0, product)

  /* server start */
  if (getApp().user.role == 'admin') {
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
  }
  /* server end */

  Products[lang]['_' + cid] = products
  wx.setStorageSync('localProducts', Products)
  return products
}

export var Product = {
  getProducts: getProducts,
  getProduct: getProduct,
  set: set,
  del: del,
  sort: sort
}