import { Fragment, useEffect } from "react";
import { assert } from "keycloakify/tools/assert";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    type FormAction,
    type FormFieldError,
    getButtonToDisplayForMultivaluedAttributeField,
    useUserProfileForm
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { Field, FieldDescription, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect, MultiSelectContent, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { clsx } from "clsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordWrapper } from "@/components/password-wrapper";
import { InputGroupInput } from "@/components/ui/input-group.tsx";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <FieldSet>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                return (
                    <Fragment key={attribute.name}>
                        <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                        <Field
                            //className={kcClsx("kcFormGroupClass")}
                            className={displayableErrors.length > 0 ? "text-destructive" : ""}
                            style={{
                                display:
                                    attribute.annotations.inputType === "hidden" ||
                                    (attribute.name === "password-confirm" && !doMakeUserConfirmPassword)
                                        ? "none"
                                        : undefined
                            }}
                        >
                            <FieldLabel className={kcClsx("kcLabelWrapperClass")}>
                                <label htmlFor={attribute.name} className={kcClsx("kcLabelClass")}>
                                    {advancedMsg(attribute.displayName ?? "")}
                                </label>
                                {attribute.required && <span className="text-destructive">*</span>}
                            </FieldLabel>
                            {/*<div className={kcClsx("kcInputWrapperClass")}>*/}
                            {attribute.annotations.inputHelperTextBefore !== undefined && (
                                <FieldDescription
                                    className={kcClsx("kcInputHelperTextBeforeClass")}
                                    id={`form-help-text-before-${attribute.name}`}
                                    aria-live="polite"
                                >
                                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                                </FieldDescription>
                            )}
                            <InputFieldByType
                                attribute={attribute}
                                valueOrValues={valueOrValues}
                                displayableErrors={displayableErrors}
                                dispatchFormAction={dispatchFormAction}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                            <FieldErrors attribute={attribute} displayableErrors={displayableErrors} kcClsx={kcClsx} fieldIndex={undefined} />
                            {attribute.annotations.inputHelperTextAfter !== undefined && (
                                <FieldDescription
                                    className={kcClsx("kcInputHelperTextAfterClass")}
                                    id={`form-help-text-after-${attribute.name}`}
                                    aria-live="polite"
                                >
                                    {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                                </FieldDescription>
                            )}
                            {AfterField !== undefined && (
                                <AfterField
                                    attribute={attribute}
                                    dispatchFormAction={dispatchFormAction}
                                    displayableErrors={displayableErrors}
                                    valueOrValues={valueOrValues}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                />
                            )}
                            {/* NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook */}
                            {/*</div>*/}
                        </Field>
                    </Fragment>
                );
            })}
        </FieldSet>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, groupNameRef, i18n, kcClsx } = props;

    const { advancedMsg } = i18n;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);

            return (
                <div
                    className={kcClsx("kcFormGroupClass")}
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    {(() => {
                        const groupDisplayHeader = attribute.group.displayHeader ?? "";
                        const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

                        return (
                            <div className={kcClsx("kcContentWrapperClass")}>
                                <label id={`header-${attribute.group.name}`} className={kcClsx("kcFormGroupHeader")}>
                                    {groupHeaderText}
                                </label>
                            </div>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = attribute.group.displayDescription ?? "";

                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = advancedMsg(groupDisplayDescription);

                            return (
                                <div className={kcClsx("kcLabelWrapperClass")}>
                                    <label id={`description-${attribute.group.name}`} className={kcClsx("kcLabelClass")}>
                                        {groupDescriptionText}
                                    </label>
                                </div>
                            );
                        }

                        return null;
                    })()}
                </div>
            );
        }
    }

    return null;
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined; kcClsx: KcClsx }) {
    const { attribute, fieldIndex, kcClsx } = props;

    const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex);

    if (displayableErrors.length === 0) {
        return null;
    }

    return (
        <FieldError
            id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
            className={kcClsx("kcInputErrorMessageClass")}
            aria-live="polite"
        >
            {displayableErrors
                .filter(error => error.fieldIndex === fieldIndex)
                .map(({ errorMessage }, i, arr) => (
                    <Fragment key={i}>
                        {errorMessage}
                        {arr.length - 1 !== i && <br />}
                    </Fragment>
                ))}
        </FieldError>
    );
}

type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
};

