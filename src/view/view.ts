import { Component } from '../components/component.ts';
import { render } from '../services/utils.ts';

export abstract class View {
    public renderPage(): void {
        const content = this.createContent();

        render('.app', content);
    }

    public abstract createContent(): Component;
}
