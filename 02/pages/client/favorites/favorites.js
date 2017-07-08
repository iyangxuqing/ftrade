let config = require('../../../utils/config.js')

var Phrases = {
  favoriteTitle: {
    'zh': '我的收藏',
    'en': 'My Collection',
    'ara': ' المفضلة ',
    'kor': '내 모음집',
  },
  favoriteEmpty: {
    'zh': '您还没有收藏任何商品',
    'en': "You haven't collected any merchandise yet",
    'ara': ' لم يكن لديك  جمع  أي سلعة ',
    'kor': '당신은 어떤 상품을 아직 모음집',
  }
}

Page({

  data: {

  },

  loadFavorites: function () {
    let favorites = wx.getStorageSync('favorites') || {}
    let lang = wx.getStorageSync('language')
    favorites = favorites[lang] || []
    for (let i in favorites) {
      for (let j in favorites[i].images) {
        favorites[i].images[j] += config.youImage.mode_w300
      }
    }
    let favoriteTitle = Phrases['favoriteTitle'][lang]
    let favoriteEmpty = Phrases['favoriteEmpty'][lang]
    wx.setNavigationBarTitle({
      title: favoriteTitle
    })
    this.setData({
      favorites,
      favoriteEmpty,
      language: lang,
    })
  },

  onFavoriteTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '../favorite/favorite?id=' + id + '&cid=' + cid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadFavorites()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})