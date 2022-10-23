import { CartItem } from '../cart/cart-item';

export interface Promo {
	name: string;
	getDiscount(items: Map<string, CartItem>): number;
}
