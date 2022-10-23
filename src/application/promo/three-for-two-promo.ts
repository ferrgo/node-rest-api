import { CartItem } from '../cart/cart-item';
import { Promo } from './promo.model';

export class ThreeForTwoPromo implements Promo {
	constructor(public readonly name: string = 'GET_THREE_FOR_TWO') {}
	public getDiscount(items: Map<string, CartItem>): number {
		const totalItems = Array.from(items.entries()).reduce((quantity, entry) => {
			const cartItemFromEntry: CartItem = entry[1];
			return quantity + cartItemFromEntry.quantity;
		}, 0);
		const amountOfItemsToApplyDiscount = Math.floor(totalItems / 3);
		const sortedItems = Array.from(items.entries())
			.slice()
			.sort((firstEntry, secondEntry) => {
				const firstEntryCartItem: CartItem = firstEntry[1];
				const secondEntryCartItem: CartItem = secondEntry[1];
				return firstEntryCartItem.getPrice() - secondEntryCartItem.getPrice();
			});
		const total = sortedItems.reduce(
			(aggregated, currentEntry) => {
				if (aggregated.itemsToDiscount <= 0) return aggregated;
				const currentEntryCartItem: CartItem = currentEntry[1];
				const remainderAfterOperation =
					aggregated.itemsToDiscount > currentEntryCartItem.quantity
						? aggregated.itemsToDiscount - currentEntryCartItem.quantity
						: 0;
				const valueToDiscountForThisItem =
					remainderAfterOperation === 0
						? aggregated.itemsToDiscount * currentEntryCartItem.productPrice
						: currentEntryCartItem.getPrice();
				const updatedDiscountSum = aggregated.sum + valueToDiscountForThisItem;
				return {
					sum: updatedDiscountSum,
					itemsToDiscount: remainderAfterOperation,
				};
			},
			{ sum: 0, itemsToDiscount: amountOfItemsToApplyDiscount },
		);
		return total.sum;
	}
}
