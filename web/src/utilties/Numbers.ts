import BigDecimal from 'js-big-decimal';

export const BASE = new BigDecimal(1e18);
export const ZERO = new BigDecimal(0);

export const roundAndDisplay = (number: BigDecimal, decimals = 5): string => {
    const string = number.round(5).getValue();

    return string.replace(/(0+|\.0+)$/g, '');
};
