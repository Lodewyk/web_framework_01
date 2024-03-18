import { ApiSync } from "./ApiSync";
import { Attributes } from "./Attributes";
import { Collection } from "./Collection";
import { Eventing } from "./Eventing";
import { Model } from "./Model";

export interface UserProps {
    id?: number; // ? indicates an option interface property
    name?: string;
    age?: number;
}

const url = 'http://localhost:3000/users';

export class User extends Model<UserProps> {
    static buildUser(attrs: UserProps): User {
        /*
         * User has no construct, but it extends Model, which requires some params to be passed through
         * to it's constructor. These params need to be compatible with the interfaces specified in the Model
         * class.
         */
        return new User(
            new Attributes<UserProps>(attrs),
            new Eventing(),
            new ApiSync<UserProps>(url)
        );
    }

    /**
     * Getting a bit whacky here but essentially this is going to init a collection of user objects
     * by init'ing a collection and calling the buildUser method defined in this class to init each
     * User object in the collection
     */
    static buildUserCollection(): Collection<User, UserProps> {
        return new Collection<User, UserProps>(
            url, (json: UserProps) => User.buildUser(json)
        )
    }

    setRandomAge(): void {
        const age = Math.round(Math.random() * 100);
        this.set({ age });
    }
}