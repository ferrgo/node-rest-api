import { Product } from 'src/application/product/product';
import { ProductService } from 'src/application/product/product.service';
import { HTTPError, HTTPErrorCodes } from 'src/infra/http/error';
import { HTTP, HTTPMethod } from 'src/infra/http/http';
import { Logger } from 'src/infra/logger/logger';

export class ProductHTTPController {
	constructor(
		private readonly logger: Logger,
		private readonly server: HTTP,
		private readonly service: ProductService,
	) {
		this.server.on(HTTPMethod.GET, '/products', this.getAllProducts);
		this.server.on(HTTPMethod.GET, '/products/:id', this.getOneProduct);
	}

	private getAllProducts = (
		params: unknown,
		body: unknown,
	): Promise<Product[]> => {
		this.logger.info('[ProductHTTPController] getting all products', {
			params,
			body,
		});
		return this.service.getAll();
	};

	private getOneProduct = async (
		params: unknown,
		body: unknown,
	): Promise<Product> => {
		type GetOneParams = {
			id: string;
		};

		const getOneParams = params as GetOneParams;
		this.logger.info(
			`[ProductHTTPController] getting product with id: ${getOneParams.id}`,
			{ params, body },
		);
		const product = await this.service.getOne(getOneParams.id);
		if (!product) {
			this.logger.info(`[ProductHTTPController] Not found: ${getOneParams.id}`);
			throw new HTTPError(
				`Product Not Found for id: ${getOneParams.id}`,
				HTTPErrorCodes.NOT_FOUND,
			);
		}
		return product;
	};
}
