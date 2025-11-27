import './button.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';

export class Button extends Component {
  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
