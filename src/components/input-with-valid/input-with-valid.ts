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

  constructor(
    tagName = 'div',
    inputClass = 'input-container-value',
    propsAndChildren: InputWithValidProps = {
      name: '',
      labelText: '',
      inputType: '',
      value: '',
      errorText: '',
      validationType: 'login',
    },
  ) {
    const validator = new Validator();

    const processBlur = (validationType: ValidationType) => (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      const value = target ? target.value : '';
      const isValid = this.validator.checkValid(value, validationType);

      this.setProps({ noValid: !isValid });
    };

    const inputElement = new InputElement('input', {
      attrs: {
        class: inputClass,
        id: propsAndChildren.name,
        name: propsAndChildren.name,
        type: propsAndChildren.inputType,
      },
      events: {
        blur: processBlur(propsAndChildren.validationType),
      },
    });

    super(tagName, {
      ...propsAndChildren,
      input: inputElement,
    });

    this.validator = validator;
    this.inputElement = inputElement;
  }

  getValue(): string {
    const inputEl = this.inputElement.getContent() as HTMLInputElement;
    return inputEl ? inputEl.value : '';
  }

  validate(): boolean {
    const value = this.getValue();
    const { validationType } = this._props;
    const isValid = this.validator.checkValid(value, validationType);

    this.setProps({ noValid: !isValid });

    return isValid;
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }

  renderTemplate(templateStr: string): DocumentFragment {
    return super.render(templateStr);
  }
}
