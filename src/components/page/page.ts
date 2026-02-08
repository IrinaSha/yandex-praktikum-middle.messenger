import { Component } from '../component';
import { tmpl } from './tmpl';
import type { ComponentProps } from '../../services/types';
import './page.scss';

export class Page extends Component {
  render(): DocumentFragment {
    const propsTmpl = this.props?.template?.toString();
    const template = propsTmpl || tmpl;

    return super.render(template);
  }

  componentDidUpdate(oldProps: ComponentProps, newProps: ComponentProps): boolean {
    const shouldUpdate = (
      oldProps.hideForm !== newProps.hideForm
      || oldProps.hideEditButtons !== newProps.hideEditButtons
      || oldProps.hideFormPassword !== newProps.hideFormPassword
      || oldProps.messagesSectionClass !== newProps.messagesSectionClass
    );

    return shouldUpdate;
  }
}
