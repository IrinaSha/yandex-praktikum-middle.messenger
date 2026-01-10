import { Component } from '../component';
import { tmpl } from './tmpl';

export class Link extends Component {
  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
