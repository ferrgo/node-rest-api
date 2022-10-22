import { Product } from './product';
import { ProductRepository } from './product.repository';

export class ProductService {
	constructor(private readonly repository: ProductRepository) {}

	public async getOne(id: string): Promise<Product | undefined> {
		return this.repository.getOne(id);
	}

	public async getAll(): Promise<Product[]> {
		return this.repository.getAll();
	}
}
