let config = require('utils/config.js')
import 'utils/util.js'
import { User } from 'utils/user.js'
import { Listener } from 'utils/listener.js'

App({
  onLaunch: function () {
    this.init()
  },

  init: function () {
    this.listener = new Listener()
    this.youImageMode = config.youImage.mode
    let app = this
    app.user = {}
    User.login()
  }
  
})