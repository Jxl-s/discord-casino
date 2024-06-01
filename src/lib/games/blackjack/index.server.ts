import { Deck, type Card } from './deck';
import { v4 as uuidv4 } from 'uuid';

interface BlackjackSessions {
	userId: string;
	deck: Deck;
	playerHand: Card[];
	dealerHand: Card[];
}

export const blackjackSessions: Record<string, BlackjackSessions> = {};

export function createBlackjackSession(userId: string) {
	const deck = new Deck();

	const playerHand: Card[] = [];
	const dealerHand: Card[] = [];

	blackjackSessions[userId] = { userId, deck, playerHand, dealerHand };
	return blackjackSessions[userId];
}
