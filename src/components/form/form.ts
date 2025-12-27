import './form.scss';
import { Component } from '../component';
import { tmpl } from './tmpl';
import { InputWithValidComponent } from '../input-with-valid/input-with-valid';

interface FormProps {
  attrs?: Record<string, string>;
  inputs?: InputWithValidComponent[];
  button?: Component;
  onSubmit?: (data: Record<string, string>, isValid: boolean) => void;
}

export class Form extends Component {
  constructor(tagName = 'form', propsAndChildren: FormProps = {}) {
    const handleSubmit = (e: Event) => {
      e.preventDefault();

      const inputs = propsAndChildren.inputs || [];
      const data: Record<string, string> = {};
      let isValid = true;

      // Валидация всех инпутов
      inputs.forEach(input => {
        if (input instanceof InputWithValidComponent) {
          const value = input.getValue();
          const isInputValid = input.validate();

          data[input._props.name] = value;

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
