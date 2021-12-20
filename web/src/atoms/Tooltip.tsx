import { Icon, TooltipHost as FUITooltipHost } from '@fluentui/react';
import React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

interface Props {
    text: string | JSX.Element;
    className?: string;
}

export const TooltipHost = ({
    content,
    children,
    className,
}: {
    content?: string | JSX.Element | JSX.Element[];
    children?: React.ReactChild;
    className?: string;
}): JSX.Element => {
    const theme = useThemeContext();
    return (
        <FUITooltipHost
            hostClassName={className}
            styles={{
                root: {
                    cursor: 'pointer',
                },
            }}
            calloutProps={{
                styles: {
                    beakCurtain: {
                        boxShadow: '0px 0px 5px #fff',
                        backgroundColor: theme.backgroundColor.getCSSColor(1),
                    },
                    beak: {
                        boxShadow: '0px 0px 5px #fff',
                        backgroundColor: theme.backgroundColor.getCSSColor(1),
                    },
                    calloutMain: {
                        backgroundColor: theme.backgroundColor.getCSSColor(1),
                    },
                },
            }}
            tooltipProps={{
                styles: {
                    content: {
                        color: 'white',
                        fontFamily: theme.fontFamily,
                    },
                },
            }}
            content={content}
        >
            {children}
        </FUITooltipHost>
    );
};

export const Tooltip = (props: Props): JSX.Element => {
    const { text, className } = props;

    return (
        <TooltipHost content={text} className={className}>
            <Icon iconName="Info" />
        </TooltipHost>
    );
};

export default Tooltip;
