import './error-block.scss'
import '../../assets/styles/variables.scss'

import { Component } from '../component.ts';
import { tmpl } from './tmpl.ts';

export class ErrorBlock extends Component {
    render(): DocumentFragment {
        console.log('Error render');

        return super.render(tmpl);
    }
}
