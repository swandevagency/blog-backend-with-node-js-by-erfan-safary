import { Db, MongoClient } from 'mongodb';

class DB {
    readonly uri: string = "mongodb://127.0.0.1:27017";

    private static instance: DB;
    
    private client: MongoClient;

    private constructor() {
        this.client = new MongoClient(this.uri);
    }
    
    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }

        return DB.instance;
    }

    public getDB(): Db {
        return this.client.db("blog");
    }

    public getClient(): MongoClient {
        return this.client;
    }

    public close() {
        this.client.close()
    }
}

export default DB;