import { z } from "zod";

export const companyProfileSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  industrySector: z.string().min(1, "Please select an industry sector"),
  type: z.enum(["SELLER", "BUYER", "BOTH"]),
  description: z.string().optional(),
  registrationNumber: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),
  certifications: z.array(z.string()).optional(),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
