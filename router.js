const express = require('express');
const router = express.Router();
const yaml = require("js-yaml");    
const fs = require("fs");
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const config = yaml.load(fs.readFileSync("config.yaml",{encoding:"utf8"}));
var SQLiteOp = require('./SQLiteOp')(config.repository);
var db;


// 用户登录
router.post('/api/login', function(req, res){
    SQLiteOp.loginAuth(db, req.body).then((resolve)=>{
        if (!resolve.isAccountExist) {
            res.send({isAccountExist: false});
        } else if (resolve.isPWDCorrect) {
            if (!eval(req.body.isRemember)) {
                req.session.cookie.expires = false;
            }
            req.session.userID = req.body.id; 
            SQLiteOp.getNameByID(db, req.body.id).then((resolve)=>{
                req.session.userName = resolve.UserName;
                req.session.isAdmin = resolve.IsAdmin;
                res.send({isAccountExist: true, isLogin: true});
            });       
        } else {
            res.send({isAccountExist: true, isLogin: false});
        }
    })
});

// 用户注册
router.post('/api/signup', function(req, res){ 
    if (config.enableSignUp) {
        SQLiteOp.isExist(db, req.body.id).then((resolve)=>{
            if(resolve){
                res.send({
                    enableSignUp:   true,
                    isNameExist:    true,
                });
            }else{
                SQLiteOp.addAccount(db, req.body);
                res.send({
                    enableSignUp:   true,
                    isNameExist:    false,
                });
            }
        });
    } else {
        res.send({
            enableSignUp:   false,
        });    
    }
});

//提交更改
router.post('/api/submit', function(req, res){ 
    SQLiteOp.isIdle(db, req.body.ItemID).then((resolve)=>{
        if (resolve) {
            var obj = req.body;
            obj.UserID = req.session.userID;
            obj.UserName = req.session.userName;
            return SQLiteOp.UpdateData(db, obj)
        } else {
            return false
        }
    }).then((resolve)=>{
        res.send({success: resolve});
    });
});

//删除记录
router.post('/api/delete', function(req, res){ 
    if (req.session.isAdmin) {
        SQLiteOp.deleteHistory(db, req.body.history).then((resolve)=>{
            return SQLiteOp.refreshItem(db)
        }).then((resolve)=>{
            res.send({isAdmin: true})
        });
    } else {
        res.send({isAdmin: false})
    }
});
  
//获取公告
router.get('/api/announcement', function (req, res) {
    res.send({
        autoShow:   config.announcement.autoShow,
        content:    config.announcement.content,
    });
});

//获取设备列表
router.get('/api/itemList', function (req, res) {
    var itemList = [];
    (async ()=>{
        for (let obj of config.repository) {
            let itemInfo = await SQLiteOp.selectAllByItemID(db, obj.ItemID)
            itemList.push(itemInfo);
        }   
        res.send(itemList); 
    })();  
});

//获取历史记录
router.get('/api/history', function (req, res) {
    var id = req.query.id;
    SQLiteOp.getItemHistory(db, id).then((resolve)=>{
        res.send({history: resolve});
    });
});

// 获取主页
router.get('/', function (req, res) {
    if(req.session.userID){  
        SQLiteOp.getNameByID(db, req.session.userID).then((resolve)=>{
            res.render('index', {
                id: req.session.userID,
                username: resolve.UserName,
                icon:  (resolve.IsAdmin)?"star":"person",
                delButton:  (resolve.IsAdmin)?"":"disabled",
            });
        });
    }else{
        res.redirect('login');
    }
})

// 获取登录页面
router.get('/login', function(req, res){
    if(req.session.userID){  
      res.redirect('/');
    }else{
      res.render('login');
    }
});

// 退出
router.get('/logout', function (req, res) {
    req.session.destroy(function(err){});   
    res.redirect('login');
});


module.exports = function(app){
    db = SQLiteOp.connectDB('data.db');
    app.use(session({
        secret :  'mu gen dai na yu me no a to no',
        resave : true,
        saveUninitialized: false, 
        cookie : {
        maxAge : 7 * 24 * 60 * 60 * 1000, 
        },
        store: new SQLiteStore(),
    }));
    
    return router
};
