import { Spinner, SpinnerSize } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../contexts/ThemeContext';
import useTokenDetails from '../hooks/useTokenDetails';
import { IERC721Metadata } from '../models/IERC721Metadata';
import ClassNameBuilder from '../utilties/ClassNameBuilder';
import { MOBILE, MOUSE } from '../utilties/MediaQueries';
import TokenDetails from './TokenDetails';
import { TooltipHost } from './Tooltip';

interface Props {
    id: number;
    selected?: boolean;
    onClick?: (id: number, selected: boolean) => void;
    contract?: IERC721Metadata;
    className?: string;
}
export const TokenDisplay = (props: Props): JSX.Element => {
    const { id, selected, onClick, contract, className } = props;
    const [css] = useStyletron();
    const meta = useTokenDetails(id, contract);
    const theme = useThemeContext();

    return (
        <TooltipHost content={meta && <TokenDetails meta={meta} />}>
            <div
                onClick={(): void => onClick?.(id, !selected)}
                role="button"
                tabIndex={0}
                onKeyDown={(e): void => {
                    if (e.key !== 'Enter') return;
                    onClick?.(id, !selected);
                }}
                className={ClassNameBuilder(
                    className,
                    css({
                        width: '300px',
                        padding: '10px',
                        backgroundColor:
                            theme.lighterBackgroundColor.getCSSColor(
                                selected ? 1 : 0.7
                            ),
                        borderRadius: '10px',
                        cursor: 'pointer',
                        ...(selected && {
                            boxShadow: '0px 0px 5px #fff',
                        }),
                        [MOUSE]: {
                            ':hover': {
                                boxShadow: '0px 0px 5px #fff',
                            },
                        },
                        [MOBILE]: {
                            width: 'auto',
                        },
                    })
                )}
            >
                {meta && (
                    <img
                        className={css({
                            height: 'auto',
                            width: '100%',
                            borderRadius: '10px',
                            overflow: 'hidden',
                        })}
                        src={meta?.image}
                        alt={`RooTroop token id #${id}`}
                    />
                )}
                {!meta && (
                    <div
                        className={css({
                            height: '300px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        })}
                    >
                        <Spinner size={SpinnerSize.large} />
                    </div>
                )}
                <div
                    className={css({
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '10px',
                        color: theme.fontColors.normal.primary.getCSSColor(1),
                    })}
                >
                    {meta && meta?.name}
                    {!meta && `Loading #${id}`}
                </div>
            </div>
        </TooltipHost>
    );
};

export default TokenDisplay;
