import { http } from 'http.js'

let app = getApp()

/**
 * options = {
 *  cid: cid,
 *  nocache: false,
 * }
 */
function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = !options.nocache
    let cid = options.cid
    let Products = wx.getStorageSync('products') || {}
    let products = transformProducts(Products, cid, lang)
    if (products && cache) {
      resolve(products)
    } else {
      getProductsFromServer(options)
        .then(function (products) {
          let Products = wx.getStorageSync('products') || {}
          Products['c' + cid] = products.length
          for (let i in products) {
            let id = products[i].id
            Products['i' + id] = products[i]
          }
          wx.setStorageSync('products', Products)
          products = transformProducts(Products, cid, lang)
          resolve(products)
        })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

function getProductsFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/client/product.php?m=getProducts',
      data: { cid: options.cid },
    })
      .then(function (res) {
        if (res.errno === 0) {
          let products = res.products
          resolve(products)
        } else {
          reject(res)
        }
      })
      .catch(function (res) {
        reject(res)
      })
  })
}

/**
 * options = {
 *  id: id,
 *  nocache: false,
 * }
 */
function getProduct(options) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = !options.nocache
    let id = options.id
    let cid = options.cid
    let products = wx.getStorageSync('products') || {}
    let product = products['i' + id]
    console.log(product)
    if (product && product.prices && cache) {
      product = transformProduct(product, lang)
      console.log(2, product)
      resolve(product)
    } else {
      getProductFromServer(options)
        .then(function (product) {
          let products = wx.getStorageSync('products') || {}
          products['i' + id] = product
          wx.setStorageSync('products', products)
          product = transformProduct(product, lang)
          resolve(product)
        })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

function getProductFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: '_ftrade/client/product.php?m=getProduct',
      data: { id: options.id },
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res.product)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function transformProducts(products, cid, lang) {
  if (typeof products['c' + cid] == 'undefined') {
    return null
  }
  let _products = []
  for (let i in products) {
    if (products[i].cid == cid) {
      let product = transformProduct(products[i], lang)
      if (product.title) {
        _products.push(product)
      }
    }
  }
  return _products
}

function transformProduct(product, lang) {
  product = JSON.parse(JSON.stringify(product))
  product.title = product.title.json()
  product.title = product.title[lang]
  product.images = JSON.parse(product.images)

  let prices = product.prices || '[]'
  prices = prices.json()
  prices = prices[lang] || []
  let _prices = []
  for (let n = 0; n < prices.length; n += 2) {
    _prices.push({
      label: prices[Number(n) + 0],
      value: prices[Number(n) + 1],
    })
  }
  prices = _prices
  product.prices = prices

  let props = product.props || '[]'
  props = props.json()
  props = props[lang] || []
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