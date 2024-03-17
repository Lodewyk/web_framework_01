import { AxiosPromise, AxiosResponse } from "axios";
import { Collection } from "./Collection";


// type alias/annotation for "on" method callback, indicating a method that returns nothing (`() => {}` would indicate a method that returns an object)
type Callback = () => void;

interface ModelAttributes<ObjectWithProperties extends object> {
    set(update: ObjectWithProperties): void;
    getAll(): ObjectWithProperties;
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
    get<PropertyKey extends keyof ObjectWithProperties>(key: PropertyKey): ObjectWithProperties[PropertyKey];
}

interface Sync<ObjectWithProperties> {
    fetch(id: number): AxiosPromise;
    save(data: ObjectWithProperties): AxiosPromise;
}

interface Events {
    on(eventName: string, callback: Callback): void;
    trigger(eventName: string): void;
}

// ensures that an object always has an id property, so that it can be saved in the database
interface HasId {
    id?: number
}

export class Model<ObjectWithProperties extends HasId> {
    constructor(
        private attributes: ModelAttributes<ObjectWithProperties>,
        private events: Events,
        private sync: Sync<ObjectWithProperties>//,
        //private collection: Collection<ObjectWithProperties
    ) {

    }

    /*
     * This getter returns the on() function inside Eventing (defined as "events" in this class) 
     */
    get on() {
        return this.events.on;
    }
    /*
     * These are the same as above, but a shorted version of the passthrough method
     * IMPORTANT:
     * these shortened passthrough methods can ONLY BE USED if the object the passthrough is called on
     * (e.g. `get` passthrough is called on the this.attributes` object)
     * is passed into the constructor. If the object is being init'd inside the constructor, this will 
     * not work, because typescript compiles it into javascript in the wrong order.
     * i.e. if the constructor was something like:
     * constructor() {
     *      this.events = new Events();
     * }
     * then the passthrough wouldn't work because the generated JS would look something like this:
     * var Model = (function () {
     *      function Model() {
     *          this.trigger = this.events.trigger;
     *          this.events = new Events()
     *      }
     * }())
     * meaning that the trigger method is being called on this.events before it ever gets init'd
     */
    get = this.attributes.get;
    trigger = this.events.trigger;

    set(update: ObjectWithProperties): void {
        this.attributes.set(update);
        this.events.trigger('change');
    }

    fetch(): void {
        const id = this.attributes.get('id');

        if (typeof id !== 'number') {
            throw new Error('Cannot fetch without an id');
        }

        this.sync.fetch(id).then(
            (response: AxiosResponse): void => {
                /*
                 * Call the set method inside this class so that we also have the change trigger firing,
                 * rather than calling this.attributes.set()
                 */
                this.set(response.data);
            }
        );
    }

    save(): void {
        this.sync.save(this.attributes.getAll()).then(
            (response: AxiosResponse): void => {
                this.trigger('save');
            }
        )
        .catch(() => {
            this.trigger('error');
        });
    }
}