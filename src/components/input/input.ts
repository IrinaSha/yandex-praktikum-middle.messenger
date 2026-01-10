import './input.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';

export class InputElement extends Component {
  constructor(tagName = 'input', propsAndChildren = {}) {
    super(tagName, {
      ...propsAndChildren,
    });
  }

  render(): DocumentFragment {
    return document.createDocumentFragment();
  }
}
