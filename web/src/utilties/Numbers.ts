import BigDecimal from 'js-big-decimal';

export const BASE = new BigDecimal(1e18);
export const ZERO = new BigDecimal(0);
export const MAXUINT256 = new BigDecimal(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935'
);

export const roundAndDisplay = (number: BigDecimal, decimals = 5): string => {
    const string = number.round(5).getValue();

    return string.replace(/(0+|\.0+)$/g, '');
};
