import './input-with-valid.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';
import { Validator } from '../../services/validator';
import { InputElement } from '../input/input';
import type { InputWithValidProps, ValidationType } from '../../services/types';

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

  // Получить значение инпута
  getValue(): string {
    const inputEl = this.inputElement.getContent() as HTMLInputElement;
    return inputEl ? inputEl.value : '';
  }

  // Валидировать инпут
  validate(): boolean {
    const value = this.getValue();
    const validationType = this._props.validationType;

    let isValid = false;

    switch (validationType) {
      case 'login':
        isValid = this.validator.validateLogin(value);
        break;
      case 'password':
        isValid = this.validator.validatePassword(value);
        break;
    }

    this.setProps({ noValid: !isValid });
    return isValid;
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
