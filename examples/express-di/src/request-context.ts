import createContext from './express-context';
import { IContainer } from './interfaces';

export const { provideContext, fromContext } = createContext<IContainer>();