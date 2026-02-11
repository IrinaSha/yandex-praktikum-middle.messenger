import {
  describe, expect, jest, it, beforeEach,
} from '@jest/globals';
import { Component } from './component';
import { EventBus } from '../services/event-bus';
import type { ComponentProps } from '../services/types';

const TAG_DIV = 'div';
const TEST_UUID = 'test-uuid';
const CHILD_KEY = 'child';
// const LIST_KEY = 'list';
const ATTR_KEY = 'data-test';
const ATTR_VALUE = 'test';
const EVENT_NAME = 'click';
const MOCK_EVENT_HANDLER = jest.fn();

jest.mock('uuid', () => ({
  v4: jest.fn(() => TEST_UUID),
}));

const mockEventBus = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
} as unknown as jest.Mocked<EventBus>;

class TestComponent extends Component {
  constructor(props: Record<string, unknown> = {}) {
    super(TAG_DIV, props);
  }

  public componentDidMount(): void {}

  public componentDidUpdate(oldProps: ComponentProps, newProps: ComponentProps): boolean {
    return oldProps !== newProps;
  }
}

describe('Component', () => {
  let component: TestComponent;

  beforeEach(() => {
    jest.clearAllMocks();

    (Component.prototype as any)._eventBus = () => mockEventBus;
  });

  const createComponent = (props = {}): TestComponent => new TestComponent(props);

  const callProtected = <T = any>(
    comp: any,
    method: string,
    ...args: unknown[]
  ): T => comp[method](...args);

  it('constructor registers events and creates proxies', () => {
    component = createComponent();

    expect((component as any).props.__id).toBe(TEST_UUID);
  });

  it('setProps updates props/children/lists and triggers CDU', () => {
    component = createComponent();
    const newProps = { test: 'value' };

    component.setProps(newProps);

    expect(component.props.test).toBe('value');
  });

  it('show/hide modify element display', () => {
    component = createComponent();
    callProtected(component, '_createResources');

    component.show();
    expect(component.getContent()?.style.display).toBe('block');

    component.hide();
    expect(component.getContent()?.style.display).toBe('none');
  });

  it('_render removes/adds events and updates content', () => {
    component = createComponent({
      events: { [EVENT_NAME]: MOCK_EVENT_HANDLER },
      attrs: { [ATTR_KEY]: ATTR_VALUE },
    });
    callProtected(component, '_createResources');

    callProtected(component, '_render');

    expect((component as any)._element?.getAttribute(ATTR_KEY)).toBe(ATTR_VALUE);
  });

  it('_componentDidMount calls CDM and children CDM', () => {
    const child = createComponent();
    component = createComponent({ [CHILD_KEY]: child });
    const childDispatchSpy = jest.spyOn(child, 'dispatchComponentDidMount');

    callProtected(component, '_componentDidMount');

    expect(childDispatchSpy).toHaveBeenCalled();
  });

  it('_addEvents/_removeEvents handle events', () => {
    component = createComponent({
      events: { [EVENT_NAME]: MOCK_EVENT_HANDLER },
    });

    callProtected(component, '_createResources');
    const element = component.getContent()!;

    const addSpy = jest.spyOn(element, 'addEventListener');
    const removeSpy = jest.spyOn(element, 'removeEventListener');

    callProtected(component, '_addEvents');
    expect(addSpy).toHaveBeenCalledWith(EVENT_NAME, MOCK_EVENT_HANDLER);

    callProtected(component, '_removeEvents');
    expect(removeSpy).toHaveBeenCalledWith(EVENT_NAME, MOCK_EVENT_HANDLER);
  });
});
