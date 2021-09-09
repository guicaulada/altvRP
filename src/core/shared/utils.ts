export const delay = (t: number): Promise<number> => new Promise((resolve) => setTimeout(resolve, t));
