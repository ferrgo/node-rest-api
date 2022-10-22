import { CartItem } from 'src/cart/cart-item';
import { ThreeForTwoPromo } from '../three-for-two-promo';

describe('Get 3 for the price of 2 Promo', () => {
	const promo: ThreeForTwoPromo = new ThreeForTwoPromo();
	it('Should discount 0 if less than 3 products', () => {
		const mockedItems: Map<string, CartItem> = new Map([
			['1', new CartItem(1, '1', 12.99)],
			['2', new CartItem(1, '2', 25.0)],
		]);

		expect(promo.getDiscount(mockedItems)).toEqual(0);
	});
	it('Should add 3 items of 1 product and discount should equal the productPrice', () => {
		const productPrice = 12.99;
		const mockedItems: Map<string, CartItem> = new Map([
			['1', new CartItem(3, '1', productPrice)],
		]);

		expect(promo.getDiscount(mockedItems)).toEqual(productPrice);
	});
	it('Should add 4 items of 1 product and discount value should equals 1 times the product price', () => {
		const productPrice = 12.99;
		const mockedItems: Map<string, CartItem> = new Map([
			['1', new CartItem(3, '1', productPrice)],
		]);

		expect(promo.getDiscount(mockedItems)).toEqual(productPrice);
	});
	it('Should return a discount value equal to the sum of the 3 cheapeast items when they are different products', () => {
		const productOnePrice = 12.99;
		const productTwoPrice = 25.0;
		const productThreePrice = 20.65;
		const mockedItems: Map<string, CartItem> = new Map([
			['1', new CartItem(1, '1', productOnePrice)],
			['2', new CartItem(1, '2', productTwoPrice)],
			['3', new CartItem(7, '3', productThreePrice)],
		]);

		expect(promo.getDiscount(mockedItems)).toEqual(
			productOnePrice + productTwoPrice + productThreePrice,
		);
	});
	it('Should return a discount value equal two times the value of cheapest product when 6 items total and 2 items of the cheapest product', () => {
		const productOnePrice = 12.99;
		const productTwoPrice = 25.0;
		const productThreePrice = 20.65;
		const mockedItems: Map<string, CartItem> = new Map([
			['1', new CartItem(2, '1', productOnePrice)],
			['2', new CartItem(2, '2', productTwoPrice)],
			['3', new CartItem(2, '3', productThreePrice)],
		]);

		expect(promo.getDiscount(mockedItems)).toEqual(productOnePrice * 2);
	});
});
