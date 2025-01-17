import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Cart } from '../cart';
import { CartRepository } from '../cart.repository';
import { CartDTO } from '../cart.dto';
import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';
import { ProductService } from 'src/application/product/product.service';
import { Product } from 'src/application/product/product';
import { ThreeForTwoPromo } from 'src/application/promo/three-for-two-promo';

class DummyRepository implements CartRepository {
	insertOne(id: string): Promise<Cart> {
		return Promise.resolve(new Cart(id));
	}
	getOne(id: string): Promise<Cart | undefined> {
		return Promise.resolve(new Cart(id));
	}
}

describe('Cart Service', () => {
	const mockedRepository: CartRepository = mock(DummyRepository);
	const mockedProductService: ProductService = mock(ProductService);
	afterEach(() => {
		reset(mockedRepository);
	});
	it('should be defined', () => {
		const service = new CartService(
			instance(mockedRepository),
			instance(mockedProductService),
		);
		expect(service).toBeDefined();
	});
	describe('getOne', () => {
		it('should fetch a Cart by id using repository', async () => {
			const mockedCart = new Cart('1');
			when(mockedRepository.getOne('1')).thenResolve(mockedCart);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.getOne('1');
			expect(returnedCart).toStrictEqual(
				new CartDTO('1', new Map<string, CartItem>(), 0, 0, 0),
			);
			verify(mockedRepository.getOne('1')).once();
		});
		it('should return undefined when id is not found on repository', async () => {
			when(mockedRepository.getOne('fakeid')).thenResolve(undefined);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.getOne('fakeid');
			expect(returnedCart).toBeUndefined();
			verify(mockedRepository.getOne('fakeid')).once();
		});
	});
	describe('insertOne', () => {
		it('should insert cart in repository', async () => {
			when(mockedRepository.insertOne('fakeid')).thenResolve(
				new Cart('fakeid'),
			);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.insertOne('fakeid');
			expect(returnedCart).toBeDefined();
			verify(mockedRepository.insertOne('fakeid')).once();
		});
	});
	describe('addItem', () => {
		it('should addItem to cart', async () => {
			when(mockedRepository.getOne('fakeid')).thenResolve(new Cart('fakeid'));
			when(mockedProductService.getOne('fakeproduct')).thenResolve(
				new Product('fakeproduct', 'fake product name', 10),
			);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.addItem('fakeid', 'fakeproduct', 1);
			expect(returnedCart).toBeDefined();
			expect(returnedCart).toStrictEqual(
				new CartDTO(
					'fakeid',
					new Map<string, CartItem>([
						['fakeproduct', new CartItem(1, 'fakeproduct', 10)],
					]),
					10,
					0,
					10,
				),
			);
			verify(mockedRepository.getOne('fakeid')).once();
			verify(mockedProductService.getOne('fakeproduct')).once();
		});
		it('should throw error when cart id not found', async () => {
			when(mockedRepository.getOne('fakeid')).thenResolve(undefined);
			when(mockedProductService.getOne('fakeproduct')).thenResolve(
				new Product('fakeproduct', 'fake product name', 10),
			);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			await expect(
				async () => await service.addItem('fakeid', 'fakeproduct', 1),
			).rejects.toThrow('CART_NOT_FOUND');
		});
		it('should throw error when product id not found', async () => {
			when(mockedRepository.getOne('fakeid')).thenResolve(new Cart('fakeid'));
			when(mockedProductService.getOne('fakeproduct')).thenResolve(undefined);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			await expect(
				async () => await service.addItem('fakeid', 'fakeproduct', 1),
			).rejects.toThrow('PRODUCT_NOT_FOUND');
		});
	});
	describe('removeItem', () => {
		it('should removeItem from cart', async () => {
			const fakeCart = new Cart('fakeid');
			fakeCart.addItem(new CartItem(3, 'fakeproduct', 12));
			when(mockedRepository.getOne('fakeid')).thenResolve(fakeCart);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.removeItem('fakeid', 'fakeproduct');
			expect(returnedCart).toBeDefined();
			expect(returnedCart).toStrictEqual(
				new CartDTO(
					'fakeid',
					new Map<string, CartItem>([
						['fakeproduct', new CartItem(2, 'fakeproduct', 12)],
					]),
					24,
					0,
					24,
				),
			);
			verify(mockedRepository.getOne('fakeid')).once();
		});
		it('should throw error when cart id not found', async () => {
			when(mockedRepository.getOne('fakeid')).thenResolve(undefined);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			await expect(
				async () => await service.removeItem('fakeid', 'fakeproduct'),
			).rejects.toThrow('CART_NOT_FOUND');
		});
	});
	describe('checkoutOne', () => {
		it('should checkoutOne cart', async () => {
			const fakeCart = new Cart('fakeid');
			fakeCart.addItem(new CartItem(3, 'fakeproduct', 12));
			when(mockedRepository.getOne('fakeid')).thenResolve(fakeCart);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.checkoutOne('fakeid');
			expect(returnedCart).toBeDefined();
			expect(returnedCart).toStrictEqual(
				new CartDTO(
					'fakeid',
					new Map<string, CartItem>([
						['fakeproduct', new CartItem(3, 'fakeproduct', 12)],
					]),
					36,
					12,
					24,
					new ThreeForTwoPromo(),
				),
			);
			verify(mockedRepository.getOne('fakeid')).once();
		});
		it('should return undefined if cart id not found', async () => {
			when(mockedRepository.getOne('fakeid')).thenResolve(undefined);
			const service = new CartService(
				instance(mockedRepository),
				instance(mockedProductService),
			);
			const returnedCart = await service.checkoutOne('fakeid');
			expect(returnedCart).toBeUndefined();
			verify(mockedRepository.getOne('fakeid')).once();
		});
	});
});
