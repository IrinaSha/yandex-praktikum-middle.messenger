import { Component } from '../components/component';
import type { HTTP_METHODS } from './consts';

export type EventsTypes = Record<string, Callback[]>;

export type Callback = (...args: ComponentProps[]) => void;

export type PropsAndChildren = {
  children: Record<string, Component>;
  props: Record<string, PropsValue>;
  lists: Record<string, ComponentList>;
};

export type ComponentList = Array<Component | string | number>;

export type PropsValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | symbol
  | []
  | Record<string, unknown>
  | unknown[];

export type ValidationType = 'login' | 'password' | 'email' | 'phone' | 'name' | 'message';

export type InputWithValidProps = {
  name: string;
  labelText: string;
  inputType: string;
  value?: unknown;
  errorText?: string;
  validationType: ValidationType;
  noValid?: boolean;
  attrs?: Record<string, string | number | boolean>;
  profileEditUserInfo?: boolean;
  visible?: boolean;
};

export type HttpRequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  data?: Record<string, PropsValue> | FormData | string;
  timeout?: number;
  signal?: AbortSignal;
  withCredentials?: boolean;
  responseType?: XMLHttpRequestResponseType;
}

export interface HttpResponse<T = any> {
  status: number;
  reason?: string;
  data?: T;
}

export type ComponentProps = {
  events?: Record<string, EventListener>;
  attrs?: Record<string, string | number | boolean>;
  [key: string]: PropsValue | Record<string, unknown> | EventListener | Function | undefined;
};

export type BlockMeta = {
  tagName: string;
  propsAndChildren: Record<string, unknown>;
};

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
