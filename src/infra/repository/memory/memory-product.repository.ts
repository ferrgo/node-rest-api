import { Product } from 'src/application/product/product';
import { ProductRepository } from 'src/application/product/product.repository';

export class ProductMemoryRepository implements ProductRepository {
	private readonly db = [
		new Product('1', 'T-shirt', 12.99, 'A very cool T-shirt'),
		new Product('2', 'Jeans', 25.0, 'A very cool Jeans'),
		new Product('3', 'Dress', 20.65, 'A very cool Dress'),
	];

	public getAll(): Promise<Product[]> {
		return Promise.resolve(this.db);
	}
	public getOne(id: string): Promise<Product | undefined> {
		return Promise.resolve(this.db.find((product) => product.id === id));
	}
}
