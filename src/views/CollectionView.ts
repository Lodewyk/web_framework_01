import { Collection } from "../models/Collection";
import { HasId, Model } from "../models/Model";

export abstract class CollectionView<CollectionType, ModelProperties extends HasId>  {
    constructor(
        public parent: Element, 
        public collection: Collection<CollectionType, ModelProperties>
    ) {}

    abstract renderItem(model: CollectionType, parent: Element): void;

    render(): void {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');

        for (let model of this.collection.models) {
            const itemParent = document.createElement('div');
            this.renderItem(model, itemParent);
            templateElement.content.append(itemParent);
        }

        this.parent.append(templateElement.content);
    }
}