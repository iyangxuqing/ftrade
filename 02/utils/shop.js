import { http } from 'http.js'

let app = getApp()
/**
 * options = {
 *  nocache: false,
 * }
 */
function getShop(options = {}) {
  return new Promise(function (resolve, reject) {
    let lang = app.lang
    let shop = wx.getStorageSync('shop')
    let cache = !options.nocache
    if (shop && cache) {
      shop = transformShop(shop)
      resolve(shop)
    } else {
      http.get({
        url: '_ftrade/client/shop.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop
          wx.setStorageSync('shop', shop)
          shop = transformShop(shop, lang)
          resolve(shop)
        }
      })
    }
  })
}

function transformShop(shop, lang) {
  shop.name = shop.name || '[]'
  shop.name = shop.name.json()
  shop.name = shop.name[lang] || shop.name['zh']
  shop.address = shop.address || '[]'
  shop.address = shop.address.json()
  shop.address = shop.address[lang] || shop.address['zh']
  return shop
}

export var Shop = {
  get: getShop,
}