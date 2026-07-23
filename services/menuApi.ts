type MenuResponse = {
  items: Array<{ id: number; name: string; basePrice: number }>;
  addOns: Array<{ id: number; name: string; price: number }>;
  sizeAdjustments: Record<"Small" | "Medium" | "Large", number>;
};

export async function getMenu(): Promise<MenuResponse> {
  const response = await fetch("/api/menu");
  if (!response.ok) throw new Error("Menu is temporarily unavailable");
  return response.json() as Promise<MenuResponse>;
}
