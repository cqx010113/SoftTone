import request from '../../../utils/request'
import Pubsub  from 'pubsub-js'
import moment from 'moment'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{}, //歌曲详情对象
    musicId:'', //音乐Id
    musicLink:'', //音乐的链接
    currentTime:'00:00', //实际时长
    durationTime:'00:00', //总时长
    currentWidth:0, //实际宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)
    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay:true
      })
    }
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    /*
      bug：如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放状态和真实的音乐播放状态不一样
     */
    this.backgroundAudioManager.onPlay(()=>{
      this.setData({
        isPlay:true
      })
      //修改全局音乐播放状态
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlay:false
      })
      //修改全局音乐播放状态
      appInstance.globalData.isMusicPlay = false;
    })
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlay:false
      })
      //修改全局音乐播放状态
      appInstance.globalData.isMusicPlay = false;
    })
    //监听音乐实时播放
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss")
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    //监听音乐自然播放结束
    this.backgroundAudioManager.onEnded(()=>{
      //自动切换至下一首，并且自动播放
      Pubsub.publish('switchType','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
  },
  //获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids:musicId})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title:this.data.song.name
    })
  },
  //切歌的回调
  handleSwitch(event){
    let type = event.currentTarget.id
    //关闭当前播放音乐
    this.backgroundAudioManager.stop()
    //订阅来自recommendSong页面发布的信息
    Pubsub.subscribe('musicId',(msg,musicId)=>{
      console.log(musicId);
      //获取音乐详情信息
      this.getMusicInfo(musicId)
      //切歌自动播放
      this.musicControl(true,musicId)
      //取消订阅
      Pubsub.unsubscribe('musicId')
    })
    Pubsub.publish('switchType',type)
  },
  //播放暂停的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay
    let {musicId,musicLink} = this.data;
    this.musicControl(isPlay,musicId,musicLink)
  },
  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
    if(isPlay){
      //获取音乐播放链接
      if(!musicLink){
        let musicLinkData = await request('/song/url',{id:musicId})
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      //音乐播放
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    }else{
      //音乐暂停
      this.backgroundAudioManager.pause()
    }
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