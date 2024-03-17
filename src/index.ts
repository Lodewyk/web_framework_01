import { User } from "./models/User";

console.log('----- starting at index.ts')

const user = new User({name: 'Ian', age: 34});
user.on('change', () =>{
    console.log('changed')
})
user.trigger('change');