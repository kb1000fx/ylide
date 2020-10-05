const sqlite3 = require('sqlite3');
const tableList = {
    Item :
        "ItemID      INT PRIMARY KEY NOT NULL," +
        "Item        TEXT            NOT NULL," +
        "Description TEXT ," +
        "UserName    TEXT ," +
        "UserID      TEXT ," +
        "Material    TEXT ," +
        "Temperature TEXT ," +
        "Rented      TEXT ," +
        "Expired     TEXT " ,
    History:
        "Time        TEXT  PRIMARY KEY  NOT NULL," +
        "ItemID      INT  NOT NULL," +
        "UserName    TEXT ," +
        "UserID      TEXT ," +
        "Material    TEXT ," +
        "Temperature TEXT ," +
        "Rented      TEXT ," +
        "Expired     TEXT " ,
    Account:
        "UserID     TEXT PRIMARY KEY NOT NULL ," +
        "UserName   TEXT             NOT NULL ," +
        "IsAdmin    INT              NOT NULL ," +
        "PassWord   TEXT             NOT NULL ",
};
var Op ={ };


Op.dbList = [ ];
Op.itemList = [ ];

Op.connectDB = function(dbFileName){
    try {
        if(dbFileName) {
            var length = Op.dbList.push({
                name: dbFileName ,
                db: new sqlite3.Database(dbFileName, (err) => {
                    if (err) {
                        throw err;
                    } else { 
                        console.log('\x1b[32mDatabase \x1B[36m' + dbFileName + '\x1b[32m has been connected.\x1B[0m');
                        initDB(length-1);
                    }
                })
            });
            return length-1
        } else {
            throw new Error("Database name expected!");
        }
    } catch (error) {
        console.error('\x1B[31mError: \x1B[35m' + error + '\x1B[0m')
        process.exit()
    }
};

Op.getItemHistory = function(db, id){
    return allSQL(db, "SELECT * FROM History WHERE ItemID = " + id)
};

Op.selectAllByItemID = function(db, id){
    return getSQL(db, "SELECT * FROM Item WHERE ItemID = " + id)
};

Op.getNameByID = function(db, id){
    return getSQL(db, "SELECT UserName, IsAdmin FROM Account WHERE UserID = '" + id + "'").then((resolve)=>{
        return {
            UserName: resolve.UserName,
            IsAdmin:  resolve.IsAdmin, 
        }   
    });
};

Op.isExist = function(db, id){
    return getSQL(db, "SELECT UserName FROM Account WHERE UserID = '" + id + "'").then((resolve)=>{
        return (resolve != undefined)
    });
};

Op.isIdle = function(db, id){  
    return getSQL(db, "SELECT Expired FROM Item WHERE ItemID = " + id).then((resolve)=>{
        var expiredTime = new Date(resolve.Expired)
        var nowTime = new Date()
        if (resolve.Expired == "无") {
            return true
        } else if (expiredTime > nowTime) {
            return false
        } else {
            return true
        }
    });
};

Op.UpdateData = async function(db, obj){
    await runSQL(db, 
        "UPDATE Item SET UserName = '" + obj.UserName + "', UserID = '" + obj.UserID + 
        "', Material = '" + obj.Material + "', Temperature = '" + obj.Temperature + 
        "', Rented = '" + obj.Rented + "', Expired = '" + obj.Expired + "' WHERE ItemID = " + obj.ItemID); 
    
    await runSQL(db,
        "INSERT INTO History (ItemID, UserID, UserName, Material, Temperature, Rented, Expired, Time) "+
        "VALUES ( " + obj.ItemID + ", '" +  obj.UserID + "', '" + obj.UserName + "', '" + obj.Material + "', '" + obj.Temperature + "', '" + obj.Rented + "', '" + obj.Expired + "', '" + new Date().toLocaleString() + "' )"
    );
        
    return true
};

Op.deleteHistory = function(db, history){
    return runSQL(db, "DELETE FROM History WHERE Time = '" + String(history).replace(',', "' OR Time = '") + "' ")
};

