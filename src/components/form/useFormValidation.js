import { useState, useCallback, useRef } from 'react';

/**
 * Reach International Operations - Accessible Form Validation Hook
 * 
 * Capabilities:
 * - Schema-based field validation rules
 * - Client-side validation on blur & change (after first submit attempt)
 * - Server-side field error mapping (API 422/400 field errors)
 * - Accessible auto-focus on first invalid field upon submit failure
 */

/**
 * @typedef {Object<string, (val: any, values: Object) => string|null>} ValidationRules
 */

export function useFormValidation({
    initialValues = {},
    rules = {},
    onSubmit
}) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const formRef = useRef(null);

    /**
     * Validate a single field by rule definition
     */
    const validateField = useCallback((name, value, allValues) => {
        const fieldRule = rules[name];
        if (!fieldRule) return null;

        if (typeof fieldRule === 'function') {
            return fieldRule(value, allValues);
        }

        // Object-based rules
        if (fieldRule.required && (value === undefined || value === null || String(value).trim() === '')) {
            return fieldRule.requiredMessage || `${fieldRule.label || name} is required.`;
        }

        if (fieldRule.minLength && String(value).length < fieldRule.minLength) {
            return fieldRule.minLengthMessage || `Must be at least ${fieldRule.minLength} characters.`;
        }

        if (fieldRule.pattern && !fieldRule.pattern.test(String(value))) {
            return fieldRule.patternMessage || `Invalid format for ${fieldRule.label || name}.`;
        }

        if (fieldRule.custom) {
            return fieldRule.custom(value, allValues);
        }

        return null;
    }, [rules]);

    /**
     * Validate all form fields simultaneously
     */
    const validateAll = useCallback((currentValues) => {
        const newErrors = {};
        let firstInvalidField = null;

        for (const [name] of Object.entries(rules)) {
            const err = validateField(name, currentValues[name], currentValues);
            if (err) {
                newErrors[name] = err;
                if (!firstInvalidField) firstInvalidField = name;
            }
        }

        return { errors: newErrors, isValid: Object.keys(newErrors).length === 0, firstInvalidField };
    }, [rules, validateField]);

    /**
     * Handle input value change
     */
    const handleChange = useCallback((name, value) => {
        setValues(prev => {
            const next = { ...prev, [name]: value };
            // If already attempted submit, validate in real time on change
            if (submitCount > 0 || touched[name]) {
                const err = validateField(name, value, next);
                setErrors(e => ({ ...e, [name]: err }));
            }
            return next;
        });
    }, [submitCount, touched, validateField]);

    /**
     * Handle input blur event
     */
    const handleBlur = useCallback((name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const err = validateField(name, values[name], values);
        setErrors(prev => ({ ...prev, [name]: err }));
    }, [values, validateField]);

    /**
     * Map server-side API field errors (e.g. from 422 or 400 responses)
     * @param {Object<string, string>} serverErrors
     */
    const setServerErrors = useCallback((serverErrors) => {
        if (!serverErrors || typeof serverErrors !== 'object') return;
        setErrors(prev => ({ ...prev, ...serverErrors }));

        // Auto-focus on first server error field
        setTimeout(() => {
            const firstKey = Object.keys(serverErrors)[0];
            if (firstKey && formRef.current) {
                const el = formRef.current.querySelector(`[name="${firstKey}"]`);
                if (el && typeof el.focus === 'function') {
                    el.focus();
                }
            }
        }, 50);
    }, []);

    /**
     * Form submission handler with auto-focus on first invalid field
     */
    const handleSubmit = useCallback(async (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        setSubmitCount(c => c + 1);
        const { errors: validationErrors, isValid, firstInvalidField } = validateAll(values);
        setErrors(validationErrors);

        if (!isValid) {
            // Accessible auto-focus on first invalid input field
            setTimeout(() => {
                if (firstInvalidField && formRef.current) {
                    const el = formRef.current.querySelector(`[name="${firstInvalidField}"]`);
                    if (el && typeof el.focus === 'function') {
                        el.focus();
                    }
                }
            }, 50);
            return;
        }

        if (onSubmit) {
            setIsSubmitting(true);
            try {
                await onSubmit(values, { setServerErrors, resetForm: () => setValues(initialValues) });
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [values, validateAll, onSubmit, setServerErrors, initialValues]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setSubmitCount(0);
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        submitCount,
        formRef,
        handleChange,
        handleBlur,
        handleSubmit,
        setServerErrors,
        reset,
        setFieldValue: handleChange
    };
}

export default useFormValidation;
