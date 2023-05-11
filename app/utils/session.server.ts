import bcrypt from "bcryptjs";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

type LoginForm = {
  username: string;
  password: string;
};

export async function getUserByUsername(username: string) {
  return await db.user.findUnique({
    where: {
      username
    }
  });
}

export async function login({ username, password }: LoginForm) {
  const user = await getUserByUsername(username);

  if(!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) {
    return null;
  }

  return {
    id: user.id,
    username
  }
}

export async function register({ username, password }: LoginForm) {
  const existedUser = await getUserByUsername(username);

  if (existedUser) return null;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      username,
      passwordHash
    }
  });

  return { userId: user.id, username };
}

export const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  return !userId || typeof userId !== "string" ? null : userId;
}

export async function requireUserId(request: Request, redirectTo = new URL(request.url).pathname) {
  const userId = await getUserId(request);

  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (!userId || typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true
      }
    });

    return user;
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);

  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}