import { ProductService } from '../product.service';
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Product } from '../product';
import { ProductRepository } from '../product.repository';

class DummyRepository implements ProductRepository {
	getOne(id: string): Promise<Product | undefined> {
		return Promise.resolve(new Product(id, 'macbook', 0.99, 'fake product'));
	}
	getAll(): Promise<Product[]> {
		return Promise.resolve([]);
	}
}

describe('Product Service', () => {
	const mockedRepository: ProductRepository = mock(DummyRepository);
	afterEach(() => {
		reset(mockedRepository);
	});
	it('should be defined', () => {
		const service = new ProductService(instance(mockedRepository));
		expect(service).toBeDefined();
	});
	it('should fetch all products using repository', async () => {
		const mockedProducts = [
			new Product('1', 't-shirt', 10, 'fake description'),
			new Product('2', 'dress', 20, 'another fake description'),
		];
		when(mockedRepository.getAll()).thenResolve(mockedProducts);
		const service = new ProductService(instance(mockedRepository));
		const returnedProducts = await service.getAll();
		expect(returnedProducts).toStrictEqual([
			new Product('1', 't-shirt', 10, 'fake description'),
			new Product('2', 'dress', 20, 'another fake description'),
		]);
		verify(mockedRepository.getAll()).once();
	});
	it('should fetch a product by id using repository', async () => {
		const mockedProduct = new Product('1', 't-shirt', 10, 'fake description');
		when(mockedRepository.getOne('1')).thenResolve(mockedProduct);
		const service = new ProductService(instance(mockedRepository));
		const returnedProduct = await service.getOne('1');
		expect(returnedProduct).toStrictEqual(
			new Product('1', 't-shirt', 10, 'fake description'),
		);
		verify(mockedRepository.getOne('1')).once();
	});
	it('should return undefined when id is not found on repository', async () => {
		when(mockedRepository.getOne('fakeid')).thenResolve(undefined);
		const service = new ProductService(instance(mockedRepository));
		const returnedProduct = await service.getOne('fakeid');
		expect(returnedProduct).toBeUndefined();
		verify(mockedRepository.getOne('fakeid')).once();
	});
});
