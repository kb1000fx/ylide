const sqlite3 = require('sqlite3');

if (process.argv.length>2) {
    var arg = process.argv.slice(2);
    var db = new sqlite3.Database('data.db');
    db.run("UPDATE Account SET IsAdmin = 1 WHERE UserID = '" + String(arg).replace(',', "' OR UserID = '") + "'", ()=>{
        console.log("\x1b[32mUser \x1B[36m" + arg + " \x1b[32mset to administrator!\x1B[0m")
        db.close();
    });
} else {
    console.log('\x1B[35mUseage:\x1B[36m npm run admin \x1B[35m<UserID1> <UserID2>... \x1B[0m')
}