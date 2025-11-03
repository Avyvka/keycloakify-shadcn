import type { JSX } from "keycloakify/tools/JSX";
import { useLayoutEffect, useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as any)["onSubmitRecaptcha"] = () => {
            // @ts-expect-error
            document.getElementById("kc-register-form").requestSubmit();
        };

        return () => {
            delete (window as any)["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <form id="kc-register-form" className={kcClsx("kcFormClass")} action={url.registrationAction} method="post">
                <div className="flex flex-col gap-6">
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                    {termsAcceptanceRequired && (
                        <TermsAcceptance
                            i18n={i18n}
                            kcClsx={kcClsx}
                            messagesPerField={messagesPerField}
                            areTermsAccepted={areTermsAccepted}
                            onAreTermsAcceptedValueChange={setAreTermsAccepted}
                        />
                    )}
                    {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                        <div className="form-group">
                            <div className={kcClsx("kcInputWrapperClass")}>
                                <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                            </div>
                        </div>
                    )}
                    <div
                        // className={kcClsx("kcFormGroupClass")}
                        className="flex flex-col-reverse gap-3"
                    >
                        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                            <div
                                // className={kcClsx("kcFormOptionsWrapperClass")}
                                className="flex flex-col items-center"
                            >
                                <FieldDescription>
                                    {msgStr("loginAccountTitle")}
                                    {"? "}
                                    <a href={url.loginUrl}>
                                        {msgStr("backToLogin").startsWith("&laquo;") ? (
                                            <>{msgStr("backToLogin").replace("&laquo; ", "")}</>
                                        ) : (
                                            msg("backToLogin")
                                        )}
                                    </a>
                                </FieldDescription>
                            </div>
                        </div>

                        {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                            <div
                                id="kc-form-buttons"
                                // className={kcClsx("kcFormButtonsClass")}
                                className="flex flex-col"
                            >
                                <Button
                                    className={clsx(
                                        kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                        "g-recaptcha"
                                    )}
                                    data-sitekey={recaptchaSiteKey}
                                    data-callback="onSubmitRecaptcha"
                                    data-action={recaptchaAction}
                                    type="submit"
                                >
                                    {msg("doRegister")}
                                </Button>
                            </div>
                        ) : (
                            <div
                                id="kc-form-buttons"
                                // className={kcClsx("kcFormButtonsClass")}
                                className="flex flex-col"
                            >
                                <Button
                                    variant="default"
                                    disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                                    className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                                    type="submit"
                                    //value={msgStr("doRegister")}
                                >
                                    {msgStr("doRegister")}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg, msgStr } = i18n;

    return (
        <Field orientation="horizontal" className={messagesPerField.existsError("termsAccepted") ? "text-destructive" : ""}>
            <Checkbox
                id="termsAccepted"
                name="termsAccepted"
                className={kcClsx("kcCheckboxInputClass")}
                checked={areTermsAccepted}
                onCheckedChange={checked => onAreTermsAcceptedValueChange(checked === true)}
                aria-invalid={messagesPerField.existsError("termsAccepted")}
            />
            <FieldContent>
                <FieldLabel htmlFor="termsAccepted" className={kcClsx("kcLabelClass")}>
                    {msg("acceptTerms")}
                </FieldLabel>
                {messagesPerField.existsError("termsAccepted") && (
                    <FieldError className={kcClsx("kcLabelWrapperClass")}>
                        <span
                            id="input-error-terms-accepted"
                            className={kcClsx("kcInputErrorMessageClass")}
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </FieldError>
                )}
                <FieldDescription
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(`${msgStr("termsTitle")} ${msgStr("termsText")}`)
                    }}
                ></FieldDescription>
            </FieldContent>
        </Field>
    );
}
