import { prepareAll, releaseAll } from 'true-di';
import container from './container';
import { IContainer } from './interfaces';

type AssertTypeEqual<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : never) : never;

describe('container', () => {
	afterEach(() => {
		releaseAll(container);
	});

	it('allows to get logger', () => {
		expect(container.logger).toBeDefined();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const typecheck: AssertTypeEqual<
			typeof container.logger,
			IContainer['logger'
		]> = true;
	});

	it('allows to get dataSourceService', () => {
		expect(container.dataSourceService).toBeDefined();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const typecheck: AssertTypeEqual<
			typeof container.dataSourceService, 
			IContainer['dataSourceService']
		> = true;
	});

	it('allows to get ecommerceService', () => {
		expect(container.ecommerceService).toBeDefined();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const typecheck: AssertTypeEqual<
			typeof container.ecommerceService, 
			IContainer['ecommerceService']
		> = true;
	});

	// or just single test
	it('allows to instantiate all items', () => {
		const items = { ...container };

		expect(items.logger).toBeDefined();
		expect(items.dataSourceService).toBeDefined();
		expect(items.ecommerceService).toBeDefined();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const typecheck: AssertTypeEqual<typeof items, IContainer> = true;
	});


	// or the same but with prepareAll
	it('allows to instantiate all items', () => {
		const items = prepareAll(container);

		expect(items.logger).toBeDefined();
		expect(items.dataSourceService).toBeDefined();
		expect(items.ecommerceService).toBeDefined();

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const typecheck: AssertTypeEqual<typeof items, IContainer> = true;
	});
});