import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
interface Session {
	balance: number;
	lastUpdate: number;
}

export function createToken(payload: Object) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET);
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
