'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib_1 = require('tslib');
var React = require('react');
var toPath = _interopDefault(require('lodash.topath'));
var cloneDeep = _interopDefault(require('lodash.clonedeep'));
var PropTypes = require('prop-types');
var isEqual = _interopDefault(require('react-fast-compare'));
var warning = _interopDefault(require('warning'));
var hoistNonReactStatics = _interopDefault(require('hoist-non-react-statics'));

function getIn(obj, key, def, p) {
    if (p === void 0) { p = 0; }
    var path = toPath(key);
    while (obj && p < path.length) {
        obj = obj[path[p++]];
    }
    return obj === undefined ? def : obj;
}
function setIn(obj, path, value) {
    var res = {};
    var resVal = res;
    var i = 0;
    var pathArray = toPath(path);
    for (; i < pathArray.length - 1; i++) {
        var currentPath = pathArray[i];
        var currentObj = getIn(obj, pathArray.slice(0, i + 1));
        if (resVal[currentPath]) {
            resVal = resVal[currentPath];
        }
        else if (currentObj) {
            resVal = resVal[currentPath] = cloneDeep(currentObj);
        }
        else {
            var nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] =
                isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
    }
    resVal[pathArray[i]] = value;
    return tslib_1.__assign({}, obj, res);
}
function setNestedObjectValues(object, value, visited, response) {
    if (visited === void 0) { visited = new WeakMap(); }
    if (response === void 0) { response = {}; }
    for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
        var k = _a[_i];
        var val = object[k];
        if (isObject(val)) {
            if (!visited.get(val)) {
                visited.set(val, true);
                response[k] = Array.isArray(val) ? [] : {};
                setNestedObjectValues(val, value, visited, response[k]);
            }
        }
        else {
            response[k] = value;
        }
    }
    return response;
}
var isFunction = function (obj) { return typeof obj === 'function'; };
var isObject = function (obj) {
    return obj !== null && typeof obj === 'object';
};
var isInteger = function (obj) {
    return String(Math.floor(Number(obj))) === obj;
};
var isString = function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
};
var isNaN = function (obj) { return obj !== obj; };
var isEmptyChildren = function (children) {
    return React.Children.count(children) === 0;
};
var isPromise = function (value) {
    return isObject(value) && isFunction(value.then);
};

