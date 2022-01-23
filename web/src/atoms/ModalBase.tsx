import { Modal } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../contexts/ThemeContext';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE } from '../utilties/MediaQueries';

export const ModalBase = ({
    children,
    className,
    isOpen,
}: {
    children: React.ReactNode;
    className?: string;
    isOpen?: boolean;
}): JSX.Element => {
    const theme = useThemeContext();
    const [css] = useStyletron();

    return (
        <Modal
            isOpen={isOpen}
            styles={{
                main: {
                    borderRadius: '10px',
                    padding: '10px',
                    color: theme.fontColors.normal.primary.getCSSColor(1),
                    backgroundColor:
                        theme.lighterBackgroundColor.getCSSColor(1),
                },
            }}
        >
            <div
                className={ClassNameBuilder(
                    className,
                    css({
                        minWidth: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'auto',
                        [MOBILE]: {
                            minWidth: 'unset',
                        },
                    })
                )}
            >
                {children}
            </div>
        </Modal>
    );
};

export default ModalBase;
