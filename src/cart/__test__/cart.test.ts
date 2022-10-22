import { Cart } from '../cart';
import { CartItem } from '../cart-item';
import { ThreeForTwoPromo } from '../../promo/three-for-two-promo';

describe('Cart', () => {
	const mockedProducts: CartItem[] = [
		new CartItem(1, '1', 12.99), //new Product('1', 'T-shirt', 12.99)),
		new CartItem(1, '2', 25.0), //new Product('2', 'Jeans', 25.0)),
		new CartItem(1, '3', 20.65), //new Product('3', 'Dress', 20.65)),
	];

	describe('Empty', () => {
		it('Should create and empty cart', () => {
			const cart = new Cart();
			expect(cart).toBeDefined();
		});
		it('Should have total price equal 0', () => {
			const cart = new Cart();
			expect(cart.getFinalPrice()).toEqual(0);
		});
	});

	describe('Adding products', () => {
		it('Should add 1 product and update total to products price', () => {
			const cart = new Cart();
			cart.addItem(mockedProducts[0]);
			expect(cart.getFinalPrice()).toEqual(12.99);
		});
		it('Should add 3 product and update total to products price', () => {
			const cart = new Cart();
			cart.addItem(mockedProducts[0]);
			cart.addItem(mockedProducts[1]);
			cart.addItem(mockedProducts[2]);
			expect(cart.getFinalPrice()).toEqual(58.64);
		});
		describe('with 0 items of quantity', () => {
			const cart = new Cart();
			beforeEach(() => {
				cart.addItem(mockedProducts[0]);
				cart.addItem(mockedProducts[1]);
				cart.addItem(mockedProducts[2]);
			});
			it('Should throw error and leave final price unchanged', () => {
				expect(() => cart.addItem(new CartItem(0, '4', 100))).toThrow(
					"Can't add 0 items of a product to the cart. Trying to add product with id: '4'",
				);
				expect(cart.getFinalPrice()).toEqual(58.64);
			});
		});
	});

	describe('Removing products', () => {
		it('Should remove the single cartItem and have final price equal to 0', () => {
			const cart = new Cart();
			cart.addItem(mockedProducts[0]);
			expect(cart.getFinalPrice()).toEqual(12.99);
			cart.removeItem(mockedProducts[0].productId);
			expect(cart.getFinalPrice()).toEqual(0);
		});
		describe('that is not present in cart', () => {
			it('Should throw error and leave final price unchanged', () => {
				const cart = new Cart();
				expect(() => cart.removeItem('1')).toThrow(
					"Product not found in cart. Trying to remove product with id: '1'",
				);
				expect(cart.getFinalPrice()).toEqual(0);
			});
		});
	});

	describe('Get 3 for the price of 2 Promo', () => {
		let cart: Cart;
		beforeEach(() => {
			cart = new Cart(new ThreeForTwoPromo());
		});
		it('Should add 1 product and update total to products price', () => {
			cart.addItem(mockedProducts[0]);
			expect(cart.getFinalPrice()).toEqual(12.99);
		});
		it('Should add 3 items of 1 product and final price should cost only 2 times the price of product', () => {
			const productPrice = 12.99;
			cart.addItem(new CartItem(3, '1', productPrice));
			// TODO: Solve float precision
			expect(cart.getFinalPrice()).toBeCloseTo(2 * productPrice);
		});
		it('Should add 4 items of 1 product and final price should cost only 3 times the price of product', () => {
			const productPrice = 12.99;
			cart.addItem(new CartItem(4, '1', productPrice));
			expect(cart.getFinalPrice()).toEqual(3 * productPrice);
		});
		it('Should discount the 3 cheapeast items when they are different products', () => {
			const productOnePrice = 12.99;
			cart.addItem(new CartItem(1, '1', productOnePrice));
			const productTwoPrice = 25.0;
			cart.addItem(new CartItem(1, '2', productTwoPrice));
			const productThreePrice = 20.65;
			cart.addItem(new CartItem(7, '3', productThreePrice));
			const expectedTotal = productThreePrice * 6;
			expect(cart.getFinalPrice()).toEqual(expectedTotal);
		});
		it('Should add 2 product and update total to products price', () => {
			cart.addItem(mockedProducts[0]);
			cart.addItem(mockedProducts[1]);
			expect(cart.getFinalPrice()).toEqual(37.99);
		});
		it('Should add 3 product and discount the cheapest price', () => {
			cart.addItem(mockedProducts[0]);
			cart.addItem(mockedProducts[1]);
			cart.addItem(mockedProducts[2]);
			expect(cart.getFinalPrice()).toEqual(45.65);
		});
		it('Should add 6 products and discount the two cheapest prices', () => {
			cart.addItem(mockedProducts[0]);
			cart.addItem(mockedProducts[1]);
			cart.addItem(mockedProducts[2]);
			cart.addItem(mockedProducts[0]);
			cart.addItem(mockedProducts[1]);
			cart.addItem(mockedProducts[2]);
			expect(cart.getFinalPrice()).toEqual(91.3);
		});
	});
});
