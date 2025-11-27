import './login-input.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';

export class InputComponent extends Component {
  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
