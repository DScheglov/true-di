import allNames from './all-names';

type KeysOfType<T, F> = {
  [P in keyof T]: T[P] extends F ? P : never;
}[keyof T];

type ObjectFieldKeys<T> = {
  [P in keyof T]: T[P] extends { [k in any]: any } ? P : never;
}[keyof T]

export type IMapping<IContainer extends object, T> = {
  [p in keyof T]?: keyof IContainer & KeysOfType<IContainer, T[p]>
}

export const assignProps = <IContainer extends object, N extends ObjectFieldKeys<IContainer>>(
  mapping: IMapping<IContainer, IContainer[N]>,
) => (instance: IContainer[N], container: IContainer): void =>
    allNames<IMapping<IContainer, IContainer[N]>>(mapping).forEach(
      name => {
        // @ts-ignore
        instance[name] = container[mapping[name]!];
      },
    );
