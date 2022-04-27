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
            this.db.run(sql, params, function (err: any) {
                if (err) {
                    console.error(`Error running sql ${sql}`, err);
                    reject(err);
                } else {
                    resolve({id: this.lastID});
                }
            });
        });
    }

    get(sql: string, params: any[] = []): Promise<{[key: string]: string|number}> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.error(`Error running sql ${sql}`, err);
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}