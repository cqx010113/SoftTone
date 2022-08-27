// pages/index/index.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    //获取轮播图数据
    let bannerResult = await request('/banner',{type:2})
    this.setData({
      bannerList:bannerResult.banners
    })
    //获取推荐歌单数据
    let recommendResult = await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendResult.result
    })
    //获取轮播图数据
    let index = 24381625;
    let resultArr = []
    while(index < 24381627){
      let topListResult = await request('/playlist/detail',{id:index++})
      let topListItem = {name:topListResult.playlist.name,tracks:topListResult.playlist.tracks.slice(0,3)}
      resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
    }
  },
  TorecommendSong(){
    wx.redirectTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})