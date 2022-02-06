import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from "path"

sqlite3.verbose()

export default class DB {  
    private static instance:DB;
    private db:Database<sqlite3.Database, sqlite3.Statement>|undefined 
    private constructor() {}
    public static async getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
            DB.instance.db = await open({
                filename: path.resolve(__dirname, "../database.db"),
                driver: sqlite3.Database,
            })
        }
        return DB.instance.db;
    }
    public static async close() {
        await DB.instance.db?.close()
    }
}