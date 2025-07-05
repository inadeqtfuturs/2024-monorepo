import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
};

const key = 'AUTH_STATE';
const scope = 'user-library-read';
const redirectUri = process.env.REDIRECT_URI as string;
const clientId = process.env.CLIENT_ID as string;

export async function GET(request: Request) {
  const cookieStore = await cookies();

  const state = generateRandomString(16);
  cookieStore.set(key, state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  }).toString();

  redirect(`https://accounts.spotify.com/authorize?${params}`);
}
