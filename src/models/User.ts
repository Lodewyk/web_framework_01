
import { Attributes } from "./Attributes";
import { Eventing } from "./Eventing";
import { Sync } from "./Sync";

export interface UserProps {
    id?: number; // ? indicates an option interface property
    name?: string;
    age?: number;
}

const url = 'http://localhost:3000/users';

export class User {
    public events: Eventing = new Eventing();
    public sync: Sync<UserProps> = new Sync<UserProps>(url);
    public attributes: Attributes<UserProps>;

    constructor(attrs: UserProps) {
        this.attributes = new Attributes<UserProps>(attrs);
    }
    
    get get() {
        return this.attributes.get;
    }

    set() {}

    /*
     * This getter returns the on() function inside Eventing (defined as "events" in this class) 
     */
    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }

    fetch() {}
    save() {}
}