var Formik = (function (_super) {
    tslib_1.__extends(Formik, _super);
    function Formik(props) {
        var _this = _super.call(this, props) || this;
        _this.hcCache = {};
        _this.hbCache = {};
        _this.registerField = function (name, resetFn) {
            _this.fields[name] = resetFn;
        };
        _this.unregisterField = function (name) {
            delete _this.fields[name];
        };
        _this.setErrors = function (errors) {
            _this.setState({ errors: errors });
        };
        _this.setTouched = function (touched) {
            _this.setState({ touched: touched }, function () {
                if (_this.props.validateOnBlur) {
                    _this.runValidations(_this.state.values);
                }
            });
        };
        _this.setValues = function (values) {
            _this.setState({ values: values }, function () {
                if (_this.props.validateOnChange) {
                    _this.runValidations(values);
                }
            });
        };
        _this.setStatus = function (status) {
            _this.setState({ status: status });
        };
        _this.setError = function (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn("Warning: Formik's setError(error) is deprecated and may be removed in future releases. Please use Formik's setStatus(status) instead. It works identically. For more info see https://github.com/jaredpalmer/formik#setstatus-status-any--void");
            }
            _this.setState({ error: error });
        };
        _this.setSubmitting = function (isSubmitting) {
            _this.setState({ isSubmitting: isSubmitting });
        };
        _this.runValidationSchema = function (values, onSuccess) {
            var validationSchema = _this.props.validationSchema;
            var schema = isFunction(validationSchema)
                ? validationSchema()
                : validationSchema;
            validateYupSchema(values, schema).then(function () {
                _this.setState({ errors: {} });
                if (onSuccess) {
                    onSuccess();
                }
            }, function (err) {
                return _this.setState({ errors: yupToFormErrors(err), isSubmitting: false });
            });
        };
        _this.runValidations = function (values) {
            if (values === void 0) { values = _this.state.values; }
            if (_this.props.validationSchema) {
                _this.runValidationSchema(values);
            }
            if (_this.props.validate) {
                var maybePromisedErrors = _this.props.validate(values);
                if (isPromise(maybePromisedErrors)) {
                    maybePromisedErrors.then(function () {
                        _this.setState({ errors: {} });
                    }, function (errors) { return _this.setState({ errors: errors, isSubmitting: false }); });
                }
                else {
                    _this.setErrors(maybePromisedErrors);
                }
            }
        };
        _this.handleChange = function (eventOrPath) {
            var executeChange = function (eventOrTextValue, maybePath) {
                var field = maybePath;
                var val = eventOrTextValue;
                var parsed;
                if (!isString(eventOrTextValue)) {
                    if (eventOrTextValue.persist) {
                        eventOrTextValue.persist();
                    }
                    var _a = eventOrTextValue.target, type = _a.type, name_1 = _a.name, id = _a.id, value = _a.value, checked = _a.checked, outerHTML = _a.outerHTML;
                    field = maybePath ? maybePath : name_1 ? name_1 : id;
                    if (!field && process.env.NODE_ENV !== 'production') {
                        warnAboutMissingIdentifier({
                            htmlContent: outerHTML,
                            documentationAnchorLink: 'handlechange-e-reactchangeeventany--void',
                            handlerName: 'handleChange',
                        });
                    }
                    val = /number|range/.test(type)
                        ? (parsed = parseFloat(value), isNaN(parsed) ? '' : parsed)
                        : /checkbox/.test(type) ? checked : value;
                }
                if (field) {
                    _this.setState(function (prevState) { return (tslib_1.__assign({}, prevState, { values: setIn(prevState.values, field, val) })); });
                    if (_this.props.validateOnChange) {
                        _this.runValidations(setIn(_this.state.values, field, val));
                    }
                }
                else {
                    console.warn('Formik could not determine which field to update based on your input and usage of `handleChange`');
                }
            };
            if (isString(eventOrPath)) {
                return isFunction(_this.hcCache[eventOrPath])
                    ? _this.hcCache[eventOrPath]
                    : (_this.hcCache[eventOrPath] = function (event) {
                        return executeChange(event, eventOrPath);
                    });
            }
            else {
                executeChange(eventOrPath);
            }
        };
        _this.setFieldValue = function (field, value, shouldValidate) {
            if (shouldValidate === void 0) { shouldValidate = true; }
            _this.setState(function (prevState) { return (tslib_1.__assign({}, prevState, { values: setIn(prevState.values, field, value) })); }, function () {
                if (_this.props.validateOnChange && shouldValidate) {
                    _this.runValidations(_this.state.values);
                }
            });
        };
        _this.handleSubmit = function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            _this.submitForm();
        };
        _this.submitForm = function () {
            _this.setState(function (prevState) { return ({
                touched: setNestedObjectValues(prevState.values, true),
                isSubmitting: true,
                submitCount: prevState.submitCount + 1,
            }); });
            if (_this.props.validate) {
                var maybePromisedErrors = _this.props.validate(_this.state.values) || {};
                if (isPromise(maybePromisedErrors)) {
                    maybePromisedErrors.then(function () {
                        _this.setState({ errors: {} });
                        _this.executeSubmit();
                    }, function (errors) { return _this.setState({ errors: errors, isSubmitting: false }); });
                    return;
                }
                else {
                    var isValid = Object.keys(maybePromisedErrors).length === 0;
                    _this.setState({
                        errors: maybePromisedErrors,
                        isSubmitting: isValid,
                    });
                    if (isValid) {
                        _this.executeSubmit();
                    }
                }
            }
            else if (_this.props.validationSchema) {
                _this.runValidationSchema(_this.state.values, _this.executeSubmit);
            }
            else {
                _this.executeSubmit();
            }
        };
        _this.executeSubmit = function () {
            _this.props.onSubmit(_this.state.values, _this.getFormikActions());
        };
        _this.handleBlur = function (eventOrString) {
            var executeBlur = function (e, path) {
                if (e.persist) {
                    e.persist();
                }
                var _a = e.target, name = _a.name, id = _a.id, outerHTML = _a.outerHTML;
                var field = path ? path : name ? name : id;
                if (!field && process.env.NODE_ENV !== 'production') {
                    warnAboutMissingIdentifier({
                        htmlContent: outerHTML,
                        documentationAnchorLink: 'handleblur-e-any--void',
                        handlerName: 'handleBlur',
                    });
                }
                _this.setState(function (prevState) { return ({
                    touched: setIn(prevState.touched, field, true),
                }); });
                if (_this.props.validateOnBlur) {
                    _this.runValidations(_this.state.values);
                }
            };
            if (isString(eventOrString)) {
                return isFunction(_this.hbCache[eventOrString])
                    ? _this.hbCache[eventOrString]
                    : (_this.hbCache[eventOrString] = function (event) {
                        return executeBlur(event, eventOrString);
                    });
            }
            else {
                executeBlur(eventOrString);
            }
        };
        _this.setFieldTouched = function (field, touched, shouldValidate) {
            if (touched === void 0) { touched = true; }
            if (shouldValidate === void 0) { shouldValidate = true; }
            _this.setState(function (prevState) { return (tslib_1.__assign({}, prevState, { touched: setIn(prevState.touched, field, touched) })); }, function () {
                if (_this.props.validateOnBlur && shouldValidate) {
                    _this.runValidations(_this.state.values);
                }
            });
        };
        _this.setFieldError = function (field, message) {
            _this.setState(function (prevState) { return (tslib_1.__assign({}, prevState, { errors: setIn(prevState.errors, field, message) })); });
        };
        _this.resetForm = function (nextValues) {
            var values = nextValues ? nextValues : _this.props.initialValues;
            _this.initialValues = values;
            _this.setState({
                isSubmitting: false,
                errors: {},
                touched: {},
                error: undefined,
                status: undefined,
                values: values,
                submitCount: 0,
            });
            Object.keys(_this.fields).map(function (f) { return _this.fields[f](values); });
        };
        _this.handleReset = function () {
            if (_this.props.onReset) {
                var maybePromisedOnReset = _this.props.onReset(_this.state.values, _this.getFormikActions());
                if (isPromise(maybePromisedOnReset)) {
                    maybePromisedOnReset.then(_this.resetForm);
                }
                else {
                    _this.resetForm();
                }
            }
            else {
                _this.resetForm();
            }
        };
        _this.setFormikState = function (s, callback) {
            return _this.setState(s, callback);
        };
        _this.getFormikActions = function () {
            return {
                resetForm: _this.resetForm,
                submitForm: _this.submitForm,
                validateForm: _this.runValidations,
                setError: _this.setError,
                setErrors: _this.setErrors,
                setFieldError: _this.setFieldError,
                setFieldTouched: _this.setFieldTouched,
                setFieldValue: _this.setFieldValue,
                setStatus: _this.setStatus,
                setSubmitting: _this.setSubmitting,
                setTouched: _this.setTouched,
                setValues: _this.setValues,
                setFormikState: _this.setFormikState,
            };
        };
        _this.getFormikComputedProps = function () {
            var isInitialValid = _this.props.isInitialValid;
            var dirty = !isEqual(_this.initialValues, _this.state.values);
            return {
                dirty: dirty,
                isValid: dirty
                    ? _this.state.errors && Object.keys(_this.state.errors).length === 0
                    : isInitialValid !== false && isFunction(isInitialValid)
                        ? isInitialValid(_this.props)
                        : isInitialValid,
                initialValues: _this.initialValues,
            };
        };
        _this.getFormikBag = function () {
            return tslib_1.__assign({}, _this.state, _this.getFormikActions(), _this.getFormikComputedProps(), { registerField: _this.registerField, unregisterField: _this.unregisterField, handleBlur: _this.handleBlur, handleChange: _this.handleChange, handleReset: _this.handleReset, handleSubmit: _this.handleSubmit, validateOnChange: _this.props.validateOnChange, validateOnBlur: _this.props.validateOnBlur });
        };
        _this.state = {
            values: props.initialValues || {},
            errors: {},
            touched: {},
            isSubmitting: false,
            submitCount: 0,
        };
        _this.fields = {};
        _this.initialValues = props.initialValues || {};
        return _this;
    }
    Formik.prototype.getChildContext = function () {
        return {
            formik: tslib_1.__assign({}, this.getFormikBag(), { validationSchema: this.props.validationSchema, validate: this.props.validate }),
        };
    };
    Formik.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.enableReinitialize &&
            !isEqual(nextProps.initialValues, this.props.initialValues)) {
            this.initialValues = nextProps.initialValues;
            this.resetForm(nextProps.initialValues);
        }
    };
    Formik.prototype.componentWillMount = function () {
        warning(!(this.props.component && this.props.render), 'You should not use <Formik component> and <Formik render> in the same <Formik> component; <Formik render> will be ignored');
        warning(!(this.props.component &&
            this.props.children &&
            !isEmptyChildren(this.props.children)), 'You should not use <Formik component> and <Formik children> in the same <Formik> component; <Formik children> will be ignored');
        warning(!(this.props.render &&
            this.props.children &&
            !isEmptyChildren(this.props.children)), 'You should not use <Formik render> and <Formik children> in the same <Formik> component; <Formik children> will be ignored');
    };
    Formik.prototype.render = function () {
        var _a = this.props, component = _a.component, render = _a.render, children = _a.children;
        var props = this.getFormikBag();
        return component
            ? React.createElement(component, props)
            : render
                ? render(props)
                : children
                    ? typeof children === 'function'
                        ? children(props)
                        : !isEmptyChildren(children) ? React.Children.only(children) : null
                    : null;
    };
    Formik.defaultProps = {
        validateOnChange: true,
        validateOnBlur: true,
        isInitialValid: false,
        enableReinitialize: false,
    };
    Formik.propTypes = {
        validateOnChange: PropTypes.bool,
        validateOnBlur: PropTypes.bool,
        isInitialValid: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
        initialValues: PropTypes.object,
        onReset: PropTypes.func,
        onSubmit: PropTypes.func.isRequired,
        validationSchema: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        validate: PropTypes.func,
        component: PropTypes.func,
        render: PropTypes.func,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        enableReinitialize: PropTypes.bool,
    };
    Formik.childContextTypes = {
        formik: PropTypes.object,
    };
    return Formik;
}(React.Component));
function warnAboutMissingIdentifier(_a) {
    var htmlContent = _a.htmlContent, documentationAnchorLink = _a.documentationAnchorLink, handlerName = _a.handlerName;
    console.error("Warning: `" + handlerName + "` has triggered and you forgot to pass an `id` or `name` attribute to your input:\n\n    " + htmlContent + "\n\n    Formik cannot determine which value to update. For more info see https://github.com/jaredpalmer/formik#" + documentationAnchorLink + "\n  ");
}
function yupToFormErrors(yupError) {
    var errors = {};
    for (var _i = 0, _a = yupError.inner; _i < _a.length; _i++) {
        var err = _a[_i];
        if (!errors[err.path]) {
            errors = setIn(errors, err.path, err.message);
        }
    }
    return errors;
}
function validateYupSchema(values, schema, sync, context) {
    if (sync === void 0) { sync = false; }
    if (context === void 0) { context = {}; }
    var validateData = {};
    for (var k in values) {
        if (values.hasOwnProperty(k)) {
            var key = String(k);
            validateData[key] = values[key] !== '' ? values[key] : undefined;
        }
    }
    return schema[sync ? 'validateSync' : 'validate'](validateData, {
        abortEarly: false,
        context: context,
    });
}

