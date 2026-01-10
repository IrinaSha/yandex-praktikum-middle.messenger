import '../../assets/styles/styles.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';
import type { ComponentProps } from '../../services/types';

export class Layout extends Component {
  public render(): DocumentFragment {
    return super.render(tmpl);
  }

  public componentDidUpdate(oldProps: ComponentProps, newProps: ComponentProps): boolean {
    return oldProps.text !== newProps.text;
  }
}
