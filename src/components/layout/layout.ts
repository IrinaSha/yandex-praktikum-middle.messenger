import '../../assets/styles/styles.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';

export class Layout extends Component {
  public render(): DocumentFragment {
    return super.render(tmpl);
  }

  public componentDidUpdate(oldProps: any, newProps: any): boolean {
    return oldProps.text !== newProps.text;
  }
}
