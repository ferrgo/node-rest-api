import { CartItem } from './cart-item';
import { Promo } from '../promo/promo.model';

export class Cart {
	public itemMap: Map<string, CartItem> = new Map<string, CartItem>();
	public total = 0;
	public discount = 0;
	public promo: Promo | undefined;

	constructor(public readonly id: string) {}

	public applyPromo(promo: Promo): void {
		this.promo = promo;
		this.updateFinalPrice();
	}

	public getFinalPrice(): number {
		return this.total - this.discount;
	}

	public addItem(item: CartItem): void {
		if (item.quantity <= 0) {
			throw new Error(
				`Can't add 0 items of a product to the cart. Trying to add product with id: '${item.productId}'`,
			);
		}
		const currentCartItem: CartItem | undefined = this.itemMap.get(
			item.productId,
		);
		const newQuantity: number = currentCartItem
			? currentCartItem.quantity + item.quantity
			: item.quantity;
		this.itemMap.set(
			item.productId,
			new CartItem(newQuantity, item.productId, item.productPrice),
		);
		this.updateFinalPrice();
	}

	public removeItem(productId: string): void {
		const cartItem: CartItem = this.getItemFromCartItems(productId);
		const newQuantity: number = cartItem.quantity - 1;
		if (newQuantity === 0) this.itemMap.delete(productId);
		else {
			this.itemMap.set(
				productId,
				new CartItem(newQuantity, productId, cartItem.productPrice),
			);
		}
		this.updateFinalPrice();
	}

	private getItemFromCartItems(productId: string): CartItem {
		const cartItem: CartItem | undefined = this.itemMap.get(productId);
		if (!cartItem) {
			throw new Error(
				`Product not found in cart. Trying to remove product with id: '${productId}'`,
			);
		}
		return cartItem;
	}

	private updateFinalPrice(): void {
		this.updateTotal();
		this.discount = this.calculateDiscount();
	}

	private calculateDiscount(): number {
		const discountValue = this.promo?.getDiscount(this.itemMap);
		return discountValue ?? this.discount;
	}

	private updateTotal(): void {
		this.total = Array.from(this.itemMap.entries()).reduce(
			(sum, currentEntry) => {
				const currentEntryCartItem: CartItem = currentEntry[1];
				return sum + currentEntryCartItem.getPrice();
			},
			0,
		);
	}
}
