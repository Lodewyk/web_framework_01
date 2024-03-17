import axios, { AxiosPromise, AxiosResponse } from "axios";

interface HasId {
    id?: number
}

export class Sync<DataObjProps extends HasId> {
    constructor (public url: string) {}

    /**
     * Fetch record from database
     */
    fetch(id: number): AxiosPromise {
        return axios.get(`${this.url}/${id}`)
    }

    /**
     * Save record data to database
     * 
     * Will create a new record if none has been loaded (fetch()'d),
     * or update an existing record.
     */
    save(data: DataObjProps): AxiosPromise {
        const { id } = data;

        if (id) {
            // update existing user
            return axios.put(`${this.url}/${id}`, data);
        } else {
            // create new user
            return axios.post(this.url, data);
        }
    }
}