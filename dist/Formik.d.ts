/// <reference types="react" />
import * as PropTypes from 'prop-types';
import * as React from 'react';
export interface FormikValues {
  [field: string]: any;
}
export declare type FormikErrors<Values> = {
  [K in keyof Values]?: Values[K] extends object
    ? FormikErrors<Values[K]>
    : string
};
export declare type FormikTouched<Values> = {
  [K in keyof Values]?: Values[K] extends object
    ? FormikTouched<Values[K]>
    : boolean
};
export interface FormikState<Values> {
  values: Values;
  error?: any;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  isSubmitting: boolean;
  status?: any;
  submitCount: number;
}
export interface FormikComputedProps<Values> {
  readonly dirty: boolean;
  readonly isValid: boolean;
  readonly initialValues: Values;
}
export interface FormikActions<Values> {
  setStatus(status?: any): void;
  setError(e: any): void;
  setErrors(errors: FormikErrors<Values>): void;
  setSubmitting(isSubmitting: boolean): void;
  setTouched(touched: FormikTouched<Values>): void;
  setValues(values: Values): void;
  setFieldValue(
    field: keyof Values,
    value: any,
    shouldValidate?: boolean
  ): void;
  setFieldValue(field: string, value: any, shouldValidate?: boolean): void;
  setFieldError(field: keyof Values, message: string): void;
  setFieldError(field: string, message: string): void;
  setFieldTouched(
    field: keyof Values,
    isTouched?: boolean,
    shouldValidate?: boolean
  ): void;
  setFieldTouched(
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ): void;
  validateForm(values?: any): void;
  resetForm(nextValues?: any): void;
  submitForm(): void;
  setFormikState<K extends keyof FormikState<Values>>(
    f: (
      prevState: Readonly<FormikState<Values>>,
      props: any
    ) => Pick<FormikState<Values>, K>,
    callback?: () => any
  ): void;
}
export interface FormikActions<Values> {
  setFieldValue(field: string, value: any): void;
  setFieldError(field: string, message: string): void;
  setFieldTouched(field: string, isTouched?: boolean): void;
  setFormikState<K extends keyof FormikState<Values>>(
    state: Pick<FormikState<Values>, K>,
    callback?: () => any
  ): void;
}
export interface FormikHandlers {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
  handleBlur(e: any): void;
  handleBlur(field: string): ((e: any) => void);
  handleChange(e: React.ChangeEvent<any>): void;
  handleChange(field: string): ((e: React.ChangeEvent<any>) => void);
}
export interface FormikSharedConfig {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  isInitialValid?: boolean | ((props: object) => boolean | undefined);
  enableReinitialize?: boolean;
}
export interface FormikConfig<Values> extends FormikSharedConfig {
  initialValues: Values;
  onReset?: (values: Values, formikActions: FormikActions<Values>) => void;
  onSubmit: (values: Values, formikActions: FormikActions<Values>) => void;
  component?: React.ComponentType<FormikProps<Values>> | React.ReactNode;
  render?: ((props: FormikProps<Values>) => React.ReactNode);
  validationSchema?: any | (() => any);
  validate?: ((
    values: Values
  ) => void | object | Promise<FormikErrors<Values>>);
  children?:
    | ((props: FormikProps<Values>) => React.ReactNode)
    | React.ReactNode;
}
export declare type FormikProps<Values> = FormikState<Values> &
  FormikActions<Values> &
  FormikHandlers &
  FormikComputedProps<Values>;
export declare class Formik<
  ExtraProps = {},
  Values = object
