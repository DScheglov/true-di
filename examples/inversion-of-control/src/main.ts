import express from 'express';
import Module from '../../../src/module';
import { ServerConfig } from './interfaces';
import DataSourceService from './DataSourceService';
import ECommerceSerive from './ECommerceService';
import Logger from './Logger';
import { getOrders, getOrderById } from './OrdersExpressController';
import * as ExpressErrorHandler from './ExpressErrorHandler';
import ExpressApp from './ExpressApp';
import ExpressServer from './ExpressServer';
import { singleton } from '../../../src/singleton-scope';
import Context from './Context';
import * as ContextManager from './CotnextManager';
import { asyncScope } from '../../../src/async-scope';
import { readers } from '../../../src/bind-with-module';

export default Module()
  .private(asyncScope, {
    context: () => new Context(),
  })
  .private({
    contextManager: singleton(readers(ContextManager)),
  })
  .private({
    logger: ({ context }) => new Logger(context.requestId),
  })
  .private({
    data: ({ logger }) => new DataSourceService(logger),
  })
  .private({
    ecommerceService: ({ logger, data }) => new ECommerceSerive(logger, data),
  })
  .private({
    orders: singleton(readers({ getOrders, getOrderById })),
  })
  .private({
    errorHandler: singleton(readers(ExpressErrorHandler)),
  })
  .private({
    app: ({ orders, errorHandler, contextManager }) =>
      ExpressApp(express, orders, errorHandler, contextManager),
  })
  .private({
    server: ({ app }, config: ServerConfig) => ExpressServer(app, config),
  })
  .expose(({ server, app }) => {
    server.start();
    return app;
  });
