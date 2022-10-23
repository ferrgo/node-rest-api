import { Product } from 'src/application/product/product';
import { ProductRepository } from 'src/application/product/product.repository';

export class ProductMemoryRepository implements ProductRepository {
	private readonly db: Map<string, Product> = new Map([
		['1', new Product('1', 'T-shirt', 12.99, 'A very cool T-shirt')],
		['2', new Product('2', 'Jeans', 25.0, 'A very cool Jeans')],
		['3', new Product('3', 'Dress', 20.65, 'A very cool Dress')],
	]);

	public getAll(): Promise<Product[]> {
		const productArray = Array.from(this.db.entries()).map((entry) => entry[1]);
		return Promise.resolve(productArray);
	}
	public getOne(id: string): Promise<Product | undefined> {
		return Promise.resolve(this.db.get(id));
	}
}
