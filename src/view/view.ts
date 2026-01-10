import { Component } from '../components/component';
import { render } from '../services/utils';

export abstract class View {
  public renderPage(): void {
    const content = this.createContent();

    render('.app', content);
  }

  public abstract createContent(): Component;
}
