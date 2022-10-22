import { Cart } from './cart';
import { CartDTO } from './cart.dto';
import { CartRepository } from './cart.repository';

export class CartService {
	constructor(private readonly repository: CartRepository) {}

	public async getOne(id: string): Promise<CartDTO | undefined> {
		const cart: Cart | undefined = await this.repository.getOne(id);
		if (!cart) return undefined;
		return CartDTO.fromEntity(cart);
	}
}
