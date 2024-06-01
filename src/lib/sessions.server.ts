import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import jwt, { type JwtPayload } from 'jsonwebtoken';
interface Session {
	balance: number;
	lastUpdate: number;
}

export function createToken(payload: Object) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch (error) {
		return null;
	}
}

const sessions: Record<string, Session> = {};
export const setSession = (id: string, session: Session) => {
	sessions[id] = session;
};

export const getSession = (id: string) => {
	return sessions[id];
};

export const deleteSession = (id: string) => {
	delete sessions[id];
};

export const extractSession = (cookies: Cookies) => {
	const token = cookies.get('token');
	if (!token) return null;

	const verifiedToken = verifyToken(token);
	if (!verifiedToken) return null;
	if (!verifiedToken.sub) return null;

	const sessionData = getSession(verifiedToken.sub);
	return sessionData;
};

// Every 5 minutes, delete sessions that haven't been updated in the last 10 minutes
const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = FIVE_MINUTES * 2;

setInterval(() => {
	const now = Date.now();
	for (const id of Object.keys(sessions)) {
		const session = sessions[id];
		if (now - session.lastUpdate > TEN_MINUTES) {
			deleteSession(id);
		}
	}
}, FIVE_MINUTES);
