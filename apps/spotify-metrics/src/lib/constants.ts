export const tokenEndpoint = 'https://accounts.spotify.com/api/token';
export const key = 'AUTH_STATE';
export const accessTokenKey = 'ACCESS_TOKEN';
export const refreshTokenKey = 'REFRESH_TOKEN_KEY';
export const scope = 'user-library-read';
export const redirectUri = process.env.REDIRECT_URI as string;
export const clientId = process.env.CLIENT_ID as string;
export const clientSecret = process.env.CLIENT_SECRET as string;
export const token = Buffer.from(`${clientId}:${clientSecret}`).toString(
  'base64',
);
