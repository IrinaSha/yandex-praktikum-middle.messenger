import { Component } from '../components/component';
import { render } from '../services/utils';

export class View {
  private _content: Component | null = null;

  public renderPage(): Element | null {
    const content = this.getContent();

    return render('.app', content);
  }

  public getContent(): Component {
    if (!this._content) {
      this._content = this.render();
    }
    return this._content;
  }

  protected render(): Component {
    return new Component();
  }

  public show(): void {
    const content = this.getContent().getContent();

    if (content) {
      content.style.display = 'block';
    }
  }

  public hide(): void {
    const content = this.getContent().getContent();

    if (content) {
      content.style.display = 'none';
    }
  }
}
