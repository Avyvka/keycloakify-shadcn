import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { AlertTriangle, CheckCircle2, GalleryVerticalEnd, Globe, Info, RefreshCcw, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className={clsx("bg-card grid min-h-svh sm:bg-muted", kcClsx("kcLoginClass"))}>
            <div className="flex flex-col py-6 sm:py-10">
                {/* Header */}
                <div className="flex items-center justify-center gap-2 md:justify-start px-6 sm:px-10">
                    <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                        <div id="kc-header-wrapper" className={kcClsx("kcHeaderWrapperClass")}>
                            <a href="#" className="flex items-center gap-2 font-medium">
                                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                {msg("loginTitleHtml", realm.displayNameHtml)}
                            </a>
                        </div>
                    </div>
                    <div className="ms-auto">
                        {enabledLanguages.length > 1 && (
                            <div className={kcClsx("kcLocaleMainClass")} id="kc-locale">
                                <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                    <div id="kc-locale-dropdown" className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    tabIndex={1}
                                                    id="kc-current-locale-link"
                                                    aria-label={msgStr("languages")}
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    aria-controls="language-switch1"
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <span className="capitalize">{currentLanguage.languageTag}</span>
                                                    <Globe />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                role="menu"
                                                tabIndex={-1}
                                                aria-labelledby="kc-current-locale-link"
                                                aria-activedescendant=""
                                                id="language-switch1"
                                                className={kcClsx("kcLocaleListClass")}
                                            >
                                                {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                                    <DropdownMenuItem key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                                        <a
                                                            role="menuitem"
                                                            id={`language-${i + 1}`}
                                                            className={kcClsx("kcLocaleItemClass")}
                                                            href={href}
                                                        >
                                                            {label}
                                                        </a>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Card */}
                <div className="flex flex-1 items-center justify-center py-6 sm:py-10">
                    <div className="w-full max-w-sm sm:max-w-md">
                        <Card className="overflow-hidden p-6 sm:p-8 shadow-none sm:shadow-sm border-0 sm:border">
                            <CardContent className={clsx("flex flex-col gap-6 p-0", kcClsx("kcFormCardClass"))}>
                                <header className={kcClsx("kcFormHeaderClass")}>
                                    {(() => {
                                        const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                            <div className="flex flex-col items-center gap-1 text-center">
                                                <h1 id="kc-page-title" className="text-2xl font-bold">
                                                    {headerNode}
                                                </h1>
                                            </div>
                                        ) : (
                                            <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                                <Button asChild variant="outline" className="flex justify-start">
                                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                                        <RefreshCcw className="h-2 w-2" />
                                                        {/*<div className="kc-login-tooltip">*/}
                                                        {/*    <i className={kcClsx("kcResetFlowIcon")}></i>*/}
                                                        {/*    <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>*/}
                                                        {/*</div>*/}
                                                        <label id="kc-attempted-username" className="hidden">
                                                            {auth.attemptedUsername}
                                                        </label>
                                                        <span>{auth.attemptedUsername}</span>
                                                    </a>
                                                </Button>
                                            </div>
                                        );

                                        if (displayRequiredFields) {
                                            return (
                                                <div className={kcClsx("kcContentWrapperClass")}>
                                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                                        {/*<span className="subtitle">*/}
                                                        {/*    <span className="required">*</span>*/}
                                                        {/*    {msg("requiredFields")}*/}
                                                        {/*</span>*/}
                                                        <div className="flex justify-end mb-3">
                                                            <div className="flex space-x-1 text-sm">
                                                                <span className="text-destructive">*</span>
                                                                {msg("requiredFields")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-10">{node}</div>
                                                </div>
                                            );
                                        }

                                        return node;
                                    })()}
                                </header>
                                <div id="kc-content">
                                    <div id="kc-content-wrapper" className="flex flex-col gap-6">
                                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                            <Alert
                                                className={clsx(
                                                    `alert-${message.type}`,
                                                    kcClsx("kcAlertClass"),
                                                    `pf-m-${message?.type === "error" ? "danger" : message.type}`,
                                                    message.type === "success" && "text-green-600 border-green-300",
                                                    message.type === "warning" && "text-yellow-600 border-yellow-300",
                                                    message.type === "error" && "text-red-600 border-red-300",
                                                    message.type === "info" && "text-sky-600 border-blue-300"
                                                )}
                                            >
                                                {/*<div className="pf-c-alert__icon">*/}
                                                {/*    {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}*/}
                                                {/*    {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}*/}
                                                {/*    {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}*/}
                                                {/*    {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}*/}
                                                {/*</div>*/}
                                                {message.type === "success" && <CheckCircle2 />}
                                                {message.type === "warning" && <AlertTriangle />}
                                                {message.type === "error" && <XCircle />}
                                                {message.type === "info" && <Info />}
                                                <AlertDescription>
                                                    <span
                                                        className={clsx(
                                                            kcClsx("kcAlertTitleClass"),
                                                            message.type === "success" && "text-green-600",
                                                            message.type === "warning" && "text-yellow-600",
                                                            message.type === "error" && "text-red-600",
                                                            message.type === "info" && "text-sky-600"
                                                        )}
                                                        dangerouslySetInnerHTML={{
                                                            __html: kcSanitize(message.summary)
                                                        }}
                                                    />
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        {children}
                                        {auth !== undefined && auth.showTryAnotherWayLink && (
                                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                                <div className={kcClsx("kcFormGroupClass")}>
                                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                                    <a
                                                        href="#"
                                                        id="try-another-way"
                                                        onClick={() => {
                                                            document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                                            return false;
                                                        }}
                                                    >
                                                        {msg("doTryAnotherWay")}
                                                    </a>
                                                </div>
                                            </form>
                                        )}
                                        {socialProvidersNode}
                                        {displayInfo && (
                                            <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                                <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                                    {infoNode}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
