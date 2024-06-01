const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
const cardSuits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'] as const;

export type Card = { value: (typeof cardValues)[number]; suit: (typeof cardSuits)[number] };
export class Deck {
	private cards: Card[] = [];
	private pullCount = 0;

	public constructor() {
		this.cards = cardValues.flatMap((value) => cardSuits.map((suit) => ({ value, suit })));
		this.shuffle();
	}

	private shuffle() {
		this.pullCount = 0;
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	public getCard() {
		if (this.pullCount >= this.cards.length) {
			this.shuffle();
			this.pullCount = 0;
		}

		const card = this.cards[this.pullCount];
		this.pullCount += 1;
		return card;
	}
}

export function getCardValue(card: Card) {
	if (card.value === 'A') return 11;
	if (['K', 'Q', 'J'].includes(card.value)) return 10;

	return parseInt(card.value);
}

export function getHandValue(hand: Card[]) {
	let value = hand.map(getCardValue).reduce((a, b) => a + b, 0);
	let aces = hand.filter((card) => card.value === 'A').length;

	while (value > 21 && aces > 0) {
		value -= 10;
		aces -= 1;
	}

	return value;
}
