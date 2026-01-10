import './form.scss';
import { Component } from '../component';
import { tmpl } from './tmpl';
import { InputWithValidComponent } from '../input-with-valid/input-with-valid';
import { AvatarInput } from '../avatar-input/avatar-input';

interface FormProps {
  attrs?: Record<string, string>;
  inputs?: InputWithValidComponent[];
  avatar?: AvatarInput;
  button?: Component;
  showSubmit?: boolean;
  onSubmit?: (data: Record<string, string>, isValid: boolean) => void;
}

export class Form extends Component {
  constructor(tagName = 'form', propsAndChildren: FormProps = {}) {
    const handleSubmit = (e: Event) => {
      e.preventDefault();

      const inputs = propsAndChildren.inputs || [];
      const data: Record<string, string> = {};
      let isValid = true;

      inputs.forEach((input) => {
        if (input instanceof InputWithValidComponent) {
          const name = input.props.name?.toString() || '';
          const value = input.getValue();
          const isInputValid = input.validate();

          data[name] = value;

          if (!isInputValid) {
            isValid = false;
          }
        }
      });

      if (propsAndChildren.onSubmit) {
        propsAndChildren.onSubmit(data, isValid);
      }
    };

    super(tagName, {
      ...propsAndChildren,
      events: {
        submit: handleSubmit,
      },
    });
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