var Field = (function (_super) {
    tslib_1.__extends(Field, _super);
    function Field() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleChange = function (e) {
            var _a = _this.context.formik, handleChange = _a.handleChange, validateOnChange = _a.validateOnChange;
            handleChange(e);
            if (!!validateOnChange && !!_this.props.validate) {
                _this.runFieldValidations(e.target.value);
            }
        };
        _this.handleBlur = function (e) {
            var _a = _this.context.formik, handleBlur = _a.handleBlur, validateOnBlur = _a.validateOnBlur;
            handleBlur(e);
            if (validateOnBlur && _this.props.validate) {
                _this.runFieldValidations(e.target.value);
            }
        };
        _this.runFieldValidations = function (value) {
            var setFieldError = _this.context.formik.setFieldError;
            var _a = _this.props, name = _a.name, validate = _a.validate;
            var maybePromise = validate(value);
            if (isPromise(maybePromise)) {
                maybePromise.then(function () { return setFieldError(name, undefined); }, function (error) { return setFieldError(name, error); });
            }
            else {
                setFieldError(name, maybePromise);
            }
        };
        return _this;
    }
    Field.prototype.componentWillMount = function () {
        var _a = this.props, render = _a.render, children = _a.children, component = _a.component;
        warning(!(component && render), 'You should not use <Field component> and <Field render> in the same <Field> component; <Field component> will be ignored');
        warning(!(this.props.component && children && isFunction(children)), 'You should not use <Field component> and <Field children> as a function in the same <Field> component; <Field component> will be ignored.');
        warning(!(render && children && !isEmptyChildren(children)), 'You should not use <Field render> and <Field children> in the same <Field> component; <Field children> will be ignored');
    };
    Field.prototype.render = function () {
        var _a = this.props, validate = _a.validate, name = _a.name, render = _a.render, children = _a.children, _b = _a.component, component = _b === void 0 ? 'input' : _b, props = tslib_1.__rest(_a, ["validate", "name", "render", "children", "component"]);
        var formik = this.context.formik;
        var field = {
            value: props.type === 'radio' || props.type === 'checkbox'
                ? props.value
                : getIn(formik.values, name),
            name: name,
            onChange: validate ? this.handleChange : formik.handleChange,
            onBlur: validate ? this.handleBlur : formik.handleBlur,
        };
        var bag = { field: field, form: formik };
        if (render) {
            return render(bag);
        }
        if (isFunction(children)) {
            return children(bag);
        }
        if (typeof component === 'string') {
            var innerRef = props.innerRef, rest = tslib_1.__rest(props, ["innerRef"]);
            return React.createElement(component, tslib_1.__assign({ ref: innerRef }, field, rest, { children: children }));
        }
        return React.createElement(component, tslib_1.__assign({}, bag, props, { children: children }));
    };
    Field.contextTypes = {
        formik: PropTypes.object,
    };
    Field.propTypes = {
        name: PropTypes.string.isRequired,
        component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        render: PropTypes.func,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        validate: PropTypes.func,
        innerRef: PropTypes.func,
    };
    return Field;
}(React.Component));

