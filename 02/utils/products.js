import { http } from 'http.js'

export var __products = []

function get(cid = null) {
  let products = []
  let _products = wx.getStorageSync('products')
  for (let i in _products) {
    if (_products[i].cid == cid) {
      products.push(_products[i])
    }
  }
  __products = products
}

function add(product, cb) {
  let products = __products
  let max = 0
  for (let i in products) {
    if (products[i].cid == product.cid) {
      if (products[i].sort > max) max = products[i].sort
    }
  }
  product.id = '_newid'
  product.sort = max + 1

  http.get({
    url: '_ftrade/product.php?m=add',
    data: product
  }).then(function (res) {
    if (!res.error) {
      product.id = res.insertId
      for (let i in products) {
        if (products[i].id == '_newid') {
          products[i].id = res.insertId
          break
        }
      }
      wx.setStorageSync('products', products)
      cb && cb(product)
    }
  })

  products.push(product)
  wx.setStorageSync('products', products)
  return products
}

function set(product, cb) {
  http.get({
    url: '_ftrade/product.php?m=set',
    data: product
  }).then(function (res) {
    if (!res.error) {
      cb && cb(product)
    }
  })

  let products = __products
  for (let i in products) {
    if (products[i].id == product.id) {
      Object.assign(products[i], product)
      break
    }
  }
}

function del(id, cb) {
  let products = __products
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }
  http.get({
    url: '_ftrade/product.php?del',
    data: { id: id }
  }).then(function (res) {
    if (!res.error) {
      cb && cb(products)
    }
  })
  return products
}

function sort(products, sourceIndex, targetIndex) {
  if (sourceIndex < 0 || sourceIndex >= products.length) return
  if (targetIndex < 0 || targetIndex >= products.length) return
  let product = products[sourceIndex]
  products.splice(sourceIndex, 1)
  products.splice(targetIndex, 0, product)
  wx.setStorageSync('products', products)
}

export var Product = {
  add: add,
  set: set,
  del: del,
  sort: sort
}