Op.refreshItem = async function(db){
    for (let obj of Op.itemList) {
        let UserName, UserID, Material, Temperature, Rented, Expired, resolve;
        resolve = await getSQL(db, "SELECT * FROM History WHERE ItemID = " + obj.ItemID + " ORDER BY Time DESC");

        if (resolve!=undefined) {
            UserName = resolve.UserName;
            UserID = resolve.UserID;
            Material = resolve.Material;
            Temperature = resolve.Temperature;
            Rented = resolve.Rented;
            Expired = resolve.Expired;
        } else {
            UserName = '无';
            UserID = '无';
            Material = '无';
            Temperature = '无';
            Rented = '1970-01-01 00:00:00';
            Expired = '1970-01-01 00:00:01';
        }

        await runSQL(db, 
            "UPDATE Item SET UserName = '" + UserName + "', UserID = '" + UserID + 
            "', Material = '" + Material + "', Temperature = '" + Temperature + 
            "', Rented = '" + Rented + "', Expired = '" + Expired + "' WHERE ItemID = " + obj.ItemID
        )
       
    }

    return true
};

Op.addAccount = function(db, obj){
    var id = obj.id;
    var name = obj.name;
    var pwd = obj.pwd;

    runSQL(db, 
        "INSERT INTO Account (UserID, UserName, IsAdmin, PassWord) " +
        "VALUES ( '" + id + "', '" + name + "', 0, '" + pwd + "' )"
    ).then((resolve)=>{
        console.log('\x1b[36mAccount \x1B[32m' + name + ' (' + id + ')\x1b[36m has been added.\x1B[0m');
    });
};

Op.loginAuth = function(db, obj){
    var id = String(obj.id);
    var pwd = String(obj.pwd);

    return getSQL(db, "SELECT PassWord FROM Account WHERE UserID = '" + id + "'").then((resolve)=>{
        if (resolve==undefined) {
            return {isAccountExist:false}
        } else if (pwd==resolve.PassWord) {
            return {isAccountExist:true, isPWDCorrect:true}
        } else {
            return {isAccountExist:true, isPWDCorrect:false}
        }
    });
};

function runSQL(index, sql){
    return new Promise((resolve)=>{
        Op.dbList[index].db.run(sql, (err)=>{
            resolve(err)
        })
    })
};

function allSQL(index, sql){
    return new Promise((resolve)=>{
        Op.dbList[index].db.all(sql, (err,res)=>{
            resolve(res)
        })
    })
};

function getSQL(index, sql){
    return new Promise((resolve)=>{
        Op.dbList[index].db.get(sql, (err,res)=>{
            resolve(res)
        })
    })
};

async function initDB(db){
    for (let table in tableList) {
        await runSQL(db, "CREATE TABLE IF NOT EXISTS  '" + table    + "'  (" + tableList[table]    + ") ");
        console.log('\x1b[32mTable\x1b[36m ' + table + ' \x1b[32mhas been created.\x1B[0m')
    }

    try {
        if(Op.itemList.length) {
            for (let e of Op.itemList) {
                var Description;
                if(e.Description){
                    var Description = "'" + e.Description + "'"
                }else{
                    var Description = 'NULL'
                }
                
                await runSQL(db, 
                    "INSERT INTO Item (ItemID, Item, Description, UserName, UserID, Material, Temperature, Rented, Expired) " +
                    "VALUES (" + e.ItemID + ", '" + e.Item + "', " + Description + ", '无', '无', '无', '无', '1970-01-01 00:00:00', '1970-01-01 00:00:01' )"
                );
            }
            console.log('\x1b[32mTables has been inited\x1B[0m');
        } else {
            throw new Error("Item list empty! Please check config.yaml");
        }
    } catch (error) {
        console.error('\x1B[31mError: \x1B[35m' + error + '\x1B[0m')
        process.exit()
    }
}




process.on('SIGINT', function () {
    Op.dbList.forEach((e)=>{
      e.db.close();
      console.log('\x1b[32mDatabase \x1B[36m' + e.name + '\x1b[32m has been closed.\x1B[0m')
    });
    process.exit();
});


module.exports = function(config){
    Op.itemList = config;
    return Op
};