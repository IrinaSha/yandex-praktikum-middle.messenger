import { Component } from '../component';
import { tmpl } from './tmpl';
import type { ComponentProps } from '../../services/types';

export class Nav extends Component {
  constructor(props: ComponentProps) {
    super('nav', props);
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
