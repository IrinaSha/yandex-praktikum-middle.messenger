import './button.scss'
import '../../assets/styles/variables.scss'

import { Component } from '../component.ts';
import { tmpl } from './tmpl.ts';

export class Button extends Component {
    render(): DocumentFragment {
        console.log('Button render');

        return super.render(tmpl);
    }
}
