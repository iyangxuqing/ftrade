import { http } from 'http.js'
import { DataVer } from 'dataver.js'

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
      getProductsRefresh(cid)
      resolve(products)
    } else {
      getProductsFromServer(options)
        .then(function (products) {
          let Products = wx.getStorageSync('products') || {}
          Products['c' + cid] = products
          let storageSize = wx.getStorageInfoSync().currentSize
          let productsSize = JSON.stringify(products).length / 1000
          if (storageSize + productsSize < 950) {
            wx.setStorageSync('products', Products)
          }
          let dataver = wx.getStorageSync('dataver') || {}
          dataver['c' + cid] = Math.floor(Date.now() / 1000)
          wx.setStorageSync('dataver', dataver)
          products = transformProducts(Products, cid, lang)
          resolve(products)
        })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

/**
 * options = {
 *  id: id,
 *  ids: [],
 * }
 */
function getProduct(options) {
  let lang = app.lang
  let Products = wx.getStorageSync('products') || {}
  let products = []
  if ('ids' in options) {
    let ids = options.ids
    for (let i in ids) {
      let id = ids[i]
      let product = null
      for (let j in Products) {
        for (let k in Products[j]) {
          if (Products[j][k].id == id) {
            product = Products[j][k]
            product = transformProduct(product, lang)
            break;
          }
        }
        if (product) break
      }
      if (product) products.push(product)
    }
    return products
  }
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

function getProductsRefresh(cid) {
  DataVer.get().then(function (dataVer) {
    let localDataVer = wx.getStorageSync('dataver') || {}
    if (localDataVer['c' + cid] < dataVer['c' + cid]) {
      http.get({
        url: '_ftrade/client/product.php?m=getProducts',
        data: { cid }
      }).then(function (res) {
        if (res.errno === 0) {
          let products = res.products
          let Products = wx.getStorageSync('products') || {}
          Products['c' + cid] = products
          let storageSize = wx.getStorageInfoSync().currentSize
          let productsSize = JSON.stringify(products).length / 1000
          if (storageSize + productsSize < 950) {
            wx.setStorageSync('products', Products)
          }
          let dataver = wx.getStorageSync('dataver') || {}
          dataver['c' + cid] = Math.floor(Date.now() / 1000)
          wx.setStorageSync('dataver', dataver)
        }
      })
    }
  })
}

function transformProducts(products, cid, lang) {
  products = products['c' + cid]
  if (!products) return null
  let _products = []
  for (let i in products) {
    let product = transformProduct(products[i], lang)
    if (product.title) {
      _products.push(product)
    }
  }
  return _products
}

function transformProduct(product, lang) {
  product.title = product.title || '[]'
  product.title = product.title.json() || []
  product.title = product.title[lang]
  product.images = JSON.parse(product.images)

  let prices = product.prices || '[]'
  prices = prices.json() || []
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
  props = props.json() || []
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