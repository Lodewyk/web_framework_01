import { User, UserProps } from "../models/User";
import { CollectionView } from "./CollectionView";

export class UserList extends CollectionView<User, UserProps> {

    renderItem(model: User, parent: Element): void {
        const userString = `
            <div>
                <h3>User: ${model.get('id')}</h3>
                <div>Name: ${model.get('name')}</div>
                <div>Age: ${model.get('age')}</div>
            </div>
        `;
        const userTemplate = document.createElement('template');
        userTemplate.innerHTML = userString;
        parent.append(userTemplate.content);

        console.log('UserLists, parent: ', parent)
    }
}