import { UserProps } from "./User";


export class Attributes<DataObjProps extends object> {
    constructor(private data: DataObjProps) {}

    /*
     * <Key extends keyof DataObjProps>
     * typeof Key can only ever be one of the keys of DataObjectProps, so whatever argument we get in HAS TO BE a key on DataObjProps
     * 
     * (key: Key)
     * -in the case of User.ts- DataOjbProps will be a UserProps object, which will only ever have an id, name and/or age, in other words
     * when this is being called from a User.ts context, "key" can only ever be "id", "name" or "age"
     * 
     * DataObjProps[Key]
     * -in the case of User.ts- indicates that the return type will always be the return type referenced by the key specified by "Key"
     * in other words if key == "name", typescript will look up UserProps (because that's what we're passing in when accessing Attributes.ts) 
     * and see that "name" is always type string. 
     * This tells the get() method that if the key parameter is "name", the return type will be a string
     * 
     * This has been made into an arrow function to ensure the right context is always used for "this". e.g. in the case of Instantiating a "User"
     * class and calling user.get('some key'), when we go through the User's get passthrough method ("get get() { return this.attributes.get }"),
     * if we didn't have an arrow function here we'd get the error "Uncaught TypeError: Cannot read properties of undefined (reading 'some key')"
     * It's best practice in ES6 to use arrow functions all the time, regardless of the minor performance hit
     */
    get = <Key extends keyof DataObjProps>(key: Key): DataObjProps[Key] => {
        return this.data[key];
    }

    set(update: DataObjProps): void {
        Object.assign(this.data, update);
    }
}