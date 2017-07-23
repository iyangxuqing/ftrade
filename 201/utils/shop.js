import { http } from 'http.js'

let app = getApp()

function getShop() {
  return new Promise(function (resolve, reject) {
    let shop = app.shop
    if (shop) {
      resolve(shop)
    } else {
      http.get({
        url: '_ftrade/shop.php?m=get'
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop || {}
          let name = shop.name || '[]'
          name = name.json()['zh'] || ''
          let logo = shop.logo
          let phone = shop.phone || ''
          let address = shop.address || '[]'
          address = address.json()['zh'] || ''
          shop = {
            name,
            logo,
            phone,
            address,
          }
          app.shop = shop
          resolve(shop)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setShop(shop) {
  return new Promise(function (resolve, reject) {
    app.shop = shop
    /* server */
    if (app.user.role == 'admin') {
      http.get({
        url: '_ftrade/shop.php?m=set',
        data: shop
      }).then(function (res) {
        if (res.errno === 0) {
          resolve(res)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
    /* server */
  })
}

export var Shop = {
  get: getShop,
  set: setShop,
}