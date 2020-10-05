# 中科大SOFC实验室高温炉预约系统
![Node.JS](https://img.shields.io/badge/node.js-≥8.2.0-brightgreen)   
基于 NodeJS + Express + SQLite 的实验室设备预约系统，前端部分使用MDUI框架实现。

# 使用方法
## 运行环境
+ Node JS (≥8.2.0)
+ 由于使用SQLite作为数据库，所以不需要额外的环境配置
## 安装依赖
```bash
cd ~
npm install
```
## 修改配置信息
修改根目录下`config.yaml`文件，根据注释进行添加相关内容
## 运行
### 生产模式启动
```bash
npm start
```
此时日志会输出到根目录下的access.log文件
### 开发模式启动
```bash
npm run dev
```
此模式下会输出debug信息，同时日志输出到控制台，不会写入文件
### 设置管理员权限
```bash
npm run admin <UserID1> <UserID2> <UserID3>...
```
将已注册的指定账户设为管理员，仅管理员可对历史记录进行删除
### 刷新数据库
当修改完`config.yaml`文件中的配置项后，可使用下面命令来删除数据库中已有的`Item`与`History`表，并重新读取`config.yaml`文件中的配置进行建立
```bash
npm run refresh
```
当然，直接删除数据库文件也可以达到目的，但是这样会同时丢失已注册的账户信息

# 目录结构

```yml
|-- master
    |-- access.log                  #运行日志，自动生成
    |-- app.js                      #主文件
    |-- config.yaml                 #配置文件，包含设备信息，公告内容等
    |-- data.db                     #数据库文件，运行后自动生成
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- router.js                   #路由相关
    |-- sessions                    #session储存文件，自动生成
    |-- SQLiteOp.js                 #数据库操作相关
    |-- bin
    |   |-- admin.js                #设置管理员
    |   |-- www                     #默认入口文件
    |-- public
    |   |-- css
    |   |   |-- mdui.min.css        
    |   |   |-- style.styl          #自定义样式
    |   |-- fonts                   #字体文件夹
    |   |   |-- roboto
    |   |       |-- ...
    |   |
    |   |-- icons                   #图标文件夹
    |   |   |-- material-icons
    |   |       |-- ...
    |   | 
    |   |-- js
    |   |   |-- core.js             
    |   |   |-- main.js             #自定义js脚本
    |   |   |-- mdui.min.js
    |   |   |-- sha256.js
    |   |-- laydate                 #datepicker文件夹
    |       |-- ...
    |   | 
    |-- views
        |-- after.ejs
        |-- before.ejs
        |-- error.ejs
        |-- index.ejs               #首页
        |-- login.ejs               #登录页
```

# 开源许可证
[GPL-3.0 License](https://github.com/kb1000fx/Reservation-Server-for-SOFC-Lab/blob/master/LICENSE)
