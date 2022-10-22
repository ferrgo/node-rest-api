export class CartItem {
	constructor(
		readonly quantity: number,
		readonly productId: string,
		readonly productPrice: number,
	) {}
	public getPrice(): number {
		return this.quantity * this.productPrice;
	}
}
