import { CartItem } from './cart-item';
import { Promo } from '../promo/promo.model';
import { Cart } from './cart';

export class CartDTO {
	constructor(
		public readonly id: string,
		public readonly itemMap: Map<string, CartItem>,
		public readonly total: number,
		public readonly discount: number,
		public readonly finalPrice: number,
		public readonly promo?: Promo,
	) {}

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
