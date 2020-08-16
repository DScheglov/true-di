import { v4 as uuid } from 'uuid';
import { createOrderItem } from '../Orders';
import { fakeItemOf, fakeInt, fakePrice } from '../utils/fakes';

const NUMBER_OF_ORDER_IDS = 10;
const NUMBER_OF_ORDER_ITEMS = 100;

const randomOrderId = fakeItemOf(Array.from({ length: NUMBER_OF_ORDER_IDS }, () => uuid()));

export default Array.from({ length: NUMBER_OF_ORDER_ITEMS }, () => createOrderItem(
  uuid(),
  randomOrderId(),
  `stock-id:${fakeInt(1000, 10000)}`,
  fakePrice(0.01, 1e4),
  fakeInt(1, 300),
));