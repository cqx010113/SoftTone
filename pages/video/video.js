import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //导航标签数据
    navId:'', //导航的标识
    videoList:[], //视频列表
    videoId:'', //视频id标识
    videoUpdateTime:[], //记录播放时长
    isTriggered:false, //标识下拉刷新是否刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupList()
  },
  //获取导航数据
  async getVideoGroupList(){
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  //获取视频列表数据
  async getVideoList(navId,offset = 0){
    console.log(offset);
    let videoListData = await request('/video/group',{id:navId,offset})
    wx.hideLoading()
    let index = 0
    let videoList = videoListData.datas.map(item=>{
      item.id = index++;
      return item
    })
    let list = await Promise.all(videoList.map(async item =>{
      item.data.urlInfo = {
        url:await this.setVideoUrl(item.data.vid)
      }
      return item
    }))
    console.log(list);
    this.setData({
      videoList:list,
      isTriggered:false
    })
  },
  async setVideoUrl(vid){
    console.log(vid);
    let result = await request('/video/url',{id:vid})
    return result.urls[0].url
  },
  //点击播放的回调
  handlePlay(event){
    /*
    需求：
      1.在点击播放的事件中需要找到上一个播放的视频
      2.在播放新的视频之前关闭上一个正在播放的视频
    关键：
      1.如何找到上一个视频的实例对象
      2.如何确认点击播放的视频和正在播放的视频不是同一个视频
     */
    let vid = event.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId:vid
    })
    this.videoContext = wx.createVideoContext(vid)
    //判断当前视频是否有播放记录
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }else{
      this.videoContext.play()
    }
  },
  //监听视频播放进度的回调
  handleTimeUpdata(event){
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束的回调
  handleEnded(event){
    //移除播放记录时长数组中当前的视频对象
    let {videoUpdateTime} = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id),1)
    this.setData({
      videoUpdateTime
    })
  },
  //下拉刷新的回调
  handleRefresher(event){
    //获取最新的视频列表数据
    this.getVideoList(this.data.navId)
  },
  //触底的回调
  async handleToLower(){
    let index = Math.floor(Math.random()*10)
    let {navId,videoList} = this.data
    this.getNewVideoList(navId,index)
  },
  //获取最新数据的回调
  async getNewVideoList(navId,offset = 0){
    let videoListData = await request('/video/group',{id:navId,offset})
    wx.hideLoading()
    let index = this.data.videoList.length
    console.log(index);
    let vList = videoListData.datas.map(item=>{
      item.id = index++;
      return item
    })
    let list = await Promise.all(vList.map(async item =>{
      item.data.urlInfo = {
        url:await this.setVideoUrl(item.data.vid)
      }
      return item
    }))
    let {videoList} = this.data
    videoList.push(...list)
    this.setData({
      videoList
    })
  },
  //
  //切换的回调
  changeNav(event){
    let navId = event.currentTarget.id
    this.setData({
      navId:navId>>>0,
      videoList:[]
    })
    //显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    //动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
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