var Form = function (props, context) { return (React.createElement("form", tslib_1.__assign({ onSubmit: context.formik.handleSubmit }, props))); };
Form.contextTypes = {
    formik: PropTypes.object,
};

function withFormik(_a) {
    var _b = _a.mapPropsToValues, mapPropsToValues = _b === void 0 ? function (vanillaProps) {
        var val = {};
        for (var k in vanillaProps) {
            if (vanillaProps.hasOwnProperty(k) &&
                typeof vanillaProps[k] !== 'function') {
                val[k] = vanillaProps[k];
            }
        }
        return val;
    } : _b, config = tslib_1.__rest(_a, ["mapPropsToValues"]);
    return function createFormik(Component) {
        var componentDisplayName = Component.displayName ||
            Component.name ||
            (Component.constructor && Component.constructor.name) ||
            'Component';
        var C = (function (_super) {
            tslib_1.__extends(C, _super);
            function C() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.validate = function (values) {
                    return config.validate(values, _this.props);
                };
                _this.validationSchema = function () {
                    return isFunction(config.validationSchema)
                        ? config.validationSchema(_this.props)
                        : config.validationSchema;
                };
                _this.handleSubmit = function (values, actions) {
                    return config.handleSubmit(values, tslib_1.__assign({}, actions, { props: _this.props }));
                };
                _this.renderFormComponent = function (formikProps) {
                    return React.createElement(Component, tslib_1.__assign({}, _this.props, formikProps));
                };
                return _this;
            }
            C.prototype.render = function () {
                return (React.createElement(Formik, tslib_1.__assign({}, this.props, config, { validate: config.validate && this.validate, validationSchema: config.validationSchema && this.validationSchema, initialValues: mapPropsToValues(this.props), onSubmit: this.handleSubmit, render: this.renderFormComponent })));
            };
            C.displayName = "WithFormik(" + componentDisplayName + ")";
            return C;
        }(React.Component));
        return hoistNonReactStatics(C, Component);
    };
}

