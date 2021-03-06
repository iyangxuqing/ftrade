function add(products, product) {
  if (!product.id) product.id = 'p' + Date.now()
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

function sort(products, sourceIndex, targetIndex){
  if(sourceIndex<0 || sourceIndex>=products.length) return
  if(targetIndex<0 || targetIndex>=products.length) return
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