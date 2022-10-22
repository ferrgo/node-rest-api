import { ProductService } from './application/product/product.service';
import { ProductHTTPController } from './infra/controller/http/product.controller';
import { ExpressAdapter } from './infra/http/express-http.adapter';
import { SimpleLogger } from './infra/logger/simple-logger.adapter';
import { ProductMemoryRepository } from './infra/repository/memory/memory-product.repository';

export const bootstrap = (): void => {
	const logger = new SimpleLogger();
	const server = new ExpressAdapter(logger);
	const memoryProductRepository = new ProductMemoryRepository();
	const productService = new ProductService(memoryProductRepository);
	new ProductHTTPController(logger, server, productService);
	server.listen(3000);
};

bootstrap();
