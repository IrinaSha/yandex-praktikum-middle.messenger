import { Component } from '../components/component.ts';

export function render(query: string, component: Component) {
    const root = document.querySelector(query);
    const content = component.getContent();

    if (root && content) {
        root.appendChild(content);
        component.dispatchComponentDidMount();
    }

    return root;
}

export function queryStringify(data: Object): string {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    // Здесь достаточно и [object Object] для объекта
    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        // @ts-ignore
        return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
    }, '?');
}
