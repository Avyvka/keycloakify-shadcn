import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Field, FieldDescription, FieldSet } from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <FieldSet>
                <FieldDescription id="kc-terms-text">{msg("termsText")}</FieldDescription>
                <form className="form-actions" action={url.loginAction} method="POST">
                    <Field orientation="horizontal">
                        <Button
                            className={kcClsx("kcButtonClass", "kcButtonClass", "kcButtonClass", "kcButtonPrimaryClass", "kcButtonLargeClass")}
                            name="accept"
                            id="kc-accept"
                            type="submit"
                            // value={msgStr("doAccept")}
                        >
                            {msgStr("doAccept")}
                        </Button>
                        <Button
                            variant="secondary"
                            className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                            name="cancel"
                            id="kc-decline"
                            type="submit"
                            // value={msgStr("doDecline")}
                        >
                            {msgStr("doDecline")}
                        </Button>
                    </Field>
                </form>
                {/*<div className="clearfix" />*/}
            </FieldSet>
        </Template>
    );
}
