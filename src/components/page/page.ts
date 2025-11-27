import { Component } from '../component';
import { tmpl } from './tmpl';

export class Page extends Component {
  render(): DocumentFragment {
    return super.render(tmpl);
  }

  componentDidUpdate(oldProps: any, newProps: any): boolean {
    return oldProps.title !== newProps.title;
  }
}