function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        // NOTE: Unfortunately, keycloak won't let you define input type="hidden" in the Admin Console.
        // sometimes in the future it might.
        case "hidden":
            return <input type="hidden" name={attribute.name} value={valueOrValues} />;
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
            return <SelectTag {...props} />;
        case "multiselect":
            return <MultiSelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            const inputNode = <InputTag {...props} fieldIndex={undefined} />;

            if (attribute.name === "password" || attribute.name === "password-confirm") {
                return (
                    <PasswordWrapper kcClsx={props.kcClsx} i18n={props.i18n} passwordInputId={attribute.name}>
                        {inputNode}
                    </PasswordWrapper>
                );
            }

            return inputNode;
        }
    }
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, kcClsx, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;

    const { advancedMsgStr } = i18n;
    const isPassword = attribute.name === "password" || attribute.name === "password-confirm";
    const InputComponent = isPassword ? InputGroupInput : Input;

    return (
        <>
            <InputComponent
                type={(() => {
                    const { inputType } = attribute.annotations;

                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }

                    return inputType ?? "text";
                })()}
                id={attribute.name}
                name={attribute.name}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }

                    assert(typeof valueOrValues === "string");

                    return valueOrValues;
                })()}
                className={kcClsx("kcInputClass")}
                aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={
                    attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
                }
                pattern={attribute.annotations.inputTypePattern}
                size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                maxLength={
                    attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)
                }
                minLength={
                    attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)
                }
                max={attribute.annotations.inputTypeMax}
                min={attribute.annotations.inputTypeMin}
                step={attribute.annotations.inputTypeStep}
                {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);

                                return valueOrValues.map((value, i) => {
                                    if (i === fieldIndex) {
                                        return event.target.value;
                                    }

                                    return value;
                                });
                            }

                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: fieldIndex
                    })
                }
            />
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }

                assert(valueOrValues instanceof Array);

                const values = valueOrValues;

                return (
                    <>
                        <FieldErrors attribute={attribute} kcClsx={kcClsx} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
                        <AddRemoveButtonsMultiValuedAttribute
                            attribute={attribute}
                            values={values}
                            fieldIndex={fieldIndex}
                            dispatchFormAction={dispatchFormAction}
                            i18n={i18n}
                        />
                    </>
                );
            })()}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

    const { msg } = i18n;

    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

    const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

    return (
        <>
            {hasRemove && (
                <>
                    <button
                        id={`kc-remove${idPostfix}`}
                        type="button"
                        className="pf-c-button pf-m-inline pf-m-link"
                        onClick={() =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: values.filter((_, i) => i !== fieldIndex)
                            })
                        }
                    >
                        {msg("remove")}
                    </button>
                    {hasAdd ? <>&nbsp;|&nbsp;</> : null}
                </>
            )}
            {hasAdd && (
                <button
                    id={`kc-add${idPostfix}`}
                    type="button"
                    className="pf-c-button pf-m-inline pf-m-link"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    {msg("addValue")}
                </button>
            )}
        </>
    );
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, i18n, valueOrValues } = props;

    const {
        classDiv,
        classInput,
        //classLabel,
        inputType
    } = (() => {
        const { inputType } = attribute.annotations;

        assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

        switch (inputType) {
            case "select-radiobuttons":
                return {
                    inputType: "radio",
                    classDiv: kcClsx("kcInputClassRadio"),
                    classInput: kcClsx("kcInputClassRadioInput")
                    //classLabel: kcClsx("kcInputClassRadioLabel")
                };
            case "multiselect-checkboxes":
                return {
                    inputType: "checkbox",
                    classDiv: kcClsx("kcInputClassCheckbox"),
                    classInput: kcClsx("kcInputClassCheckboxInput")
                    //classLabel: kcClsx("kcInputClassCheckboxLabel")
                };
        }
    })();

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    if (inputType === "radio") {
        return (
            <RadioGroup
                onValueChange={value =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            return value || "";
                        })()
                    })
                }
            >
                {options.map(option => (
                    <div key={option} className={clsx("flex items-center space-x-2", classDiv)}>
                        <RadioGroupItem
                            // type={inputType}
                            id={`${attribute.name}-${option}`}
                            //name={attribute.name}
                            value={option}
                            className={classInput}
                            aria-invalid={props.displayableErrors.length !== 0}
                            disabled={attribute.readOnly}
                            checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                            onBlur={() =>
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: undefined
                                })
                            }
                        />
                        <Label
                            htmlFor={`${attribute.name}-${option}`}
                            //className={`${classLabel}${attribute.readOnly ? ` ${kcClsx("kcInputClassRadioCheckboxLabelDisabled")}` : ""}`}
                            className="font-normal"
                        >
                            {inputLabel(i18n, attribute, option)}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        );
    } else {
        return (
            <>
                {options.map(option => (
                    <div key={option} className={clsx("flex items-center space-x-2", classDiv)}>
                        <Checkbox
                            // type={inputType}
                            id={`${attribute.name}-${option}`}
                            name={attribute.name}
                            value={option}
                            className={classInput}
                            aria-invalid={props.displayableErrors.length !== 0}
                            disabled={attribute.readOnly}
                            checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                            onCheckedChange={isChecked =>
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: (() => {
                                        // const isChecked = checked;

                                        if (valueOrValues instanceof Array) {
                                            const newValues = [...valueOrValues];

                                            if (isChecked) {
                                                newValues.push(option);
                                            } else {
                                                newValues.splice(newValues.indexOf(option), 1);
                                            }

                                            return newValues;
                                        }

                                        return isChecked ? option : "";
                                    })()
                                })
                            }
                            onBlur={() =>
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: undefined
                                })
                            }
                        />
                        <Label
                            htmlFor={`${attribute.name}-${option}`}
                            //className={`${classLabel}${attribute.readOnly ? ` ${kcClsx("kcInputClassRadioCheckboxLabelDisabled")}` : ""}`}
                            className="font-normal"
                        >
                            {inputLabel(i18n, attribute, option)}
                        </Label>
                    </div>
                ))}
            </>
        );
    }
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, displayableErrors, valueOrValues } = props;

    assert(typeof valueOrValues === "string");

    const value = valueOrValues;

    return (
        <Textarea
            id={attribute.name}
            name={attribute.name}
            className={kcClsx("kcInputClass")}
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
            rows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
            maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
            value={value}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, displayableErrors, i18n, valueOrValues } = props;

    return (
        <Select
            onValueChange={value =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: (() => {
                        return value;
                    })()
                })
            }
        >
            <SelectTrigger
                id={attribute.name}
                name={attribute.name}
                className={kcClsx("kcInputClass")}
                aria-invalid={displayableErrors.length !== 0}
                disabled={attribute.readOnly}
                //size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                value={valueOrValues}
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
                }
            >
                <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
                {(() => {
                    const options = (() => {
                        walk: {
                            const { inputOptionsFromValidation } = attribute.annotations;

                            if (inputOptionsFromValidation === undefined) {
                                break walk;
                            }

                            assert(typeof inputOptionsFromValidation === "string");

                            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

                            if (validator === undefined) {
                                break walk;
                            }

                            if (validator.options === undefined) {
                                break walk;
                            }

                            return validator.options;
                        }

                        return attribute.validators.options?.options ?? [];
                    })();

                    return options.map(option => (
                        <SelectItem key={option} value={option}>
                            {inputLabel(i18n, attribute, option)}
                        </SelectItem>
                    ));
                })()}
            </SelectContent>
        </Select>
    );
}

function MultiSelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, displayableErrors, i18n, valueOrValues } = props;

    return (
        <MultiSelect
            onValuesChange={values => {
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: (() => {
                        return values;
                    })()
                });
            }}
        >
            <MultiSelectTrigger
                id={attribute.name}
                name={attribute.name}
                className={kcClsx("kcInputClass")}
                aria-invalid={displayableErrors.length !== 0}
                disabled={attribute.readOnly}
                //size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                value={valueOrValues}
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: undefined
                    })
                }
            >
                <MultiSelectValue placeholder="" />
            </MultiSelectTrigger>
            <MultiSelectContent>
                {(() => {
                    const options = (() => {
                        walk: {
                            const { inputOptionsFromValidation } = attribute.annotations;

                            if (inputOptionsFromValidation === undefined) {
                                break walk;
                            }

                            assert(typeof inputOptionsFromValidation === "string");

                            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

                            if (validator === undefined) {
                                break walk;
                            }

                            if (validator.options === undefined) {
                                break walk;
                            }

                            return validator.options;
                        }

                        return attribute.validators.options?.options ?? [];
                    })();

                    return options.map(option => (
                        <MultiSelectItem key={option} value={option}>
                            {inputLabel(i18n, attribute, option)}
                        </MultiSelectItem>
                    ));
                })()}
            </MultiSelectContent>
        </MultiSelect>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;

        return advancedMsg(inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}
