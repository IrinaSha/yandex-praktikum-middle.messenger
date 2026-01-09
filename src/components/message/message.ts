import './message.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';

export class Message extends Component {
  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
