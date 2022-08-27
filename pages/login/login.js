/* 
登录流程
1.收集表单数据
2.前端验证
  1）验证用户信息是否合法
  2）前端验证不通过就提示用户，不需要发请求给后端
  3）前端验证通过了，发请求（携带账号，密码）给服务器
3.后端验证
  1）验证用户是否存在
  2）用户不存在直接返回，告诉前端用户不存在
  3）用户存在需要验证密码是否正确
  4）密码不正确返回前端提示密码不正确
  5）密码正确返回给前端数据，提示用户登录成功
*/
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'', //手机号
    password:'' //用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
  //登录的回调
  async login(){
    let {phone,password} = this.data
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return;
    }
    //定义正则表达式
    let phoneReg = /^1[3-9]\d{9}/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '格式不正确',
        icon:'error'
      })
      return;
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return;
    }
    //开始后端验证
    let result = await request('/login/cellphone',{phone,password,isLogin:true},'POST')
    if(result.code === 200){
      wx.showToast({
        title: '登陆成功',
      })
      //将用户的信息存储在本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号错误',
        icon:'error'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon:'error'
      })
    }else{
      wx.showToast({
        title: '登录失败',
        icon:'error'
      })
    }
  },
  handler(){

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