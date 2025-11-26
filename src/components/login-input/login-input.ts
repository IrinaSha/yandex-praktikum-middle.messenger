import './login-input.scss'
import '../../assets/styles/variables.scss'

import { Component } from '../component.ts';
import { tmpl } from './tmpl.ts';

export class InputComponent extends Component {
    render(): DocumentFragment {
        console.log('InputComponent render');

        return super.render(tmpl);
    }
}
