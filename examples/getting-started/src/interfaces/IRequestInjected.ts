import { ILogger } from './ILogger';
import { IECommerceService } from './IECommerceService';

export type Injected<T> = {
  injected: T
}

export type RequestInjected = {
  logger: ILogger,
  ecommerceService: IECommerceService,
}
