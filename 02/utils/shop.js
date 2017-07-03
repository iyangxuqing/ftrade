let config = require('config.js')
import { http } from 'http.js'

function getShop(lang = 'zh') {
  return new Promise(function (resolve, reject) {
    let shop = getApp().shop || {}
    if (shop[lang]) {
      resolve(shop[lang])
    } else {
      http.get({
        url: '_ftrade/shop.php?m=get'
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop || {}
          let logo = shop.logo + config.youImage.mode_w300
          let name = shop.name.json() || []
          let phone = shop.phone
          if (!phone) phone = getApp().user.mobile
          let address = shop.address.json() || []
          shop = {}
          for (let i in name) {
            shop[i] = {
              logo: logo,
              name: name[i],
              phone: phone,
              address: address[i]
            }
          }
          getApp().shop = shop
          resolve(shop[lang])
        }
      })
    }
  })
}

function setShop(shop) {
  return new Promise(function (resolve, reject) {
    if (shop.logo) {
      let logo = shop.logo
      shop.logo = logo.split(config.youImage.mode_w300)[0]
    }
    if (!shop.mobile) {
      if (getApp().user) shop.phone = getApp().user.mobile
    }
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