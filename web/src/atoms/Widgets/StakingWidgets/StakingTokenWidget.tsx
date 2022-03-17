import { Dropdown, IDropdownOption } from '@fluentui/react';
import React from 'react';
import { useStyletron } from 'styletron-react';
import { useStakingToken } from '../../../contexts/StakingTokenContext';
import { useThemeContext } from '../../../contexts/ThemeContext';
import BaseWidget from '../BaseWidget';

interface Props {
    className?: string;
}

export const StakingTokenWidget = (props: Props): JSX.Element => {
    const { className } = props;

    const {
        options: tokenOptions,
        tokenAddress,
        setTokenAddress,
    } = useStakingToken();
    const [css] = useStyletron();
    const theme = useThemeContext();

    const options = React.useMemo((): IDropdownOption[] => {
        return Object.keys(tokenOptions).map((address) => ({
            text: tokenOptions[address].shortName,
            id: address,
            key: address,
        }));
    }, [tokenOptions]);

    const onChange = React.useCallback(
        (
            _: React.FormEvent<HTMLDivElement>,
            option?: IDropdownOption<never> | undefined
        ): void => {
            if (!option) {
                setTokenAddress(undefined);
                return;
            }

            const { key } = option;
            setTokenAddress(String(key));
        },
        [setTokenAddress]
    );

    return (
        <BaseWidget className={className}>
            <h2
                className={css({
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                    margin: '0px 0px 10px 0px',
                })}
            >
                Staking Token
            </h2>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                })}
            >
                <Dropdown
                    options={options}
                    styles={{
                        title: {
                            background: 'unset',
                            color: `${theme.fontColors.normal.primary.getCSSColor(
                                1
                            )} !important`,
                            fontFamily: theme.fontFamily,
                            fontWeight: 'bold',
                        },
                    }}
                    selectedKey={tokenAddress}
                    onChange={onChange}
                />
            </div>
        </BaseWidget>
    );
};

export default StakingTokenWidget;
