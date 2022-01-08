import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

sqlite3.verbose()

export default class DB {  
    private static instance:DB;
    private db:Database<sqlite3.Database, sqlite3.Statement>|undefined 
    private constructor() {}
    public static async getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
            DB.instance.db = await open({
                filename: `${__dirname}/database.db`,
                driver: sqlite3.Database,
            })
        }
        return DB.instance.db;
    }
}