import {DatabaseAdapter} from "../../Adapter/DatabaseAdapter";

const database = new DatabaseAdapter('./database.sqlite');
database.run('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT, created_at TEXT)');

export const isSended = async (image: string): Promise<boolean> => {
    return (await database.get('SELECT COUNT(*) as count FROM images WHERE image = ?', [image])).count > 0;
}

export const save = (image: string) => {
    database.run('INSERT INTO images (image, created_at) VALUES (?, ?)', [image, (new Date()).toISOString()]);
}
