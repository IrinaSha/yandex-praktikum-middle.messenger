import { Component } from '../Component.ts';
import { tmpl } from './tmpl.ts';

export class Nav extends Component {
    constructor(props: any) {
        super('nav', props);
    }

    render(): DocumentFragment {
        console.log('Nav render');

        return super.render(tmpl);
    }

    _addEvents() {
        const { events = {} } = this._props;

        this._element?.querySelectorAll('a').forEach((item: any) => {
            Object.keys(events).forEach((event: string) => {
                item.addEventListener(event, events[event]);
            });

            // @ts-ignore
            /*item.addEventListener('click', (e) => {
                console.log('link clicked');

                e.preventDefault();
                e.stopPropagation();
            });*/
        });

        //super._addEvents();
    }
}