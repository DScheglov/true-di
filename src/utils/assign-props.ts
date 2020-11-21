import { KeysOfType } from '../types';
import allNames from './all-names';

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
