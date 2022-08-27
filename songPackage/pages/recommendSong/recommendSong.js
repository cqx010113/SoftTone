import request from '../../../utils/request'
import Pubsub  from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[], //推荐列表数据
    index:0, //点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    this.getRecommendList()
    //订阅来自songDetail页面发布的信息
    Pubsub.subscribe('switchType',(msg,type)=>{
      let {recommendList,index} = this.data
      if(type === 'pre'){
        (index === 0) && (index = recommendList.length)
        index -= 1
      }else{
        (index === recommendList.length -1) && (index = -1)
        index += 1
      }
      //更新下标
      this.setData({
        index
      })
      let musicId = recommendList[index].id;
      //将这个id传给songdetail页面
      Pubsub.publish('musicId',musicId)
    })
  },
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList:recommendListData.data.dailySongs
    })
  },
  //跳转到歌曲详情页面
  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      //原生小程序中路由传参，对参数长度有限制，如果参数长度过长会自动截取掉
      //不能用以下传参
      url: '/songPackage/pages/songDetail/songDetail?musicId=' + song.id,
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