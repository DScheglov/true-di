import allNames from './all-names';
import { IfEquals } from './type-test-utils';

type KeysOfType<T, F> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { [Q in P]: F }, P>
}[keyof T];

export type IMapping<IContainer extends object, T> = {
  [p in keyof T]?: KeysOfType<IContainer, T[p]>
}

export const assignProps = <IContainer extends object, N extends keyof IContainer>(
  mapping: IMapping<IContainer, IContainer[N]>,
) => (instance: IContainer[N], container: IContainer): void =>
    allNames(mapping).forEach(
      name => {
        instance[name] = container[mapping[name]] as any;
      },
    );
