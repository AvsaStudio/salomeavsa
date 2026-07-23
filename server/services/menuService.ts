import { requireDatabase } from "../db/pool.js";
import {
  listAvailableAddOns,
  listAvailableMenuItems,
} from "../repositories/menuRepository.js";

export async function getMenu() {
  const database = requireDatabase();
  const [items, addOns] = await Promise.all([
    listAvailableMenuItems(database),
    listAvailableAddOns(database),
  ]);
  return {
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      basePrice: Number(item.base_price),
    })),
    addOns: addOns.map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      price: Number(addOn.price),
    })),
    sizeAdjustments: { Small: -0.5, Medium: 0, Large: 0.75 },
  };
}
