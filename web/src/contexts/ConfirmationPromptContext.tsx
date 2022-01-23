import React from 'react';
import ConfirmationModal from '../molecules/ConfirmationModal';

export type ConfirmationContextType = (
    title: string,
    body?: string,
    confirmationButtonText?: string,
    rejectionButtonText?: string
) => Promise<boolean>;

export const ConfirmationContext = React.createContext<ConfirmationContextType>(
    () => Promise.resolve(true)
);

export const useConfirmationContext = (): ConfirmationContextType =>
    React.useContext(ConfirmationContext);

export const ConfirmationContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [respond, setRespond] = React.useState<(v: boolean) => void>();
    const [title, setTitle] = React.useState<string>();
    const [body, setBody] = React.useState<string>();
    const [confText, setConfText] = React.useState<string>();
    const [rejText, setRejText] = React.useState<string>();

    const getConfirmation = React.useCallback<ConfirmationContextType>(
        (
            title,
            body,
            confirmationButtonText,
            rejectionButtonText
        ): Promise<boolean> => {
            respond?.(false); // rej old
            const promise = new Promise<boolean>((res) => {
                setRespond(() => (v: boolean): void => {
                    res(v);
                    setRespond(undefined);
                });
            });

            setTitle(title);
            setBody(body);
            setConfText(confirmationButtonText);
            setRejText(rejectionButtonText);

            return promise;
        },
        [respond]
    );

    return (
        <ConfirmationContext.Provider value={getConfirmation}>
            {respond && (
                <ConfirmationModal
                    title={title || ''}
                    confirmButtonText={confText}
                    rejectButtonText={rejText}
                    body={body}
                    onRepond={respond}
                />
            )}
            {children}
        </ConfirmationContext.Provider>
    );
};
