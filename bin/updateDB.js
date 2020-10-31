const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('data.db');

function allSQL(sql){
    return new Promise((resolve)=>{
        db.all(sql, (err,res)=>{
            resolve(res)
        })
    })
};

function runSQL(sql){
    return new Promise((resolve)=>{
        db.run(sql, (err)=>{
            resolve(err)
        })
    })
};

(async()=>{
    await runSQL("ALTER TABLE Item RENAME TO oldItem");
    await runSQL("ALTER TABLE History RENAME TO oldHistory");
    await runSQL("CREATE TABLE Item AS SELECT ItemID, Item, Description, UserName, UserID, Rented, Expired FROM oldItem");
    await runSQL("CREATE TABLE History AS SELECT Time, ItemID, UserName, UserID, Rented, Expired FROM oldHistory");
    await runSQL("ALTER TABLE Item ADD COLUMN Tab TEXT");
    await runSQL("ALTER TABLE Item ADD COLUMN Attach TEXT");
    await runSQL("ALTER TABLE History ADD COLUMN Attach TEXT");
    var itemList = await allSQL("SELECT ItemID, Material, Temperature FROM oldItem");
    var historyList = await allSQL("SELECT Time, ItemID, Material, Temperature FROM oldHistory");
    await runSQL("DROP TABLE oldItem");
    await runSQL("DROP TABLE oldHistory");

    
    for (let e of itemList) {
        let attach = {
            材料: e.Material,
            温度: e.Temperature
        };
        await runSQL("UPDATE Item SET Tab = '高温炉', Attach = '" + JSON.stringify(attach) + "' WHERE ItemID=" + e.ItemID);
    }
    
    for (let e of historyList) {
        let attach = {
            材料: e.Material,
            温度: e.Temperature
        };
        await runSQL("UPDATE History SET Attach = '" + JSON.stringify(attach) + "' WHERE Time='" + e.Time + "'");
    }   

    console.log("DB has been Updated!")
    db.close();
})();
