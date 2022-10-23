import { CartDTO } from 'src/application/cart/cart.dto';
import { CartService } from 'src/application/cart/cart.service';
import { HTTPError, HTTPErrorCodes } from 'src/infra/http/error';
import { HTTP, HTTPMethod } from 'src/infra/http/http';
import { Logger } from 'src/infra/logger/logger';

export class CartHTTPController {
	constructor(
		private readonly logger: Logger,
		private readonly server: HTTP,
		private readonly service: CartService,
	) {
		this.server.on(HTTPMethod.GET, '/carts/:id', this.getOneCart);
		this.server.on(HTTPMethod.POST, '/carts', this.insertOneCart);
		this.server.on(
			HTTPMethod.PUT,
			'/carts/:cartId/products/:productId',
			this.addItemToCart,
		);
	}

	private insertOneCart = async (
		params: unknown,
		body: unknown,
	): Promise<CartDTO> => {
		type insertOneBody = {
			id: string;
		};

		const insertOneBody = body as insertOneBody;
		// TODO: Improve this, should link to a customer cpf to ensure tracking and avoid passing id in body
		if (!this.isValidInsertBody(insertOneBody))
			throw new HTTPError(
				'The cart needs an string id',
				HTTPErrorCodes.BAD_REQUEST,
			);
		this.logger.info(
			`[CartHTTPController] inserting Cart with id: ${insertOneBody.id}`,
			{ params, body },
		);
		try {
			const cartDTO = await this.service.insertOne(insertOneBody.id);
			return cartDTO;
		} catch (error) {
			this.logger.info(
				`[CartHTTPController] Failed to insert cart id: ${insertOneBody.id}`,
			);
			throw new HTTPError(
				`Card with id '${insertOneBody.id}' already exists`,
				HTTPErrorCodes.CONFLICT,
			);
		}
	};

	private addItemToCart = async (
		params: unknown,
		body: unknown,
	): Promise<CartDTO> => {
		type AddItemToCartParams = {
			cartId: string;
			productId: string;
		};
		type AddItemToCartBody = {
			quantity: number;
		};
		const addItemToCartParam = params as AddItemToCartParams;
		const addItemToCartBody = body as AddItemToCartBody;
		if (!this.isValidAddItemToCartBody(addItemToCartBody)) {
			throw new HTTPError(
				'Body.quantity must be a valid number or no value (defaults to 1)',
				HTTPErrorCodes.BAD_REQUEST,
			);
		}
		const itemQuantity =
			this.getItemQuantityFromAddItemToCartBody(addItemToCartBody);
		// TODO: Improve this, should link to a customer cpf to ensure tracking and avoid passing id in body
		if (!this.isValidAddItemToCartParams(addItemToCartParam)) {
			throw new HTTPError(
				'Param must contains the cart string id and product string id',
				HTTPErrorCodes.BAD_REQUEST,
			);
		}
		this.logger.info(
			`[CartHTTPController] adding product (id:'${addItemToCartParam.productId}') at cart (id: '${addItemToCartParam.cartId}')`,
			{ params, body },
		);
		try {
			const cartDTO = await this.service.addItem(
				addItemToCartParam.cartId,
				addItemToCartParam.productId,
				itemQuantity,
			);
			this.logger.info('[CartHTTPController] added item to cart');
			return cartDTO;
		} catch (error) {
			this.logger.info(
				`[CartHTTPController] Failed to add item (product id: '${addItemToCartParam.productId}') to cart id: ${addItemToCartParam.cartId}`,
				{ errorMessage: (error as Error).message },
			);
			throw new HTTPError(
				`Failed to add item with error: ${(error as Error).message}`,
				HTTPErrorCodes.BAD_REQUEST,
			);
		}
	};

	private getOneCart = async (
		params: unknown,
		body: unknown,
	): Promise<CartDTO> => {
		type GetOneParams = {
			id: string;
		};

		const getOneParams = params as GetOneParams;
		this.logger.info(
			`[CartHTTPController] getting Cart with id: ${getOneParams.id}`,
			{ params, body },
		);
		const cartDTO = await this.service.getOne(getOneParams.id);
		if (!cartDTO) {
			this.logger.info(`[CartHTTPController] Not found: ${getOneParams.id}`);
			throw new HTTPError(
				`Cart Not Found for id: ${getOneParams.id}`,
				HTTPErrorCodes.NOT_FOUND,
			);
		}
		return cartDTO;
	};

	private isValidAddItemToCartBody(addItemToCartBody: {
		quantity: number;
	}): boolean {
		const quantity: unknown = addItemToCartBody.quantity;
		if (!quantity) return true;
		return !isNaN(parseInt(quantity as string));
	}

	private getItemQuantityFromAddItemToCartBody(addItemToCartBody: {
		quantity: unknown;
	}): number {
		const quantity = addItemToCartBody.quantity;
		if (typeof quantity === 'string') return parseInt(quantity);
		return (quantity as number) ?? 1;
	}

	private isValidInsertBody(insertOneBody: { id: string }): boolean {
		return !!insertOneBody.id && typeof insertOneBody.id === 'string';
	}

	private isValidAddItemToCartParams(addItemToCartBody: {
		cartId: string;
		productId: string;
	}): boolean {
		const hasCartIdString =
			!!addItemToCartBody.cartId &&
			typeof addItemToCartBody.cartId === 'string';
		const hasProductIdString =
			!!addItemToCartBody.productId &&
			typeof addItemToCartBody.productId === 'string';
		return hasCartIdString && hasProductIdString;
	}
}
