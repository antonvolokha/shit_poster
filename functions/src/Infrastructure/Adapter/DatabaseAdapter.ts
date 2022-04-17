import {Database} from "sqlite3";

export class DatabaseAdapter {
    private db: Database;

    constructor(dbFilePath: string) {
        this.db = new Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        })
    }
    
    public run(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve({ id: this.lastID })
                }
            });
        });
    }
}