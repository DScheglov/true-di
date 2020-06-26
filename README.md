# true-di
[![Build Status](https://travis-ci.org/DScheglov/true-di.svg?branch=master)](https://travis-ci.org/DScheglov/true-di) [![Coverage Status](https://coveralls.io/repos/github/DScheglov/true-di/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/true-di?branch=master) [![npm version](https://img.shields.io/npm/v/true-di.svg?style=flat-square)](https://www.npmjs.com/package/true-di) [![npm downloads](https://img.shields.io/npm/dm/true-di.svg?style=flat-square)](https://www.npmjs.com/package/true-di) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/DScheglov/true-di/blob/master/LICENSE)

Simple Dependency Injection Container for TypeScript and Javascript

## Installation

```bash
npm i --save true-di
```

## Usage

```ts
import diContainer from 'true-di';
import { ILogger, IDataSourceService, IECommerceService } from './interface';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

export interface IContainer {
  logger: ILogger,
  dataSourceService: IDataSource,
  ecommerceService: ICommerceService,
}

const container = diContainer<IContainer>({
  logger: () => new Logger(),
  dataService: ({ logger }) => new DataSourceService(logger),
  ecommerceService: ({ logger, dataSource }) => new ECommerceService(logger, dataSource),
});

export default container;
```

or