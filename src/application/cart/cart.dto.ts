import { CartItem } from './cart-item';
import { Promo } from '../promo/promo.model';
import { Cart } from './cart';

export class CartDTO {
	public readonly items: CartItem[];
	constructor(
		public readonly id: string,
		itemsMap: Map<string, CartItem>,
		public readonly total: number,
		public readonly discount: number,
		public readonly finalPrice: number,
		public readonly promo?: Promo,
	) {
		this.items = Array.from(itemsMap.entries()).map((entry) => entry[1]);
	}

	static fromEntity(cart: Cart): CartDTO {
		return new CartDTO(
			cart.id,
			cart.itemMap,
			cart.total,
			cart.discount,
			cart.getFinalPrice(),
			cart.promo,
		);
	}
}
