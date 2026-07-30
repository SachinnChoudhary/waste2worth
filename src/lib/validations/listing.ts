import { z } from "zod";

export const wasteListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  wasteType: z.string().min(1, "Waste type is required"),
  category: z.enum([
    "METAL_SCRAP",
    "PLASTIC",
    "CHEMICAL_BYPRODUCTS",
    "TEXTILE_WASTE",
    "E_WASTE",
    "ORGANIC_AGRI",
    "CONSTRUCTION_DEBRIS",
    "PAPER_CARDBOARD",
    "GLASS",
    "RUBBER",
    "WOOD",
    "OIL_LUBRICANTS",
    "OTHER",
  ]),
  subCategory: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.enum(["kg", "ton", "liter", "unit", "m3"]),
  location: z.string().min(3, "Location is required"),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),
  hazardClass: z
    .enum([
      "NONE",
      "CLASS_1",
      "CLASS_2",
      "CLASS_3",
      "CLASS_4",
      "CLASS_5",
      "CLASS_6",
      "CLASS_7",
      "CLASS_8",
      "CLASS_9",
    ])
    .default("NONE"),
  condition: z.string().optional(),
  availabilityDate: z.string().optional(),
  isRecurring: z.boolean().default(false),
  priceExpectation: z.number().positive().optional(),
  minimumBid: z.number().positive().optional(),
  openToOffers: z.boolean().default(true),
  images: z.array(z.string()).optional(),
});

export type WasteListingInput = z.infer<typeof wasteListingSchema>;
