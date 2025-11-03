import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, skipLink } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div id="kc-error-message" className="flex flex-col gap-6">
                <p className="instruction text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                {!skipLink && client !== undefined && client.baseUrl !== undefined && (
                    <div>
                        <Button variant="ghost" asChild>
                            <a id="backToApplication" href={client.baseUrl}>
                                {msgStr("backToLogin").startsWith("&laquo;") ? (
                                    <>
                                        <MoveLeft />
                                        {msgStr("backToLogin").replace("&laquo;", "")}
                                    </>
                                ) : (
                                    msg("backToLogin")
                                )}
                            </a>
                        </Button>
                    </div>
                )}
            </div>
        </Template>
    );
}
