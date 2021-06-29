## 项目介绍

**本项目基于Leadshop开源项目进行二次开发，本项目是后台管理系统(前后端分离)的前端VUE源码，感谢Leadshop 开源系统!  感谢企码星球!** 

## 安装运行调试
1. `git clone `
2. 安装依赖`npm install `
3. 运行调试`npm run serve` 
4. 打包发布  `npm run build`

## 运行环境

Linux+Nginx+PHP7.4+MySQL5.7.3以上

## 常见问题/安装教程
<a href="https://forum.leadshop.vip/thread/35" target="_blank"> **查看常见问题/安装教程** </a>

## 论坛交流
* <a href="https://forum.leadshop.vip" target="_blank"> **点击进入Leadshop官方论坛** </a>

* 操作文档：<a href="https://help.leadshop.vip" target="_blank"> **help.leadshop.vip** </a>

## 开源无加密
* 基于Apache License 2.0开源协议，前后端代码开源无加密，支持二次开发，支持商用。

## 核心技术
* 前端技术栈 ES6、vue、vuex、vue-router、vue-cli、axios、element-ui、uni-app

* 后端技术栈 Yii2、Jwt、Mysql、Easy-SMS

## 接口标准
* 采用标准RESTful API ，高效的API阅读性，具有扩展性强、结构清晰的特点

## 数据交互
* 采用JSON API 标准，用以定义客户端如何获取与修改资源，以及服务器如何响应对应请求。高效实现的同时，无需牺牲可读性、灵活性和可发现性

## 认证方式
* 目前所有的接口使用 Oauth2 Password 方式，也就是 JWT Authorization Bearer header 进认证。支持扩语言扩展，多平台扩展。

## 数据表格导出
* 采用高性能的 js-xlsx数据导出，易于扩展，兼容性强。

* 接口文档：<a href="http://www.leadshop.vip/api.html" target="_blank"> **www.leadshop.vip/api.html** </a>

### 一键安装
1.上传你的代码

2.项目目录设置755权限

3.设置代码执行目录为/web

注:如果使用Apache环境 需要在.htaccess 中添加
```
 SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
```
否则会导致OAuth登录模式获取不到Authorization

4.检查php禁用函数列表,symlink函数不能被禁用，否则后台页面无法访问。

5.在浏览器中输入你的域名或IP

( 例如：www.yourdomain.com)，安装程序会自动执行安装。期间系统会提醒你输入数据库信息以完成安装。

6.后台访问地址：
域名/index.php?r=admin

7.公众号首页访问地址：
域名/index.php?r=wechat

### 重新安装
1. 清除数据库
2. 删除/server/install.lock 文件

## 目录说明
```
 站点根目录
    ├─api                               //后台接口
    ├─app                               //客户端（微信小程序，公众号）
    ├─applet                            //打包后的微信小程序源码包
    ├─components                        //通用组件
    ├─config                            //配置文件目录
    ├─controllers                       //控制器
    ├─datamodel                         //模型
    ├─forms                             
    │  └─install
    ├─modules                           //模块     
    ├─stores                            //应用配置文件
    ├─system                            //系统核心目录
    │  ├─common
    │  ├─config
    │  ├─phpqrcode
    │  └─wechat
    ├─vendor                            //依赖
    ├─views
    │  ├─admin                          //后台编译包目录，其中index.php不可删除
    │  ├─wechat                         //公众号编译包目录，其中index.php不可删除
    │  └─site
    └─web
        ├─assets
        ├─static                        //静态文件
        ├─img                           //H5端图片目录
        ├─temp
        └─upload                        //上传文件
```

## 使用须知

1.允许用于个人学习、毕业设计、教学案例、公益事业;

2.支持企业/个人免费商业使用，但必须保留leadshop版权信息;

## 版权信息

Powered By Leadshop © 2021