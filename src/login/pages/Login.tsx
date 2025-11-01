import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Field, FieldDescription, FieldError, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <FieldDescription className="text-center">
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl} className="underline underline-offset-4">
                                {msg("doRegister")}
                            </a>
                        </FieldDescription>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <>
                            <FieldSeparator>{msg("identity-provider-login-label")}</FieldSeparator>
                            <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                                {/*<hr />*/}
                                {/*<h2>{msg("identity-provider-login-label")}</h2>*/}
                                <ul
                                    // className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}
                                    className="flex flex-col gap-2"
                                >
                                    {social.providers.map((...[p, , providers]) => (
                                        <li key={p.alias}>
                                            <Field>
                                                <Button variant="outline" type="button" asChild>
                                                    <a
                                                        id={`social-${p.alias}`}
                                                        className={kcClsx(
                                                            "kcFormSocialAccountListButtonClass",
                                                            providers.length > 3 && "kcFormSocialAccountGridItem"
                                                        )}
                                                        type="button"
                                                        href={p.loginUrl}
                                                    >
                                                        {p.iconClasses && (
                                                            <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>
                                                        )}
                                                        <span
                                                            className={clsx(
                                                                kcClsx("kcFormSocialAccountNameClass"),
                                                                p.iconClasses && "kc-social-icon-text"
                                                            )}
                                                            dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                                        ></span>
                                                    </a>
                                                </Button>
                                            </Field>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                            className="flex flex-col gap-6"
                        >
                            {!usernameHidden && (
                                <Field
                                    // className={kcClsx("kcFormGroupClass")}
                                    className={messagesPerField.existsError("username", "password") ? "text-destructive" : ""}
                                >
                                    <FieldLabel htmlFor="username" className={kcClsx("kcLabelClass")}>
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </FieldLabel>
                                    <Input
                                        tabIndex={2}
                                        id="username"
                                        className={kcClsx("kcInputClass")}
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        autoFocus
                                        autoComplete="username"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                    {messagesPerField.existsError("username", "password") && (
                                        <FieldError
                                            id="input-error"
                                            className={kcClsx("kcInputErrorMessageClass")}
                                            aria-live="polite"
                                            // dangerouslySetInnerHTML={{
                                            //     __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            // }}
                                            errors={[
                                                {
                                                    message: messagesPerField.getFirstError("username", "password")
                                                }
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}

                            <Field
                                // className={kcClsx("kcFormGroupClass")}
                                className={messagesPerField.existsError("username", "password") ? "text-destructive" : ""}
                            >
                                <FieldLabel htmlFor="password" className={kcClsx("kcLabelClass")}>
                                    {msg("password")}
                                </FieldLabel>
                                <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                    <InputGroupInput
                                        tabIndex={3}
                                        id="password"
                                        className={kcClsx("kcInputClass")}
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                </PasswordWrapper>
                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <FieldError
                                        id="input-error"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        // dangerouslySetInnerHTML={{
                                        //     __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        // }}
                                        errors={[
                                            {
                                                message: messagesPerField.getFirstError("username", "password")
                                            }
                                        ]}
                                    />
                                )}
                            </Field>

                            {(realm.rememberMe || realm.resetPasswordAllowed) && (
                                <div
                                    //className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}
                                    className="flex items-center"
                                >
                                    <div id="kc-form-options">
                                        {realm.rememberMe && !usernameHidden && (
                                            <Field
                                                // className="checkbox"
                                                orientation="horizontal"
                                            >
                                                <Checkbox
                                                    tabIndex={5}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    // type="checkbox"
                                                    defaultChecked={!!login.rememberMe}
                                                />
                                                <FieldLabel htmlFor="rememberMe"> {msg("rememberMe")}</FieldLabel>
                                            </Field>
                                        )}
                                    </div>
                                    <div
                                        //className={kcClsx("kcFormOptionsWrapperClass")}
                                        className="ms-auto"
                                    >
                                        {realm.resetPasswordAllowed && (
                                            <span>
                                                <a
                                                    tabIndex={6}
                                                    href={url.loginResetCredentialsUrl}
                                                    className="ml-auto text-sm underline-offset-4 hover:underline"
                                                >
                                                    {msg("doForgotPassword")}
                                                </a>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Field id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                >
                                    {msgStr("doLogIn")}
                                </Button>
                            </Field>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <InputGroup
            // className={kcClsx("kcInputGroup")}
            className="flex"
        >
            {children}
            <InputGroupAddon className="text-current" align="inline-end">
                <InputGroupButton
                    type="button"
                    className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                    aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                    aria-controls={passwordInputId}
                    onClick={toggleIsPasswordRevealed}
                >
                    {/*<i className={kcClsx(isPasswordRevealed ? "kcFormPasswordVisibilityIconHide" : "kcFormPasswordVisibilityIconShow")} aria-hidden />*/}
                    <div>{isPasswordRevealed ? <EyeOff /> : <Eye />}</div>
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}
