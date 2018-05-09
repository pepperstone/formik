/// <reference types="react" />
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { FormikProps } from './Formik';
import { FieldAttributes } from './Field';
export interface FastFieldState {
  value: any;
  error?: string;
}
export declare class FastField<
  Props extends FieldAttributes = any
> extends React.Component<Props, FastFieldState> {
  static contextTypes: {
    formik: PropTypes.Requireable<any>;
  };
  static propTypes: {
    name: PropTypes.Validator<any>;
    component: PropTypes.Requireable<any>;
    render: PropTypes.Requireable<any>;
    children: PropTypes.Requireable<any>;
    validate: PropTypes.Requireable<any>;
    innerRef: PropTypes.Requireable<any>;
  };
  reset: Function;
  constructor(props: Props, context: any);
  componentWillReceiveProps(
    nextProps: Props,
    nextContext: {
      formik: FormikProps<any>;
    }
  ): void;
  componentWillUnmount(): void;
  componentWillMount(): void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: () => void;
  render(): {} | null | undefined;
}
