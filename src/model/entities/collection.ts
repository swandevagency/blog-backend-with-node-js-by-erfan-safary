
interface Col<T> {
    findAll(): Promise<Array<T>>;
    findOne(id: any): Promise<T>;
    addOne(n: T): Promise<any>;
    updateOne(id: any, newOne: T): Promise<any>;
    deleteOne(id: any): Promise<any>;
}

export default Col;