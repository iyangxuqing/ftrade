import { http } from 'http.js'

let app = getApp()

/**
 * options = {
 *  cid: cid,
 *  slient: false
 * }
 */
function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = app.cache
    let cid = options.cid
    let productList = app.productList || {}
    let products = productList['_' + cid]
    if (products && cache) {
      products = transformProducts(products, lang)
      resolve(products)
    } else {
      getProductsFromServer(options).then(function (products) {
        productList['_' + cid] = products
        app.productList = productList
        products = transformProducts(products, lang)
        resolve(products)
      })
    }
  })
}

function getProductsFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/product.php?m=getProducts_2',
      data: { cid: options.cid },
      slient: options.slient
    }).then(function (res) {
      if (res.errno === 0) {
        let products = res.products
        resolve(products)
      }
    })
  })
}

/**
 * options = {
 *  id: id,
 *  slient: slient
 * }
 */
function getProduct(options) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = app.cache
    let id = options.id
    let products = app.products || {}
    let product = products['_' + id]
    if (product && cache) {
      product = transformProduct(product, lang)
      resolve(product)
    } else {
      getProductFromServer(options).then(function (product) {
        products['_' + id] = product
        app.products = products
        product = transformProduct(product, lang)
        resolve(product)
      })
    }
  })
}

function getProductFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/product.php?m=getProduct_2',
      data: { id: options.id },
      slient: options.slient
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res.product)
      }
    })
  })
}

function transformProducts(products, lang) {
  let _products = []
  for (let i in products) {
    let title = products[i].title.json()[lang]
    if (title) {
      _products.push({
        id: products[i].id,
        cid: products[i].cid,
        title: title,
        images: JSON.parse(products[i].images)
      })
    }
  }
  return _products
}

function transformProduct(product, lang) {
  product = JSON.parse(JSON.stringify(product))
  product.title = product.title.json()
  product.title = product.title[lang]
  product.images = JSON.parse(product.images)

  let prices = product.prices
  prices = prices.json()
  prices = prices[lang]
  let _prices = []
  for (let n = 0; n < prices.length; n += 2) {
    _prices.push({
      label: prices[Number(n) + 0],
      value: prices[Number(n) + 1],
    })
  }
  prices = _prices
  product.prices = prices

  let props = product.props
  props = props.json()
  props = props[lang]
  let _props = []
  for (let n = 0; n < props.length; n += 2) {
    _props.push({
      label: props[Number(n) + 0],
      value: props[Number(n) + 1],
    })
  }
  props = _props
  product.props = props
  return product
}

export var Product = {
  getProducts: getProducts,
  getProduct: getProduct,
}