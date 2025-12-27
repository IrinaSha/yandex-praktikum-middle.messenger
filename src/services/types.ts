import { Component } from '../components/component';

export type EventsTypes = Record<string, Callback[]>;

export type Callback = (...args: unknown[]) => void;

export type PropsAndChildren = {
  children: Record<string, Component>;
  props: Record<string, PropsValue>;
  lists: any;
};

export type PropsValue = string | number | boolean | null | undefined | symbol | object | [];

export type HttpOptions = {
  headers: any;
  method: any;
  data: any;
  timeout: number;
};

export type ValidationType = 'login' | 'password' | 'email' | 'phone' | 'name' | 'message';

export type InputWithValidProps = {
  name: string;
  labelText: string;
  inputType: string;
  value?: string;
  errorText: string;
  validationType: ValidationType;
  noValid?: boolean,
  attrs?: any,
};
