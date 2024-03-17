import axios, { AxiosResponse } from "axios";
import { Eventing } from "./Eventing";

/**
 * ModelProperties specifies the propertie of a single model inside the CollectionType collection
 * e.g. in an array of User models, each item will have the properties specified by the UserProps
 * interface exported from User.ts
 */
export class Collection<CollectionType, ModelProperties> {
    models: CollectionType[] = [];
    events: Eventing = new Eventing();

    constructor(
        public url: string,
        /**
         * This specifies that the deserialized param is a method that will accept a json object in the
         * structure of ModelProperties and return an instance of CollectionType (e.g. if CollectionType is
         * User then json object being sent as a param to deserialize would be UserProps)
         * 
         * Not super comfortable with this syntax, to be honest.
         */
        public deserialize: (json: ModelProperties) => CollectionType
    ) {}

    get on() {
        return this.events.on
    }

    get trigger() {
        return this.events.trigger;
    }

    fetch(): void {
        axios.get(this.url)
        .then(
            (response: AxiosResponse) => {
                
                response.data.forEach((item: ModelProperties) => {
                    const hydratedObject = this.deserialize(item); // deserialize example: buildUser method in User.ts
                    this.models.push(hydratedObject);
                });

                this.trigger('change');
            }
        );
    }
}