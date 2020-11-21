/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
/* eslint-disable max-classes-per-file */
import {
  asFactory, asClass, createInstance, tokens,
} from '.';

describe('createInstance', () => {
  type Logger = {
    log(msg: string): void;
  }

  type Repo<T> = {
    all(): Promise<T[]>
  }

  type Service<T> = {
    findAll(): Promise<T[]>
  }

  const Service = <T>(logger: Logger, repo: Repo<T>): Service<T> => ({
    findAll: () => repo.all().then(results => {
      logger.log(JSON.stringify(results, null, 2));
      return results;
    }),
  });

  const logger: Logger = ({
    log: jest.fn(),
  });

  const repo: Repo<number> = ({
    all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
  });

  it('synchroniously creates instance if all deps are not promised', async () => {
    const service: Service<number> = createInstance(Service, [logger, repo]);
    expect(service).not.toBeInstanceOf(Promise);

    expect(await service.findAll()).toEqual([1, 2, 3, 4]);
  });

  it('asynchroniously creates instance if the first of deps is promised', async () => {
    const service: Promise<Service<number>> = createInstance(
      Service,
      [Promise.resolve(logger), repo],
    );
    expect(service).toBeInstanceOf(Promise);

    expect(await (await service).findAll()).toEqual([1, 2, 3, 4]);
  });

  it('asynchroniously creates instance if the second of deps is promised', async () => {
    const service: Promise<Service<number>> = createInstance(
      Service,
      [logger, Promise.resolve(repo)],
    );
    expect(service).toBeInstanceOf(Promise);

    expect(await (await service).findAll()).toEqual([1, 2, 3, 4]);
  });

  it('asynchroniously creates instance if both of deps are promised', async () => {
    const service: Promise<Service<number>> = createInstance(
      Service,
      [Promise.resolve(logger), Promise.resolve(repo)],
    );
    expect(service).toBeInstanceOf(Promise);

    expect(await (await service).findAll()).toEqual([1, 2, 3, 4]);
  });
});

describe('asFactory', () => {
  type Logger = {
    log(msg: string): void;
  }

  type Repo<T> = {
    all(): Promise<T[]>
  }

  type Service<T> = {
    findAll(): Promise<T[]>
  }

  it('should create a factory when service defines injection and sync deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    Service.inject = (
      { logger, repo }: { logger: Logger, repo: Repo<number> },
    ): Parameters<typeof Service> => [logger, repo];

    const factory = asFactory(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service<number> = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when service defines injection and ssync deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    Service.inject = (
      { logger, repo }: { logger: Logger, repo: Repo<number> },
    ): Parameters<typeof Service> => [logger, repo];

    const factory = asFactory(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service<number>> = factory({ logger: Promise.resolve(logger), repo });
    expect(service).toBeInstanceOf(Promise);
  });

  it('should create a factory when injection defined on factory registration and sync deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    const factory = asFactory(Service,
      (
        { logger, repo }: { logger: Logger, repo: Repo<number> },
      ): Parameters<typeof Service> => [logger, repo]);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service<number> = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when injection defined on factory registration and async deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    const factory = asFactory(Service,
      (
        { logger, repo }: { logger: Logger, repo: Repo<number> },
      ): Parameters<typeof Service> => [logger, repo]);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service<number>> = factory({ logger, repo: Promise.resolve(repo) });
    expect(service).toBeInstanceOf(Promise);
  });

  it('should create a factory when service defines injection by tokens and sync deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    Service.inject = tokens('logger', 'repo');

    const factory = asFactory(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service<number> = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when injection degined by tokens and sync deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    const factory = asFactory(Service, tokens('logger', 'repo'));

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service<number> = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when service defines injection by tokens and async deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    Service.inject = tokens('logger', 'repo');

    const factory = asFactory(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service<number>> = factory({ logger: Promise.resolve(logger), repo });
    expect(service).toBeInstanceOf(Promise);
  });

  it('should create a factory when injection degined by tokens and async deps provided', () => {
    const Service = (logger: Logger, repo: Repo<number>): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    const factory = asFactory(Service, tokens('logger', 'repo'));

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service<number>> = factory({ logger: Promise.resolve(logger), repo });
    expect(service).toBeInstanceOf(Promise);
  });

  it('fallback to container injection', () => {
    type Deps = { logger: Logger, repo: Repo<number> };
    const Service = ({ logger, repo }: Deps): Service<number> => ({
      findAll: () => repo.all().then(results => {
        logger.log(JSON.stringify(results, null, 2));
        return results;
      }),
    });

    const factory = asFactory(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service<number> = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });
});

describe('asClass', () => {
  type Logger = {
    log(msg: string): void;
  }

  type Repo<T> = {
    all(): Promise<T[]>
  }

  type IService<T> = {
    findAll(): Promise<T[]>
  }

  it('should create a factory when service defines injection and sync deps provided', () => {
    class Service implements IService<number> {
      static inject = (
        { logger, repo }: { logger: Logger, repo: Repo<number> },
      ): [Logger, Repo<number>] => [logger, repo];

      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) {}

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when service defines injection and ssync deps provided', () => {
    class Service implements IService<number> {
      static inject = (
        { logger, repo }: { logger: Logger, repo: Repo<number> },
      ): [Logger, Repo<number>] => [logger, repo];

      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service> = factory({ logger: Promise.resolve(logger), repo });
    expect(service).toBeInstanceOf(Promise);
  });

  it('should create a factory when injection defined on factory registration and sync deps provided', () => {
    class Service implements IService<number> {
      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service,
      ({ logger, repo }: { logger: Logger, repo: Repo<number> }): [Logger, Repo<number>] =>
        [logger, repo]);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when injection defined on factory registration and async deps provided', () => {
    class Service implements IService<number> {
      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service,
      ({ logger, repo }: { logger: Logger, repo: Repo<number> }): [Logger, Repo<number>] =>
        [logger, repo]);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service> = factory({ logger, repo: Promise.resolve(repo) });
    expect(service).toBeInstanceOf(Promise);
  });

  it('should create a factory when service defines injection by tokens and sync deps provided', () => {
    class Service implements IService<number> {
      static inject = tokens('logger', 'repo');

      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when injection degined by tokens and sync deps provided', () => {
    class Service implements IService<number> {
      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service, tokens('logger', 'repo'));

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Service = factory({ logger, repo });
    expect(service).not.toBeInstanceOf(Promise);
  });

  it('should create a factory when service defines injection by tokens and async deps provided', () => {
    class Service implements IService<number> {
      static inject = tokens('logger', 'repo');

      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service);

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service> = factory({ logger: Promise.resolve(logger), repo });
    expect(service).toBeInstanceOf(Promise);
  });

  it('should create a factory when injection degined by tokens and async deps provided', () => {
    class Service implements IService<number> {
      constructor(private readonly logger: Logger, private readonly repo: Repo<number>) { }

      async findAll() {
        const results = await this.repo.all();
        this.logger.log(JSON.stringify(results, null, 2));
        return results;
      }
    }

    const factory = asClass(Service, tokens('logger', 'repo'));

    const logger: Logger = ({
      log: jest.fn(),
    });

    const repo: Repo<number> = ({
      all: jest.fn(() => Promise.resolve([1, 2, 3, 4])),
    });

    const service: Promise<Service> = factory({ logger: Promise.resolve(logger), repo });
    expect(service).toBeInstanceOf(Promise);
  });
});
