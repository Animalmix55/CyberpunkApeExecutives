/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStyletron } from 'styletron-react';
import TokenDisplay from '../atoms/TokenDisplay';
import { useContractContext } from '../contexts/ContractContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useHeldTokens from '../hooks/useHeldTokens';
import { IERC721Metadata } from '../models/IERC721Metadata';
import ClassNameBuilder from '../utilties/ClassNameBuilder';

interface Props {
    selectedTokens: number[];
    tokens: number[];
    contract?: IERC721Metadata;
    onChange: (selection: number[]) => void;
    className?: string;
}

export const HeldTokenGrid = (
    props: Omit<Omit<Props, 'tokens'>, 'contract'>
): JSX.Element => {
    const { tokenContract } = useContractContext();
    const { ids } = useHeldTokens(tokenContract);

    return <TokenGrid {...props} contract={tokenContract} tokens={ids} />;
};

export const TokenGrid = (props: Props): JSX.Element => {
    const {
        onChange,
        selectedTokens,
        contract,
        className,
        tokens: ids,
    } = props;

    const onClickItem = React.useCallback(
        (id: number, selected: boolean) => {
            if (selected) onChange([...selectedTokens, id]);
            else onChange(selectedTokens.filter((t) => t !== id));
        },
        [onChange, selectedTokens]
    );

    const [css] = useStyletron();
    const theme = useThemeContext();

    const items = React.useMemo(
        () =>
            ids.map((id) => (
                <TokenDisplay
                    key={id}
                    id={id}
                    className={css({ margin: '10px' })}
                    contract={contract}
                    onClick={onClickItem}
                    selected={selectedTokens.includes(id)}
                />
            )),
        [contract, css, ids, onClickItem, selectedTokens]
    );

    React.useEffect(() => {
        onChange(selectedTokens);
        return (): void => onChange([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={ClassNameBuilder(
                className,
                css({
                    display: 'flex',
                    flexGrow: 1,
                    alignSelf: 'start',
                    flexWrap: 'wrap',
                    margin: '20px',
                    justifyContent: 'start',
                })
            )}
        >
            {items}
            {items.length === 0 && (
                <div
                    className={css({
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    })}
                >
                    <h1
                        className={css({
                            color: theme.fontColors.normal.secondary.getCSSColor(
                                1
                            ),
                        })}
                    >
                        No Tokens to Display
                    </h1>
                </div>
            )}
        </div>
    );
};

export default TokenGrid;
