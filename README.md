# 中科大SOFC实验室高温炉预约系统
![Node.JS](https://img.shields.io/badge/node.js-≥8.2.0-brightgreen)   
基于 NodeJS + Express + Gulp + SQLite 的实验室设备预约系统，前端部分使用MDUI框架实现。

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
### 启动
```bash
npm start
```
此时日志会输出到根目录下的access.log文件
### DEBUG模式启动
```bash
npm run debug
```
此模式下会输出Express的debug信息
### 设置管理员权限
```bash
npm run admin <UserID1> <UserID2> <UserID3>...
```
将已注册的指定账户设为管理员，仅管理员可对历史记录进行删除
### 重建数据库
执行后会删除数据库中已有的`Item`与`History`表，并重新读取`config.yaml`文件中的配置进行建立
相当于在保留用户数据的情况下进行初始化
```bash
npm run rebuild
```
>当然，直接删除数据库文件也可以达到目的，但是这样会同时丢失已注册的账户信息
### 刷新数据库
执行后会根据`config.yaml`文件与`History`表中的记录重建`Item`表，用于解决某些情况下`Item`与`History`表记录冲突的问题，也可用于修改或删除`config.yaml`文件中设备信息后对数据库进行刷新(新增设备无需刷新)
```
npm run refresh
```
### 更新数据库
用于将0.1.0版本的数据库文件更新为0.2.0的格式
```
npm run updateDB
```
>除数据库外，也请手动修改`config.yaml`文件的更改项

# 目录结构

```yml
|-- master
    |-- config.yaml                 #配置文件，包含设备信息，公告内容等
    |-- data.db                     #数据库文件，运行后自动生成
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- sessions                    #session储存文件，自动生成
    |-- bin
    |   |-- admin.js                #设置管理员
    |   |-- refresh.js              #刷新数据库
    |   |-- updateDB.js             #更新数据库
    |   |-- www                     #默认入口文件
    |
    |-- lib                         #后端文件夹
    |   |-- app.js                  #主文件
    |   |-- router.js               #路由相关
    |   |-- SQLiteOp.js             #数据库操作相关
    |
    |-- log                         #运行日志
    |   |-- ...
    |
    |-- public                      
    |   |-- ...
    |
    |-- src                         #前端源文件夹
    |   |-- js
    |   |   |-- dependencies        #依赖   
    |   |   |-- partial             #自定义js
    |   |
    |   |-- styl                    #自定义样式  
    |       |-- ...
    |
    |-- views
        |-- after.ejs
        |-- before.ejs
        |-- error.ejs
        |-- index.ejs               #首页
        |-- login.ejs               #登录页
```

# 开源许可证
[GPL-3.0 License](https://github.com/kb1000fx/Reservation-Server-for-SOFC-Lab/blob/master/LICENSE)
