import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Cart } from '../cart';
import { CartRepository } from '../cart.repository';
import { CartDTO } from '../cart.dto';
import { CartItem } from '../cart-item';
import { CartService } from '../cart.service';

class DummyRepository implements CartRepository {
	getOne(id: string): Promise<Cart | undefined> {
		return Promise.resolve(new Cart(id));
	}
}

describe('Cart Service', () => {
	const mockedRepository: CartRepository = mock(DummyRepository);
	afterEach(() => {
		reset(mockedRepository);
	});
	it('should be defined', () => {
		const service = new CartService(instance(mockedRepository));
		expect(service).toBeDefined();
	});
	it('should fetch a Cart by id using repository', async () => {
		const mockedCart = new Cart('1');
		when(mockedRepository.getOne('1')).thenResolve(mockedCart);
		const service = new CartService(instance(mockedRepository));
		const returnedCart = await service.getOne('1');
		expect(returnedCart).toStrictEqual(
			new CartDTO('1', new Map<string, CartItem>(), 0, 0, 0),
		);
		verify(mockedRepository.getOne('1')).once();
	});
	it('should return undefined when id is not found on repository', async () => {
		when(mockedRepository.getOne('fakeid')).thenResolve(undefined);
		const service = new CartService(instance(mockedRepository));
		const returnedCart = await service.getOne('fakeid');
		expect(returnedCart).toBeUndefined();
		verify(mockedRepository.getOne('fakeid')).once();
	});
});
