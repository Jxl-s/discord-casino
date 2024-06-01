import { Deck, type Card } from './deck';
import { v4 as uuidv4 } from 'uuid';

interface BlackjackSessions {
	userId: string;
	amount: number;
	deck: Deck;
	playerHand: Card[];
	dealerHand: Card[];
	started: boolean;
}

export const blackjackSessions: Record<string, BlackjackSessions> = {};

export function createBlackjackSession(userId: string) {
	const deck = new Deck();

	const playerHand: Card[] = [];
	const dealerHand: Card[] = [];

	blackjackSessions[userId] = { userId, deck, playerHand, dealerHand, amount: 0, started: false };
	return blackjackSessions[userId];
}

export function getBlackjackSession(userId: string) {
	return blackjackSessions[userId];
}
