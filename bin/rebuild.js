const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('data.db');

db.serialize(function() {
    db.run("DROP TABLE Item");
    db.run("DROP TABLE History")
});

db.close();
console.log("\x1b[32mTables has been rebuilded!\x1B[0m")