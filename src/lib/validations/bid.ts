import { z } from "zod";

export const bidSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  bidAmount: z.number().positive("Bid amount must be positive"),
  quantityRequested: z.number().positive("Quantity must be positive"),
  message: z.string().optional(),
});

export type BidInput = z.infer<typeof bidSchema>;
