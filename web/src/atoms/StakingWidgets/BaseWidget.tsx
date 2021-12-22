import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../../contexts/ThemeContext';
import ClassNameBuilder from '../../utilties/ClassNameBuilder';

export const BaseWidget = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    const theme = useThemeContext();
    const [css] = useStyletron();

    return (
        <div
            className={ClassNameBuilder(
                className,
                css({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: `1px solid ${theme.fontColors.normal.primary.getCSSColor(
                        1
                    )}`,
                    borderRadius: '10px',
                    padding: '10px',
                    flexWrap: 'wrap',
                })
            )}
        >
            {children}
        </div>
    );
};

export default BaseWidget;
