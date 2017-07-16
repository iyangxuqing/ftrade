import { http } from 'http.js'

let app = getApp()
/**
 * options = {
 *  slient: false
 * }
 */
function getShop(options = {}) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let cache = app.cache
    let shop = app.shop
    if (shop && cache) {
      shop = transformShop(shop)
      resolve(shop)
    } else {
      http.get({
        url: '_ftrade/shop.php?m=get',
        slient: options.slient
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop
          app.shop = shop
          shop = transformShop(shop, lang)
          resolve(shop)
        }
      })
    }
  })
}

function transformShop(shop, lang) {
  shop = JSON.parse(JSON.stringify(shop))
  shop.name = shop.name.json()
  shop.name = shop.name[lang]
  shop.address = shop.address.json()
  shop.address = shop.address[lang]
  return shop
}

export var Shop = {
  get: getShop,
}