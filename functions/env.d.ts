export { };

declare global {
  export const env: {
    readonly REDIS_URL: string;
    readonly REDIS_TOKEN: string;
    readonly AUTH_TOKEN: string
  };
}
