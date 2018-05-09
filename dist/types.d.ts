/// <reference types="react" />
import * as React from 'react';
export interface SharedRenderProps<T> {
  component?: string | React.ComponentType<T | void>;
  render?: ((props: T) => React.ReactNode);
  children?: ((props: T) => React.ReactNode);
}
export declare type GenericFieldHTMLAttributes =
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.SelectHTMLAttributes<HTMLSelectElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>;
