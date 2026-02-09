import { ErrorBlock } from '../components/error-block/error-block';
import { Link } from '../components/link/link';
import { View } from './view';
import { Component } from '../components/component';

export class ErrorView extends View {
  private readonly errorCode: string;

  private readonly errorText: string;

  constructor(errorCode: string, errorText: string) {
    super();

    this.errorCode = errorCode;
    this.errorText = errorText;
  }

  getContent(): Component {
    const link = new Link(
      'span',
      {
        attrs: {
          class: 'nav-container text',
        },
        url: '/',
        title: 'Назад',
      },
    );

    return new ErrorBlock(
      'div',
      {
        attrs: {
          class: 'pnl',
        },
        errorCode: this.errorCode,
        errorText: this.errorText,
        link,
      },
    );
  }
}
