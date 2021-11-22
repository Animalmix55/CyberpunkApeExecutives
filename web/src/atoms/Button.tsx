/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStyletron } from 'styletron-react';
import {
    RGB,
    ThemeContextType,
    useThemeContext,
} from '../contexts/ThemeContext';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE } from '../utilties/MediaQueries';

export enum ButtonType {
    primary,
    secondary,
    clear,
    wireframe,
}

const getButtonColors = (
    type: ButtonType,
    theme: ThemeContextType
): {
    normal?: RGB;
    hovered?: RGB;
    textColor?: RGB;
    hoveredTextColor?: RGB;
    borderColor?: RGB;
    hoveredBorderColor?: RGB;
    disabledColor?: RGB;
} => {
    switch (type) {
        case ButtonType.clear:
            return {
                textColor: theme.fontColors.normal.primary,
                hoveredTextColor: theme.fontColors.hovered.primary,
            };
        case ButtonType.wireframe:
            return {
                textColor: theme.fontColors.normal.primary,
                hoveredTextColor: theme.fontColors.hovered.primary,
                borderColor: theme.fontColors.normal.primary,
                hoveredBorderColor: theme.fontColors.hovered.primary,
            };
        default:
        case ButtonType.primary:
            return {
                normal: theme.buttonColors.normal.primary,
                hovered: theme.buttonColors.hovered.primary,
                textColor: theme.fontColors.normal.primary,
                hoveredTextColor: theme.fontColors.hovered.primary,
                disabledColor: theme.buttonColors.normal.disabled,
            };
        case ButtonType.secondary:
            return {
                normal: theme.buttonColors.normal.secondary,
                hovered: theme.buttonColors.hovered.secondary,
                hoveredTextColor: theme.fontColors.hovered.secondary,
                disabledColor: theme.buttonColors.normal.disabled,
                textColor: theme.fontColors.normal.primary,
            };
    }
};

export const Button = (
    props: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > & { buttonType: ButtonType }
): JSX.Element => {
    const { buttonType } = props;
    const theme = useThemeContext();
    const [css] = useStyletron();

    const {
        hovered,
        normal,
        textColor,
        borderColor,
        hoveredBorderColor,
        hoveredTextColor,
        disabledColor,
    } = React.useMemo(
        () => getButtonColors(buttonType, theme),
        [buttonType, theme]
    );

    return (
        <button
            {...props}
            className={ClassNameBuilder(
                props.className,
                css({
                    [MOBILE]: {
                        width: '100%',
                    },
                    borderColor: borderColor?.getCSSColor(1) || 'transparent',
                    borderWidth: borderColor ? '2px' : undefined,
                    color: textColor?.getCSSColor(1) || undefined,
                    borderStyle: 'solid',
                    backgroundColor: normal?.getCSSColor(1) || 'transparent',
                    cursor: 'pointer',
                    fontSize: '120%',
                    fontFamily: theme.fontFamily,
                    fontWeight: 'bold',
                    ':hover:not(:disabled)': {
                        backgroundColor:
                            hovered?.getCSSColor(1) || 'transparent',
                        borderColor:
                            hoveredBorderColor?.getCSSColor(1) || 'transparent',
                        color:
                            hoveredTextColor?.getCSSColor(1) || 'transparent',
                    },
                    ':disabled': {
                        backgroundColor:
                            disabledColor?.getCSSColor(1) || 'transparent',
                        borderColor:
                            disabledColor?.getCSSColor(1) || 'transparent',
                        color: textColor?.getCSSColor(0.7) || 'transparent',
                        cursor: 'not-allowed',
                    },
                })
            )}
        />
    );
};

export default Button;
