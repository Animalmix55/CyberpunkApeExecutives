/* eslint-disable react/jsx-props-no-spreading */
import { Icon, Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import Button, { ButtonType } from '../atoms/Button';
import TokenDisplay from '../atoms/TokenDisplay';
import { useContractContext } from '../contexts/ContractContext';
import { useThemeContext } from '../contexts/ThemeContext';
import useHeldTokens from '../hooks/useHeldTokens';
import { IERC721Metadata } from '../models/IERC721Metadata';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE } from '../utilties/MediaQueries';

interface Props {
    selectedTokens: number[];
    tokens: number[];
    contract?: IERC721Metadata;
    onChange: (selection: number[]) => void;
    className?: string;
    maxPerPage?: number;
}

export const HeldTokenGrid = (
    props: Omit<Omit<Props, 'tokens'>, 'contract'>
): JSX.Element => {
    const { tokenContract } = useContractContext();
    const { ids } = useHeldTokens(tokenContract);

    return <TokenGrid {...props} contract={tokenContract} tokens={ids} />;
};

export const UnmintedLegendsGrid = (
    props: Omit<Omit<Props, 'tokens'>, 'contract'>
): JSX.Element => {
    const { className } = props;
    const { legendsContract } = useContractContext();
    const [unminted, setUnminted] = React.useState<number[]>();

    React.useEffect(() => {
        if (!legendsContract) {
            setUnminted([]);
            return;
        }

        legendsContract.methods
            .unmintedTokens()
            .call()
            .then((ids) => setUnminted(ids.map(Number)));
    }, [legendsContract]);

    const [css] = useStyletron();

    if (!unminted) {
        return (
            <div
                className={ClassNameBuilder(
                    className,
                    css({
                        display: 'flex',
                        flexGrow: 1,
                        alignSelf: 'stretch',
                        flexWrap: 'wrap',
                        margin: '20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    })
                )}
            >
                <Spinner size={SpinnerSize.large} />
            </div>
        );
    }

    return (
        <TokenGrid {...props} contract={legendsContract} tokens={unminted} />
    );
};

const PaginationBar = ({
    numPages,
    pageNum,
    onChangePage,
}: {
    numPages: number;
    pageNum: number;
    onChangePage: (page: number) => void;
}): JSX.Element => {
    const [css] = useStyletron();

    const NumberButton = React.useCallback(
        // eslint-disable-next-line react/no-unused-prop-types
        ({ val }: { val: number }): JSX.Element => (
            <Button
                className={css({
                    margin: '3px',
                    [MOBILE]: { width: 'auto !important', padding: '10px' },
                })}
                buttonType={
                    val === pageNum ? ButtonType.primary : ButtonType.secondary
                }
                onClick={(): void => onChangePage(val)}
            >
                {val}
            </Button>
        ),
        [css, onChangePage, pageNum]
    );

    const theme = useThemeContext();

    const items = React.useMemo(() => {
        const allPages = Array.from(new Array(numPages)).map((_, i) => i + 1);
        const slice = allPages.slice(
            Math.max(1, pageNum - 3),
            Math.min(pageNum + 2, allPages.length - 1)
        );

        return [
            <NumberButton key={1} val={1} />,
            ...[
                Math.abs(pageNum - 1) <= 3 ? (
                    []
                ) : (
                    <Icon
                        iconName="More"
                        key="dots-1"
                        className={css({
                            margin: '3px',
                            color: theme.fontColors.normal.primary.getCSSColor(
                                1
                            ),
                        })}
                    />
                ),
            ],
            ...slice.map((v) => <NumberButton key={v} val={v} />),
            ...[
                Math.abs(pageNum - allPages.length) <= 3 ? (
                    []
                ) : (
                    <Icon
                        iconName="More"
                        key="dots-2"
                        className={css({
                            margin: '3px',
                            color: theme.fontColors.normal.primary.getCSSColor(
                                1
                            ),
                        })}
                    />
                ),
            ],
            <NumberButton key={allPages.length} val={allPages.length} />,
        ];
    }, [NumberButton, css, numPages, pageNum, theme.fontColors.normal.primary]);

    if (numPages <= 1) return <></>;

    return (
        <div
            className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            })}
        >
            {items}
        </div>
    );
};

export const TokenGrid = (props: Props): JSX.Element => {
    const {
        onChange,
        selectedTokens,
        contract,
        className,
        tokens: ids,
        maxPerPage,
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
    const [pageNum, setPageNum] = React.useState(1);

    const numPages = React.useMemo(
        () => Math.ceil(ids.length / (maxPerPage || 15)),
        [ids.length, maxPerPage]
    );

    const paginatedIds = React.useMemo(() => {
        const start = (pageNum - 1) * (maxPerPage || 15);
        const end = pageNum * (maxPerPage || 15);

        return ids.slice(start, end);
    }, [ids, maxPerPage, pageNum]);

    const items = React.useMemo(
        () =>
            paginatedIds.map((id) => (
                <TokenDisplay
                    key={id}
                    id={id}
                    className={css({ margin: '10px' })}
                    contract={contract}
                    onClick={onClickItem}
                    selected={selectedTokens.includes(id)}
                />
            )),
        [contract, css, paginatedIds, onClickItem, selectedTokens]
    );

    React.useEffect(() => {
        onChange(selectedTokens);
        return (): void => onChange([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={css({ margin: '20px' })}>
            <div>
                <PaginationBar
                    numPages={numPages}
                    pageNum={pageNum}
                    onChangePage={setPageNum}
                />
            </div>
            <div
                className={ClassNameBuilder(
                    className,
                    css({
                        display: 'flex',
                        flexGrow: 1,
                        alignSelf: 'start',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
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
            <div>
                <PaginationBar
                    numPages={numPages}
                    pageNum={pageNum}
                    onChangePage={setPageNum}
                />
            </div>
        </div>
    );
};

export default TokenGrid;
