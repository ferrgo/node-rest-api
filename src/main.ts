import { CartService } from './application/cart/cart.service';
import { ProductService } from './application/product/product.service';
import { CartHTTPController } from './infra/controller/http/cart.controller';
import { ProductHTTPController } from './infra/controller/http/product.controller';
import { ExpressAdapter } from './infra/http/express-http.adapter';
import { SimpleLogger } from './infra/logger/simple-logger.adapter';
import { CartMemoryRepository } from './infra/repository/memory/memory-cart.repository';
import { ProductMemoryRepository } from './infra/repository/memory/memory-product.repository';

export const bootstrap = (): void => {
	const logger = new SimpleLogger();
	const server = new ExpressAdapter(logger);
	const memoryProductRepository = new ProductMemoryRepository();
	const productService = new ProductService(memoryProductRepository);
	new ProductHTTPController(logger, server, productService);
	const memoryCartRepository = new CartMemoryRepository();
	const cartService = new CartService(memoryCartRepository, productService);
	new CartHTTPController(logger, server, cartService);
	server.listen(3000);
};

bootstrap();
