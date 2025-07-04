
/**
 * Dependency Injection Container
 * Provides a centralized way to manage service dependencies
 */

export interface ServiceFactory<T> {
  (): T;
}

export interface ServiceRegistration<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: T;
}

export class DIContainer {
  private static instance: DIContainer;
  private services = new Map<string | symbol, ServiceRegistration<any>>();

  private constructor() {}

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public register<T>(
    token: string | symbol,
    factory: ServiceFactory<T>,
    options: { singleton?: boolean } = {}
  ): void {
    this.services.set(token, {
      factory,
      singleton: options.singleton ?? false,
    });
  }

  public registerSingleton<T>(
    token: string | symbol,
    factory: ServiceFactory<T>
  ): void {
    this.register(token, factory, { singleton: true });
  }

  public resolve<T>(token: string | symbol): T {
    const registration = this.services.get(token);
    
    if (!registration) {
      throw new Error(`Service not registered: ${String(token)}`);
    }

    if (registration.singleton) {
      if (!registration.instance) {
        registration.instance = registration.factory();
      }
      return registration.instance;
    }

    return registration.factory();
  }

  public isRegistered(token: string | symbol): boolean {
    return this.services.has(token);
  }

  public clear(): void {
    this.services.clear();
  }
}

export const container = DIContainer.getInstance();
