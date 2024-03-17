import { UserProps } from "./User";


export class Attributes<DataObjProps extends object> {
    constructor(private data: DataObjProps) {}

    
    get = <Key extends keyof DataObjProps>(key: Key): DataObjProps[Key] => {
        return this.data[key];
    }

    set(update: DataObjProps): void {
        Object.assign(this.data, update);
    }

    getAll(): DataObjProps {
        return this.data;
    }
}