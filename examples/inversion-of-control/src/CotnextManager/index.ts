import { IContext } from '../interfaces/IContex';

export const setRequestId = (requestId: string) => ({ context }: { context: IContext }) => {
  context.requestId = requestId;
};
