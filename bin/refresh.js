const sqlite3 = require('sqlite3');
const yaml = require("js-yaml");
const fs = require("fs");
var db = new sqlite3.Database('data.db');
var list = new Object;

db.allSQL = (sql)=>{
    return new Promise((resolve)=>{
        db.all(sql, (err,res)=>{
            resolve(res)
        })
    })
};

db.runSQL = (sql)=>{
    return new Promise((resolve)=>{
        db.run(sql, (err)=>{
            resolve(err)
        })
    })
};

for (let element of yaml.load(fs.readFileSync("config.yaml",{encoding:"utf8"})).repository) {
    for (let e of element.list) {        
        let attach = {}; 
        if(element.header){
            element.header.forEach(t=>{
                attach[t] = null
            }); 
        }  
        list[e.ItemID]={
            ItemID: e.ItemID,
            Item: e.Item,
            Tab: element.tab,
            Description: ((e.Description)?("'"+e.Description+"'"):('NULL')),
            UserName: 'NULL',
            UserID: 'NULL',
            Attach: JSON.stringify(attach),
            Rented: '1970-01-01 00:00:00',
            Expired: '1970-01-01 00:00:00'
        }
    }
}

(async()=>{
    await db.runSQL("DROP TABLE Item");
    await db.runSQL("CREATE TABLE Item( "+
        "ItemID      INT PRIMARY KEY NOT NULL," +
        "Item        TEXT            NOT NULL," +
        "Tab         TEXT            NOT NULL," +
        "Description TEXT ," +
        "UserName    TEXT ," +
        "UserID      TEXT ," +
        "Attach      TEXT ," +
        "Rented      TEXT ," +
        "Expired     TEXT " +
        " )");
    let history = await db.allSQL("SELECT * FROM History");

    for (let e of history) {
        if(new Date(e.Expired) > new Date(list[e.ItemID].Expired)){
            list[e.ItemID].UserName = e.UserName;
            list[e.ItemID].UserID = e.UserID;
            list[e.ItemID].Attach = e.Attach;
            list[e.ItemID].Rented = e.Rented;
            list[e.ItemID].Expired = e.Expired;
        }
    }

    for (let key in list) {
        if (list.hasOwnProperty(key)) {    
            await db.run(
                "INSERT INTO Item (ItemID, Item, Tab, Description, UserName, UserID, Attach, Rented, Expired) "+
                "VALUES (" + list[key].ItemID + ", '" + list[key].Item + "', '" + list[key].Tab + "', " + list[key].Description + ", '" + list[key].UserName + "', '" + list[key].UserID + "', '" + list[key].Attach + "', '" + list[key].Rented + "', '" + list[key].Expired + "' )"
            );           
        }
    }

    db.close();
    console.log("\x1b[32mTables has been refreshed!\x1B[0m")
})();

