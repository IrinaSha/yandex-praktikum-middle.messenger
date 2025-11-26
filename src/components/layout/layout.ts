import '../../assets/styles/styles.scss'

import { Component } from '../component.ts';
import { tmpl } from './tmpl.ts';

export class Layout extends Component {
    render(): DocumentFragment {
        console.log('Page render');

        return super.render(tmpl);
    }

    componentDidUpdate(oldProps: any, newProps: any): boolean {
        return oldProps['text'] !== newProps['text'];
    }
}