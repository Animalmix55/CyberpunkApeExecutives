import React from 'react';
import { useStyletron } from 'styletron-react';
import { useThemeContext } from '../contexts/ThemeContext';
import { ERC721Meta } from '../models/Meta';

interface Props {
    meta: ERC721Meta;
}

interface MetaCellProps {
    attribute: ERC721Meta['attributes'][number];
}

const MetaCell = (props: MetaCellProps): JSX.Element => {
    const { attribute } = props;
    const { trait_type: trait, value } = attribute;

    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                borderRadius: '10px',
                overflow: 'hidden',
                padding: '10px 40px 10px 40px',
                margin: '5px',
                flexGrow: 1,
                backgroundColor: theme.lighterBackgroundColor.getCSSColor(1),
            })}
        >
            <h2
                className={css({
                    margin: '0px 0px 10px 0px',
                    textAlign: 'center',
                    color: theme.fontColors.normal.secondary.getCSSColor(1),
                })}
            >
                {trait}
            </h2>
            <div className={css({ display: 'flex', justifyContent: 'center' })}>
                {value}
            </div>
        </div>
    );
};

export const TokenDetails = (props: Props): JSX.Element => {
    const { meta } = props;
    const [css] = useStyletron();

    const cells = React.useMemo(
        () =>
            meta.attributes.map((m) => (
                <MetaCell key={m.trait_type} attribute={m} />
            )),
        [meta.attributes]
    );

    return (
        <div
            className={css({
                padding: '10px',
                display: 'flex',
                borderRadius: '10px',
                flexWrap: 'wrap',
            })}
        >
            {cells}
        </div>
    );
};

export default TokenDetails;
