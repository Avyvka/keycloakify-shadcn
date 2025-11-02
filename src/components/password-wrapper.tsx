import type { JSX } from "keycloakify/tools/JSX";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { I18n } from "@/login/i18n";
import { Eye, EyeOff } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton
} from "@/components/ui/input-group";

export function PasswordWrapper(props: {
    kcClsx: KcClsx;
    i18n: I18n;
    passwordInputId: string;
    children: JSX.Element;
}) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId
    });

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
                    aria-label={msgStr(
                        isPasswordRevealed ? "hidePassword" : "showPassword"
                    )}
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