> extends React.Component<FormikConfig<Values> & ExtraProps, FormikState<any>> {
  static defaultProps: {
    validateOnChange: boolean;
    validateOnBlur: boolean;
    isInitialValid: boolean;
    enableReinitialize: boolean;
  };
  static propTypes: {
    validateOnChange: PropTypes.Requireable<any>;
    validateOnBlur: PropTypes.Requireable<any>;
    isInitialValid: PropTypes.Requireable<any>;
    initialValues: PropTypes.Requireable<any>;
    onReset: PropTypes.Requireable<any>;
    onSubmit: PropTypes.Validator<any>;
    validationSchema: PropTypes.Requireable<any>;
    validate: PropTypes.Requireable<any>;
    component: PropTypes.Requireable<any>;
    render: PropTypes.Requireable<any>;
    children: PropTypes.Requireable<any>;
    enableReinitialize: PropTypes.Requireable<any>;
  };
  static childContextTypes: {
    formik: PropTypes.Requireable<any>;
  };
  initialValues: Values;
  hcCache: {
    [key: string]: (e: string | React.ChangeEvent<any>) => void;
  };
  hbCache: {
    [key: string]: (e: any) => void;
  };
  fields: {
    [field: string]: (nextValues?: any) => void;
  };
  getChildContext(): {
    formik: {
      validationSchema: (FormikConfig<Values> & ExtraProps)['validationSchema'];
      validate: (FormikConfig<Values> & ExtraProps)['validate'];
      registerField: (
        name: string,
        resetFn: (nextValues?: any) => void
      ) => void;
      unregisterField: (name: string) => void;
      handleBlur: (eventOrString: any) => void | ((e: any) => void);
      handleChange: (
        eventOrPath: string | React.ChangeEvent<any>
      ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
      handleReset: () => void;
      handleSubmit: (e: React.FormEvent<HTMLFormElement> | undefined) => void;
      validateOnChange: (FormikConfig<Values> & ExtraProps)['validateOnChange'];
      validateOnBlur: (FormikConfig<Values> & ExtraProps)['validateOnBlur'];
      dirty: boolean;
      isValid: boolean;
      initialValues: Values;
      setStatus(status?: any): void;
      setError(e: any): void;
      setErrors(errors: FormikErrors<Values>): void;
      setSubmitting(isSubmitting: boolean): void;
      setTouched(touched: FormikTouched<Values>): void;
      setValues(values: Values): void;
      setFieldValue(
        field: keyof Values,
        value: any,
        shouldValidate?: boolean | undefined
      ): void;
      setFieldValue(
        field: string,
        value: any,
        shouldValidate?: boolean | undefined
      ): void;
      setFieldValue(field: string, value: any): void;
      setFieldError(field: keyof Values, message: string): void;
      setFieldError(field: string, message: string): void;
      setFieldError(field: string, message: string): void;
      setFieldTouched(
        field: keyof Values,
        isTouched?: boolean | undefined,
        shouldValidate?: boolean | undefined
      ): void;
      setFieldTouched(
        field: string,
        isTouched?: boolean | undefined,
        shouldValidate?: boolean | undefined
      ): void;
      setFieldTouched(field: string, isTouched?: boolean | undefined): void;
      validateForm(values?: any): void;
      resetForm(nextValues?: any): void;
      submitForm(): void;
      setFormikState<
        K extends
          | 'error'
          | 'values'
          | 'errors'
          | 'touched'
          | 'isSubmitting'
          | 'status'
          | 'submitCount'
      >(
        f: (
          prevState: Readonly<FormikState<Values>>,
          props: any
        ) => Pick<FormikState<Values>, K>,
        callback?: (() => any) | undefined
      ): void;
      setFormikState<
        K extends
          | 'error'
          | 'values'
          | 'errors'
          | 'touched'
          | 'isSubmitting'
          | 'status'
          | 'submitCount'
      >(
        state: Pick<FormikState<Values>, K>,
        callback?: (() => any) | undefined
      ): void;
      values: any;
      error?: any;
      errors: FormikErrors<any>;
      touched: FormikTouched<any>;
      isSubmitting: boolean;
      status?: any;
      submitCount: number;
    };
  };
  constructor(props: FormikConfig<Values> & ExtraProps);
  registerField: (name: string, resetFn: (nextValues?: any) => void) => void;
  unregisterField: (name: string) => void;
  componentWillReceiveProps(
    nextProps: Readonly<FormikConfig<Values> & ExtraProps>
  ): void;
  componentWillMount(): void;
  setErrors: (errors: FormikErrors<Values>) => void;
  setTouched: (touched: FormikTouched<Values>) => void;
  setValues: (values: FormikValues) => void;
  setStatus: (status?: any) => void;
  setError: (error: any) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  runValidationSchema: (
    values: FormikValues,
    onSuccess?: Function | undefined
  ) => void;
  runValidations: (values?: FormikValues) => void;
  handleChange: (
    eventOrPath: string | React.ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement> | undefined) => void;
  submitForm: () => void;
  executeSubmit: () => void;
  handleBlur: (eventOrString: any) => void | ((e: any) => void);
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
  setFieldError: (field: string, message: string) => void;
  resetForm: (nextValues?: Values | undefined) => void;
  handleReset: () => void;
  setFormikState: (s: any, callback?: (() => void) | undefined) => void;
  getFormikActions: () => FormikActions<Values>;
  getFormikComputedProps: () => {
    dirty: boolean;
    isValid: boolean;
    initialValues: Values;
  };
  getFormikBag: () => {
    registerField: (name: string, resetFn: (nextValues?: any) => void) => void;
    unregisterField: (name: string) => void;
    handleBlur: (eventOrString: any) => void | ((e: any) => void);
    handleChange: (
      eventOrPath: string | React.ChangeEvent<any>
    ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void);
    handleReset: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement> | undefined) => void;
    validateOnChange: (FormikConfig<Values> & ExtraProps)['validateOnChange'];
    validateOnBlur: (FormikConfig<Values> & ExtraProps)['validateOnBlur'];
    dirty: boolean;
    isValid: boolean;
    initialValues: Values;
    setStatus(status?: any): void;
    setError(e: any): void;
    setErrors(errors: FormikErrors<Values>): void;
    setSubmitting(isSubmitting: boolean): void;
    setTouched(touched: FormikTouched<Values>): void;
    setValues(values: Values): void;
    setFieldValue(
      field: keyof Values,
      value: any,
      shouldValidate?: boolean | undefined
    ): void;
    setFieldValue(
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ): void;
    setFieldValue(field: string, value: any): void;
    setFieldError(field: keyof Values, message: string): void;
    setFieldError(field: string, message: string): void;
    setFieldError(field: string, message: string): void;
    setFieldTouched(
      field: keyof Values,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined
    ): void;
    setFieldTouched(
      field: string,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined
    ): void;
    setFieldTouched(field: string, isTouched?: boolean | undefined): void;
    validateForm(values?: any): void;
    resetForm(nextValues?: any): void;
    submitForm(): void;
    setFormikState<
      K extends
        | 'error'
        | 'values'
        | 'errors'
        | 'touched'
        | 'isSubmitting'
        | 'status'
        | 'submitCount'
    >(
      f: (
        prevState: Readonly<FormikState<Values>>,
        props: any
      ) => Pick<FormikState<Values>, K>,
      callback?: (() => any) | undefined
    ): void;
    setFormikState<
      K extends
        | 'error'
        | 'values'
        | 'errors'
        | 'touched'
        | 'isSubmitting'
        | 'status'
        | 'submitCount'
    >(
      state: Pick<FormikState<Values>, K>,
      callback?: (() => any) | undefined
    ): void;
    values: any;
    error?: any;
    errors: FormikErrors<any>;
    touched: FormikTouched<any>;
    isSubmitting: boolean;
    status?: any;
    submitCount: number;
  };
  render(): any;
}
export declare function yupToFormErrors<Values>(
  yupError: any
): FormikErrors<Values>;
export declare function validateYupSchema<T extends FormikValues>(
  values: T,
  schema: any,
  sync?: boolean,
  context?: any
): Promise<Partial<T>>;
