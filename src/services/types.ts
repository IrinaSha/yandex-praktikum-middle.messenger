import type { Component } from '../components/Component.ts';

export type EventsTypes = Record<string, Callback[]>;

export type Callback = (...args: unknown[]) => void;

export type PropsAndChildren = {
    children: Record<string, Component>;
    props: Record<string, PropsValue>;
    lists: any;
}

export type PropsValue = string | number | boolean | null | undefined | symbol | object | [];