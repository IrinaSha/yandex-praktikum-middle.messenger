import './input-with-valid.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';
import { Validator } from '../../services/validator';
import { InputElement } from '../input/input';
import type {InputWithValidProps, ValidationType} from '../../services/types';

export class InputWithValidComponent extends Component {
  validator: Validator;
  inputElement: InputElement;

  constructor(tagName = 'div', propsAndChildren: InputWithValidProps = {
    name: '',
    labelText: '',
    inputType: '',
    value: '',
    errorText: '',
    validationType: 'login'
  }) {
    const validator = new Validator();

    const processBlur = (validationType: ValidationType) => (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      const value = target ? target.value : '';

      let isValid = false;

      switch (validationType) {
        case 'login':
          isValid = validator.validateLogin(value);
          break;
        case 'password':
          isValid = validator.validatePassword(value);
          break;
      }

      this.setProps({ noValid: !isValid });

      console.log('processBlur triggered, value:', value);
      console.log('isValid:', isValid);
    };

    const inputElement = new InputElement('input', {
     attrs: {
       class: 'input-container-value',
       id: propsAndChildren.name,
       name: propsAndChildren.name,
       type: propsAndChildren.inputType
      },
      events: {
        blur: processBlur(propsAndChildren.validationType)
      }
    });

    super(tagName, {
      ...propsAndChildren,
      input: inputElement,
    });

    this.validator = validator;
    this.inputElement = inputElement;
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
