import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    // User fields
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    // Company fields
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    industrySector: z.string().min(1, "Please select an industry sector"),
    companyType: z.enum(["SELLER", "BUYER", "BOTH"]),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
