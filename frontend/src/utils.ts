export const format_ago = (from: string | undefined): string => {
    if (!from) {
        return "no data";
    }

    const TIME_ZERO = "0001-01-01T00:00:00Z";
    if (from == TIME_ZERO) {
        return "forever";
    }
    const values: string[] = [];

    const format = (): string => {
        return values.slice(0, 2).join(" ");
    };

    let x = Date.now() - new Date(from).getTime();

    x = Math.floor(x / 1000);

    values.unshift(`${x % 60}s`);
    x = Math.floor(x / 60);
    if (x == 0) {
        return format();
    }

    values.unshift(`${x % 60}m`);
    x = Math.floor(x / 60);
    if (x == 0) {
        return format();
    }

    values.unshift(`${x % 24}h`);
    x = Math.floor(x / 24);
    if (x == 0) {
        return format();
    }

    values.unshift(`${x}d`);
    return format();
};