var move = function (array, from, to) {
    var copy = (array || []).slice();
    var value = copy[from];
    copy.splice(from, 1);
    copy.splice(to, 0, value);
    return copy;
};
var swap = function (array, indexA, indexB) {
    var copy = (array || []).slice();
    var a = copy[indexA];
    copy[indexA] = copy[indexB];
    copy[indexB] = a;
    return copy;
};
var insert = function (array, index, value) {
    var copy = (array || []).slice();
    copy.splice(index, 0, value);
    return copy;
};
var replace = function (array, index, value) {
    var copy = (array || []).slice();
    copy[index] = value;
    return copy;
};
var FieldArray = (function (_super) {
    tslib_1.__extends(FieldArray, _super);
    function FieldArray(props) {
        var _this = _super.call(this, props) || this;
        _this.updateArrayField = function (fn, alterTouched, alterErrors) {
            var _a = _this.context.formik, setFormikState = _a.setFormikState, validateForm = _a.validateForm, values = _a.values, touched = _a.touched, errors = _a.errors;
            var _b = _this.props, name = _b.name, validateOnChange = _b.validateOnChange;
            setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { values: setIn(prevState.values, name, fn(getIn(values, name))), errors: alterErrors
                    ? setIn(prevState.errors, name, fn(getIn(errors, name)))
                    : prevState.errors, touched: alterTouched
                    ? setIn(prevState.touched, name, fn(getIn(touched, name)))
                    : prevState.touched })); }, function () {
                if (validateOnChange) {
                    validateForm();
                }
            });
        };
        _this.push = function (value) {
            return _this.updateArrayField(function (array) { return (array || []).concat([value]); }, false, false);
        };
        _this.handlePush = function (value) { return function () { return _this.push(value); }; };
        _this.swap = function (indexA, indexB) {
            return _this.updateArrayField(function (array) { return swap(array, indexA, indexB); }, false, false);
        };
        _this.handleSwap = function (indexA, indexB) { return function () {
            return _this.swap(indexA, indexB);
        }; };
        _this.move = function (from, to) {
            return _this.updateArrayField(function (array) { return move(array, from, to); }, false, false);
        };
        _this.handleMove = function (from, to) { return function () { return _this.move(from, to); }; };
        _this.insert = function (index, value) {
            return _this.updateArrayField(function (array) { return insert(array, index, value); }, false, false);
        };
        _this.handleInsert = function (index, value) { return function () { return _this.insert(index, value); }; };
        _this.replace = function (index, value) {
            return _this.updateArrayField(function (array) { return replace(array, index, value); }, false, false);
        };
        _this.handleReplace = function (index, value) { return function () {
            return _this.replace(index, value);
        }; };
        _this.unshift = function (value) {
            var arr = [];
            _this.updateArrayField(function (array) {
                arr = array ? [value].concat(array) : [value];
                return arr;
            }, false, false);
            return arr.length;
        };
        _this.handleUnshift = function (value) { return function () { return _this.unshift(value); }; };
        _this.handleRemove = function (index) { return function () { return _this.remove(index); }; };
        _this.handlePop = function () { return function () { return _this.pop(); }; };
        _this.remove = _this.remove.bind(_this);
        _this.pop = _this.pop.bind(_this);
        return _this;
    }
    FieldArray.prototype.remove = function (index) {
        var result;
        this.updateArrayField(function (array) {
            var copy = array ? array.slice() : [];
            if (!result) {
                result = copy[index];
            }
            if (isFunction(copy.splice)) {
                copy.splice(index, 1);
            }
            return copy;
        }, true, true);
        return result;
    };
    FieldArray.prototype.pop = function () {
        var result;
        this.updateArrayField(function (array) {
            var tmp = array;
            if (!result) {
                result = tmp && tmp.pop && tmp.pop();
            }
            return tmp;
        }, true, true);
        return result;
    };
    FieldArray.prototype.render = function () {
        var arrayHelpers = {
            push: this.push,
            pop: this.pop,
            swap: this.swap,
            move: this.move,
            insert: this.insert,
            replace: this.replace,
            unshift: this.unshift,
            remove: this.remove,
            handlePush: this.handlePush,
            handlePop: this.handlePop,
            handleSwap: this.handleSwap,
            handleMove: this.handleMove,
            handleInsert: this.handleInsert,
            handleReplace: this.handleReplace,
            handleUnshift: this.handleUnshift,
            handleRemove: this.handleRemove,
        };
        var _a = this.props, component = _a.component, render = _a.render, children = _a.children, name = _a.name;
        var props = tslib_1.__assign({}, arrayHelpers, { form: this.context.formik, name: name });
        return component
            ? React.createElement(component, props)
            : render
                ? render(props)
                : children
                    ? typeof children === 'function'
                        ? children(props)
                        : !isEmptyChildren(children) ? React.Children.only(children) : null
                    : null;
    };
    FieldArray.defaultProps = {
        validateOnChange: true,
    };
    FieldArray.contextTypes = {
        formik: PropTypes.object,
    };
    return FieldArray;
}(React.Component));

