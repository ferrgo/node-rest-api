import { Cart } from 'src/application/cart/cart';
import { CartRepository } from 'src/application/cart/cart.repository';

export class CartMemoryRepository implements CartRepository {
	private readonly db: Map<string, Cart> = new Map();

	public getOne(id: string): Promise<Cart | undefined> {
		return Promise.resolve(this.db.get(id));
	}

	public async insertOne(id: string): Promise<Cart> {
		const existingCart: Cart | undefined = await this.getOne(id);
		if (existingCart) throw new Error('Cart with id exists');
		const insertedCart = new Cart(id);
		this.db.set(id, insertedCart);
		return Promise.resolve(insertedCart);
	}
}
