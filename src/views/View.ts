import { Model, HasId } from "../models/Model";

// This signature is nasty but there's no way around it
export abstract class View<ModelForView extends Model<ModelProperties>, ModelProperties extends HasId> {
    regions: { [key: string]: Element } = {};

    constructor(
        public parent: Element, 
        public model: ModelForView
    ) {
        this.bindModel();
    }

    abstract template(): string;

    // default function signatures
    regionMap(): { [key: string]: string} { return {}; }
    eventsMap(): {[key: string]: () => void} {  return {}; };
    onRender(): void {}
    // default function signatures END

    bindModel(): void {
        this.model.on('change', () => {
            this.render()
        });
    }

    bindEvents(fragment: DocumentFragment): void {
        const eventsMap = this.eventsMap();

        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(':');

            fragment.querySelectorAll(selector).forEach(element => {
                element.addEventListener(eventName, eventsMap[eventKey])
            });
        }
    }

    mapRegions(fragment: DocumentFragment): void {
        const regionMap = this.regionMap();

        for (let key in regionMap) {
            const selector = regionMap[key];
            const element = fragment.querySelector(selector);

            if (element) {
                this.regions[key] = element;
            }
        }
    }
    
    render(): void {
        this.parent.innerHTML = '';

        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template(); // this turns the string returned by this.template into HTML

        this.bindEvents(templateElement.content); // bind all events in the eventsMap to this template 
        this.mapRegions(templateElement.content);

        this.onRender(); // nest all the views together

        this.parent.append(templateElement.content); // we only want the content, not the template tags as well
    }
}