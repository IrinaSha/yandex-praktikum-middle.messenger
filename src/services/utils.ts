import { Component } from '../components/component';

export function render(query: string, component: Component): Element | null {
  const root = document.querySelector(query);
  const content = component.getContent();

  if (root && content) {
    root.appendChild(content);
    component.dispatchComponentDidMount();
  }

  return root;
}

export function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);

  return keys.reduce((
    result,
    key,
    index,
  ) => `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`, '?');
}
