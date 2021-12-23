export const FormatTimeOffset = (unixSeconds: number): string => {
    const seconds = Math.floor(unixSeconds % 60);
    const minutes = Math.floor(unixSeconds / 60) % 60;
    const hours = Math.floor(unixSeconds / 3600) % 24;
    const days = Math.floor(unixSeconds / (3600 * 24));

    const parts: string[] = [];
    if (days) parts.push(`${days} days`);
    if (hours) parts.push(`${hours} hours`);
    if (minutes) parts.push(`${minutes} minutes`);
    parts.push(`${seconds} seconds`);

    return parts.join(', ');
};

export default FormatTimeOffset;
