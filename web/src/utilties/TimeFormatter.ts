export const FormatTimeOffset = (unixSeconds: number): string => {
    const seconds = Math.floor(unixSeconds % 60);
    const minutes = Math.floor(unixSeconds / 60) % 60;
    const hours = Math.floor(unixSeconds / 3600) % 24;
    const days = Math.floor(unixSeconds / (3600 * 24));

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};

export default FormatTimeOffset;
