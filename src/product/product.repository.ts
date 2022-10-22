import { Product } from './product';

export interface ProductRepository {
	getAll(): Promise<Product[]>;
	getOne(id: string): Promise<Product | undefined>;
}
