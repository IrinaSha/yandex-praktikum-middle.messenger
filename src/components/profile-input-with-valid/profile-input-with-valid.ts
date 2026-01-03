import './profile-input-with-valid.scss';
import '../../assets/styles/variables.scss';

import { InputWithValidComponent } from '../input-with-valid/input-with-valid';
import { tmpl } from './tmpl';
import type { InputWithValidProps } from '../../services/types';

export class ProfileInputWithValidComponent extends InputWithValidComponent {
  constructor(tagName = 'div', propsAndChildren: InputWithValidProps = {
    name: '',
    labelText: '',
    inputType: '',
    value: '',
    errorText: '',
    validationType: 'login',
  }) {
    super(tagName, 'profile-input-container-text profile-input-container-value', propsAndChildren);
  }

  render(): DocumentFragment {
    return super.renderTemplate(tmpl);
  }
}
