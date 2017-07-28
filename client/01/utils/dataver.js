import { http } from 'http.js'

function getDataVer() {
  return new Promise(function (resolve, reject) {
    let app = getApp()
    if (app.dataVer) {
      resolve(app.dataVer)
    } else {
      http.get({
        url: '_ftrade/client/dataver.php?m=get'
      }).then(function (res) {
        if (res.errno === 0) {
          let dataVer = res.dataVer
          let _dataVer = {}
          for(let i in dataVer){
            _dataVer[dataVer[i].type] = dataVer[i].modified
          }
          dataVer = _dataVer
          getApp().dataVer = dataVer
          resolve(dataVer)
        }
      })
    }
  })
}

export var DataVer = {
  get: getDataVer
}