import { Component } from '../component.ts';
import { tmpl } from './tmpl.ts';

export class Link extends Component {
    render(): DocumentFragment {
        console.log('Page render');

        return super.render(tmpl);
    }

    /*componentDidUpdate(oldProps: any, newProps: any): boolean {
        return oldProps['title'] !== newProps['title'];
    }*/
}