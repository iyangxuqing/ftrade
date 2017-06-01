import { http } from 'http.js'

export var __products = []

function add(products, product, cb) {
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
      for (let i in products) {
        if (products[i].id == '_newid') {
          products[i].id = res.insertId
          break
        }
      }
      wx.setStorageSync('products', products)
      cb && cb(products)
    }
  })

  products.push(product)
  wx.setStorageSync('products', products)

}

function set(products, product) {
  for (let i in products) {
    if (products[i].id == product.id) {
      products[i] = product
      break
    }
  }
  wx.setStorageSync('products', products)

  console.log(product)
  http.get({
    url: '_ftrade/product.php?m=set',
    data: product
  }).then(function (res) {
    console.log(res)
  })
}

function del(products, id) {
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }
  wx.setStorageSync('products', products)
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