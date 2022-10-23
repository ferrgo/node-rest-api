import { Product } from '../product/product';
import { ProductService } from '../product/product.service';
import { ThreeForTwoPromo } from '../promo/three-for-two-promo';
import { Cart } from './cart';
import { CartItem } from './cart-item';
import { CartDTO } from './cart.dto';
import { CartRepository } from './cart.repository';

export class CartService {
	constructor(
		private readonly repository: CartRepository,
		private readonly productService: ProductService,
	) {}

	public async getOne(id: string): Promise<CartDTO | undefined> {
		const cart: Cart | undefined = await this.repository.getOne(id);
		if (!cart) return undefined;
		return CartDTO.fromEntity(cart);
	}

	public async insertOne(id: string): Promise<CartDTO> {
		const cart: Cart = await this.repository.insertOne(id);
		return CartDTO.fromEntity(cart);
	}

	public async addItem(
		id: string,
		productId: string,
		quantity: number,
	): Promise<CartDTO> {
		const cart: Cart | undefined = await this.repository.getOne(id);
		if (!cart) throw new Error('CART_NOT_FOUND');
		const product: Product | undefined = await this.productService.getOne(
			productId,
		);
		if (!product) throw new Error('PRODUCT_NOT_FOUND');
		cart.addItem(new CartItem(quantity, product.id, product.price));
		return CartDTO.fromEntity(cart);
	}

	public async removeItem(id: string, productId: string): Promise<CartDTO> {
		const cart: Cart | undefined = await this.repository.getOne(id);
		if (!cart) throw new Error('CART_NOT_FOUND');
		cart.removeItem(productId);
		return CartDTO.fromEntity(cart);
	}

	public async checkoutOne(id: string): Promise<CartDTO | undefined> {
		const cart: Cart | undefined = await this.repository.getOne(id);
		if (!cart) return undefined;
		cart.applyPromo(new ThreeForTwoPromo());
		return CartDTO.fromEntity(cart);
	}
}
