let config = require('config.js')
import { http } from 'http.js'

let app = getApp()

function getShop(lang = 'zh') {
  return new Promise(function (resolve, reject) {
    let shop = app.shop || {}
    if (shop[lang]) {
      resolve(shop[lang])
    } else {
      http.get({
        url: '_ftrade/shop.php?m=get'
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop
          let languages = shop.languages || '[]'
          languages = languages.json()
          let name = shop.name || '[]'
          name = name.json()
          let logo = shop.logo
          let phone = shop.phone
          if (!phone && app.user) {
            phone = app.user.mobile
          }
          let address = shop.address || '[]'
          address = address.json()
          let _shop = {}
          for (let i in languages) {
            let lang = languages[i]
            _shop[lang] = {
              logo: logo,
              name: name[lang],
              phone: phone,
              address: address[lang]
            }
          }
          app.shop = _shop
          shop = _shop[lang] || {}
          resolve(shop)
        }
      })
    }
  })
}

function setShop(shop, lang='zh') {
  return new Promise(function (resolve, reject) {
    app.shop[lang] = shop
    http.get({
      url: '_ftrade/shop.php?m=set',
      data: shop
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
}

export var Shop = {
  get: getShop,
  set: setShop,
}