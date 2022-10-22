import { CartItem } from '../cart/cart-item';

export interface Promo {
	getDiscount(items: Map<string, CartItem>): number;
}
