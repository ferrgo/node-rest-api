import { Cart } from './cart';

export interface CartRepository {
	getOne(id: string): Promise<Cart | undefined>;
}
