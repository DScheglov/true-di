import { IContext } from '../interfaces/IContex';

export default class Context implements IContext {
  public requestId: string | null;

  constuctor() {
    this.requestId = null;
  }
}