function isEqualExceptForKey(a, b, path) {
    return isEqual(setIn(a, path, undefined), setIn(b, path, undefined));
}
var FastField = (function (_super) {
    tslib_1.__extends(FastField, _super);
    function FastField(props, context) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (e) {
            e.persist();
            var _a = _this.context.formik, validateOnChange = _a.validateOnChange, validate = _a.validate, values = _a.values, validationSchema = _a.validationSchema, errors = _a.errors, setFormikState = _a.setFormikState;
            var _b = e.target, type = _b.type, value = _b.value, checked = _b.checked;
            var val = /number|range/.test(type)
                ? parseFloat(value)
                : /checkbox/.test(type) ? checked : value;
            if (validateOnChange) {
                if (_this.props.validate) {
                    var maybePromise = _this.props.validate(value);
                    if (isPromise(maybePromise)) {
                        _this.setState({ value: val });
                        maybePromise.then(function () { return _this.setState({ error: undefined }); }, function (error) { return _this.setState({ error: error }); });
                    }
                    else {
                        _this.setState({ value: val, error: maybePromise });
                    }
                }
                else if (validate) {
                    var maybePromise_1 = validate(setIn(values, _this.props.name, val));
                    if (isPromise(maybePromise_1)) {
                        _this.setState({ value: val });
                        maybePromise_1.then(function () { return _this.setState({ error: undefined }); }, function (error) {
                            if (isEqualExceptForKey(maybePromise_1, errors, _this.props.name)) {
                                _this.setState({ error: getIn(error, _this.props.name) });
                            }
                            else {
                                setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { errors: error })); });
                            }
                        });
                    }
                    else {
                        if (isEqualExceptForKey(maybePromise_1, errors, _this.props.name)) {
                            _this.setState({
                                value: val,
                                error: getIn(maybePromise_1, _this.props.name),
                            });
                        }
                        else {
                            _this.setState({
                                value: val,
                            });
                            setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { errors: maybePromise_1 })); });
                        }
                    }
                }
                else if (validationSchema) {
                    var schema = isFunction(validationSchema)
                        ? validationSchema()
                        : validationSchema;
                    var mergedValues = setIn(values, _this.props.name, val);
                    try {
                        validateYupSchema(mergedValues, schema, true);
                        _this.setState({
                            value: val,
                            error: undefined,
                        });
                    }
                    catch (e) {
                        if (e.name === 'ValidationError') {
                            _this.setState({
                                value: val,
                                error: getIn(yupToFormErrors(e), _this.props.name),
                            });
                        }
                        else {
                            _this.setState({
                                value: val,
                            });
                            validateYupSchema(mergedValues, schema).then(function () { return _this.setState({ error: undefined }); }, function (err) {
                                return _this.setState(function (s) { return (tslib_1.__assign({}, s, { error: getIn(yupToFormErrors(err), _this.props.name) })); });
                            });
                        }
                    }
                }
                else {
                    _this.setState({ value: val });
                }
            }
            else {
                _this.setState({ value: val });
            }
        };
        _this.handleBlur = function () {
            var _a = _this.context.formik, validateOnBlur = _a.validateOnBlur, setFormikState = _a.setFormikState;
            var _b = _this.props, name = _b.name, validate = _b.validate;
            if (validateOnBlur && validate) {
                var maybePromise_2 = validate(_this.state.value);
                if (isPromise(maybePromise_2)) {
                    maybePromise_2.then(function () {
                        return setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { values: setIn(prevState.values, name, _this.state.value), errors: setIn(prevState.errors, name, undefined), touched: setIn(prevState.touched, name, true) })); });
                    }, function (error) {
                        return setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { values: setIn(prevState.values, name, _this.state.value), errors: setIn(prevState.errors, name, error), touched: setIn(prevState.touched, name, true) })); });
                    });
                }
                else {
                    setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { values: setIn(prevState.values, name, _this.state.value), errors: setIn(prevState.errors, name, maybePromise_2), touched: setIn(prevState.touched, name, true) })); });
                }
            }
            else {
                setFormikState(function (prevState) { return (tslib_1.__assign({}, prevState, { errors: setIn(prevState.errors, name, _this.state.error), values: setIn(prevState.values, name, _this.state.value), touched: setIn(prevState.touched, name, true) })); });
            }
        };
        _this.state = {
            value: getIn(context.formik.values, props.name),
            error: getIn(context.formik.errors, props.name),
        };
        _this.reset = function (nextValues) {
            _this.setState({
                value: getIn(nextValues, props.name),
                error: getIn(context.formik.errors, props.name),
            });
        };
        context.formik.registerField(props.name, _this.reset);
        return _this;
    }
    FastField.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        var nextFieldValue = getIn(nextContext.formik.values, nextProps.name);
        var nextFieldError = getIn(nextContext.formik.errors, nextProps.name);
        var nextState;
        if (nextFieldValue !== this.state.value) {
            nextState = { value: nextFieldValue };
        }
        if (nextFieldError !== this.state.error) {
            nextState = tslib_1.__assign({}, nextState, { error: nextFieldError });
        }
        if (nextState) {
            this.setState(function (s) { return (tslib_1.__assign({}, s, nextState)); });
        }
    };
    FastField.prototype.componentWillUnmount = function () {
        this.context.formik.unregisterField(this.props.name);
    };
    FastField.prototype.componentWillMount = function () {
        var _a = this.props, render = _a.render, children = _a.children, component = _a.component;
        warning(!(component && render), 'You should not use <FastField component> and <FastField render> in the same <FastField> component; <FastField component> will be ignored');
        warning(!(this.props.component && children && isFunction(children)), 'You should not use <FastField component> and <FastField children> as a function in the same <FastField> component; <FastField component> will be ignored.');
        warning(!(render && children && !isEmptyChildren(children)), 'You should not use <FastField render> and <FastField children> in the same <FastField> component; <FastField children> will be ignored');
    };
    FastField.prototype.render = function () {
        var _a = this.props, validate = _a.validate, name = _a.name, render = _a.render, children = _a.children, _b = _a.component, component = _b === void 0 ? 'input' : _b, props = tslib_1.__rest(_a, ["validate", "name", "render", "children", "component"]);
        var formik = this.context.formik;
        var field = {
            value: props.type === 'radio' || props.type === 'checkbox'
                ? props.value
                : this.state.value,
            name: name,
            onChange: this.handleChange,
            onBlur: this.handleBlur,
        };
        var bag = {
            field: field,
            form: formik,
            meta: { touched: getIn(formik.touched, name), error: this.state.error },
        };
        if (render) {
            return render(bag);
        }
        if (isFunction(children)) {
            return children(bag);
        }
        if (typeof component === 'string') {
            var innerRef = props.innerRef, rest = tslib_1.__rest(props, ["innerRef"]);
            return React.createElement(component, tslib_1.__assign({ ref: innerRef }, field, rest, { children: children }));
        }
        return React.createElement(component, tslib_1.__assign({}, bag, props, { children: children }));
    };
    FastField.contextTypes = {
        formik: PropTypes.object,
    };
    FastField.propTypes = {
        name: PropTypes.string.isRequired,
        component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        render: PropTypes.func,
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        validate: PropTypes.func,
        innerRef: PropTypes.func,
    };
    return FastField;
}(React.Component));

exports.Formik = Formik;
exports.yupToFormErrors = yupToFormErrors;
exports.validateYupSchema = validateYupSchema;
exports.Field = Field;
exports.Form = Form;
exports.withFormik = withFormik;
exports.move = move;
exports.swap = swap;
exports.insert = insert;
exports.replace = replace;
exports.FieldArray = FieldArray;
exports.getIn = getIn;
exports.setIn = setIn;
exports.setNestedObjectValues = setNestedObjectValues;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isInteger = isInteger;
exports.isString = isString;
exports.isNaN = isNaN;
exports.isEmptyChildren = isEmptyChildren;
exports.isPromise = isPromise;
exports.FastField = FastField;
//# sourceMappingURL=formik.js.map
