import { Component } from '../Component.ts';
import { tmpl } from './tmpl.ts';

export class Page extends Component {
    render(): DocumentFragment {
        console.log('Page render');

        return super.render(tmpl);
    }
}