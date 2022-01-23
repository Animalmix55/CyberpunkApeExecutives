import React from 'react';
import { useStyletron } from 'styletron-react';
import Button, { ButtonType } from '../atoms/Button';
import ModalBase from '../atoms/ModalBase';

interface Props {
    title: string;
    body?: string;
    confirmButtonText?: string;
    rejectButtonText?: string;
    onRepond?: (confirm: boolean) => void;
}
export const ConfirmationModal = (props: Props): JSX.Element => {
    const { title, body, confirmButtonText, rejectButtonText, onRepond } =
        props;

    const [css] = useStyletron();

    return (
        <ModalBase isOpen>
            <h1 className={css({ textAlign: 'center' })}>{title}</h1>
            {body && (
                <div className={css({ margin: '10px', maxWidth: '300px' })}>
                    {body}
                </div>
            )}
            <div className={css({ display: 'flex' })}>
                <Button
                    buttonType={ButtonType.primary}
                    onClick={(): void => onRepond?.(true)}
                    className={css({
                        height: '60px',
                        margin: '10px',
                        padding: '0px 20px 0px 20px',
                    })}
                >
                    {confirmButtonText ?? 'Yes'}
                </Button>
                <Button
                    buttonType={ButtonType.primary}
                    onClick={(): void => onRepond?.(false)}
                    className={css({
                        height: '60px',
                        margin: '10px',
                        padding: '0px 20px 0px 20px',
                    })}
                >
                    {rejectButtonText ?? 'No'}
                </Button>
            </div>
        </ModalBase>
    );
};

export default ConfirmationModal;
