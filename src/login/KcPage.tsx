import { lazy, Suspense } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "@/login/Template";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faBitbucket,
    faFacebook,
    faGithub,
    faGitlab,
    faGoogle,
    faInstagram,
    faLinkedin,
    faMicrosoft,
    faPaypal,
    faStackOverflow,
    faTwitter
} from "@fortawesome/free-brands-svg-icons";

library.add(
    faGoogle,
    faMicrosoft,
    faFacebook,
    faInstagram,
    faTwitter,
    faLinkedin,
    faStackOverflow,
    faGithub,
    faGitlab,
    faBitbucket,
    faPaypal
);

const UserProfileFormFields = lazy(() => import("@/login/UserProfileFormFields"));
const Error = lazy(() => import("@/login/pages/Error"));
const Login = lazy(() => import("@/login/pages/Login"));
const LogoutConfirm = lazy(() => import("@/login/pages/LogoutConfirm"));
const Register = lazy(() => import("@/login/pages/Register"));
const Terms = lazy(() => import("@/login/pages/Terms"));

const doMakeUserConfirmPassword = true;
const doUseDefaultCss = false;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "error.ftl":
                        return (
                            <Error
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "logout-confirm.ftl":
                        return (
                            <LogoutConfirm
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "terms.ftl":
                        return (
                            <Terms
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={doUseDefaultCss}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
