'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { UserSession } from './definitions';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export const protectedAuth = () => {
  const authCookie = cookies().get('auth_token')?.value || '';
  const authToken = parse(authCookie).token;
  if (authToken) {
    return redirect('/main');
  }
};

export const protectedPage = () => {
  const authCookie = cookies().get('auth_token')?.value || '';
  const authToken = parse(authCookie).token;
  if (!authToken) {
    return redirect('/auth/login');
  }
  // Check for session expiration
  const userSession = getUserSession();
  if (!userSession || userSession.iat >= userSession.exp) {
    // redirect to login page
    return redirect('/auth/login');
  }
};

export const getUserSession = (): UserSession | null => {
  const authCookie = cookies().get('auth_token')?.value || '';
  // const authCookie = req.cookies.get('auth_token')?.value || '';
  const authToken = parse(authCookie).token;
  if (!authToken) {
    return null;
  }

  const secret = process.env.JWT_SECRET || '';
  const userSession = jwt.verify(authToken, secret) as UserSession;

  return userSession;
};
