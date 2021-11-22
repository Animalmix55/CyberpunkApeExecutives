export const ClassNameBuilder = (
    ...classNames: (undefined | string)[]
): string => {
    return classNames.filter((c) => !!c).join(' ');
};

export default ClassNameBuilder;
