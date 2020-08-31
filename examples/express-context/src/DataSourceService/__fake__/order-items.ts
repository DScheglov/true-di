import { v4 as uuid } from 'uuid';
import { createOrderItem } from '../../Orders';
import { fakeItemOf, fakeInt, fakePrice } from './generators';

const NUMBER_OF_ORDER_IDS = 5;
const NUMBER_OF_ORDER_ITEMS = 15;

const randomOrderId = fakeItemOf(Array.from({ length: NUMBER_OF_ORDER_IDS }, () => uuid()));

export default Array.from({ length: NUMBER_OF_ORDER_ITEMS }, () => createOrderItem(
  uuid(),
  randomOrderId(),
  `stock-id:${fakeInt(1000, 10000)}`,
  fakePrice(10, 1000),
  fakeInt(1, 10),
));
