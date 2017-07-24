import { http } from 'http.js'

let dataUpdated = null
let dataUpdatedIndex = 0
let requestCount = 0

let remoteCates = []
let remoteProducts = []

function getDataUpdated() {
  http.get({
    url: '_ftrade/client/db.php?m=getTimestamp',
    slient: true
  }).then(function (res) {
    if (res.errno === 0) {
      remoteCates = res.catesTimestamp
      remoteProducts = res.productsTimestamp
      let _remoteProducts = {}
      for (let i in remoteProducts) {
        let cid = remoteProducts[i].cid
        if (!_remoteProducts['c' + cid]) _remoteProducts['c' + cid] = []
        _remoteProducts['c' + cid].push(remoteProducts[i])
      }
      remoteProducts = _remoteProducts

      dataUpdated = []
      getCatesUpdated()
      getProductsUpdated()
      getProductUpdated()
    }
  })
}

function getCatesUpdated() {
  let localCates = wx.getStorageSync('cates')
  let updated = false
  if (localCates.length == remoteCates.length) {
    for (let i in localCates) {
      let a = localCates[i]
      let b = remoteCates[i]
      if (!(a.id == b.id && a.modified == b.modified)) {
        updated = true
        break
      }
    }
  } else {
    updated = true
  }
  if (updated) {
    dataUpdated.push({
      dataType: 'categorys'
    })
  }
}

function getProductsUpdated() {
  let localProducts = wx.getStorageSync('products')

  let _localProducts = {}
  for (let i in localProducts) {
    if (i.indexOf('c') == 0) continue
    let cid = localProducts[i].cid
    if (!_localProducts['c' + cid]) _localProducts['c' + cid] = []
    _localProducts['c' + cid].push(localProducts[i])
  }
  localProducts = _localProducts

  for (let i in remoteCates) {
    if (remoteCates[i].pid == 0) continue
    let updated = false
    let cid = remoteCates[i].id
    let _remoteProducts = remoteProducts['c' + cid] || []
    let _localProducts = localProducts['c' + cid] || []
    if (_remoteProducts.length == _localProducts.length) {
      for (let j in _remoteProducts) {
        let a = _remoteProducts[j]
        let b = _localProducts[j]
        if (!(a.id == b.id && a.modified == b.modified)) {
          updated = true
          break
        }
      }
    } else {
      updated = true
    }
    if (updated) {
      dataUpdated.push({
        dataType: 'products',
        cid: cid,
      })
    }
  }
}

function getProductUpdated() {
  let localProducts = wx.getStorageSync('products')
  for (let i in remoteProducts) {
    for (let j in remoteProducts[i]) {
      let a = remoteProducts[i][j]
      let b = localProducts['i' + a.id] || {}
      let updated = true
      if (a.modified == b.modified && b.prices) updated = false
      if (updated) {
        dataUpdated.push({
          dataType: 'product',
          id: a.id,
        })
      }
    }
  }
}

function run() {
  if (!dataUpdated) {
    getDataUpdated()
    return
  }

  for (let i in dataUpdated) {
    let task = dataUpdated[i]
    if (task.updated) continue
    getData(task)
    dataUpdatedIndex++
    if (requestCount >= 5) break
  }
  if (requestCount == 0) {
    console.log('finished')
    clearInterval(timer)
  }
}

// let timer = setInterval(function (res) {
//   run()
// }, 10000)

function getData(task) {
  if (task.dataType == 'categorys') {
    requestCount++
    http.get({
      url: '_ftrade/client/category.php?m=get'
    }).then(function (cates) {
      console.log(cates)
      requestCount--
      task.updated = true
    }).catch(function (res) {
      requestCount--
    })
  } else if (task.dataType == 'products') {
    requestCount++
    http.get({
      url: '_ftrade/client/product.php?m=getProducts',
      data: { cid: task.cid }
    }).then(function (products) {
      requestCount--
      task.updated = true
      console.log(products)
    }).catch(function (res) {
      requestCount--
    })
  } else if (task.dataType == 'product') {
    requestCount++
    http.get({
      url: '_ftrade/client/product.php?m=getProduct',
      data: { id: task.id }
    }).then(function (product) {
      requestCount--
      task.updated = true
      console.log(product)
    }).catch(function (res) {
      requestCount--
    })
  }
}
