import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CircuLink database...\n");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.report.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.chainParticipant.deleteMany();
  await prisma.collaborationChain.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.wasteListing.deleteMany();
  await prisma.sustainabilityChatLog.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const passwordHash = await bcrypt.hash("company123", 12);
  const adminHash = await bcrypt.hash("admin123", 12);

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "GreenMetals Recycling",
        type: "BOTH",
        industrySector: "Recycling & Waste Management",
        address: "450 Industrial Blvd",
        city: "Houston",
        state: "TX",
        country: "USA",
        geoLat: 29.7604,
        geoLng: -95.3698,
        phone: "+1-555-0101",
        verificationStatus: "APPROVED",
        rating: 4.5,
        totalReviews: 12,
        description: "Leading metal recycling company specializing in ferrous and non-ferrous scrap processing.",
      },
    }),
    prisma.company.create({
      data: {
        name: "PlastiCycle Corp",
        type: "BOTH",
        industrySector: "Manufacturing",
        address: "1200 Polymer Way",
        city: "Detroit",
        state: "MI",
        country: "USA",
        geoLat: 42.3314,
        geoLng: -83.0458,
        phone: "+1-555-0102",
        verificationStatus: "APPROVED",
        rating: 4.2,
        totalReviews: 8,
        description: "Plastic recycling and upcycling manufacturer converting post-industrial waste into new products.",
      },
    }),
    prisma.company.create({
      data: {
        name: "EcoTextile Solutions",
        type: "SELLER",
        industrySector: "Textiles & Apparel",
        address: "88 Fashion District",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        geoLat: 34.0522,
        geoLng: -118.2437,
        phone: "+1-555-0103",
        verificationStatus: "APPROVED",
        rating: 4.7,
        totalReviews: 15,
        description: "Sustainable fashion company with significant textile waste from production lines.",
      },
    }),
    prisma.company.create({
      data: {
        name: "ChemWaste Solutions",
        type: "SELLER",
        industrySector: "Chemical Processing",
        address: "2100 Chemical Pkwy",
        city: "Philadelphia",
        state: "PA",
        country: "USA",
        geoLat: 39.9526,
        geoLng: -75.1652,
        phone: "+1-555-0104",
        verificationStatus: "APPROVED",
        rating: 4.0,
        totalReviews: 6,
        description: "Chemical processing plant seeking responsible disposal and reuse of byproducts.",
      },
    }),
    prisma.company.create({
      data: {
        name: "TechReclaim Inc",
        type: "BUYER",
        industrySector: "Electronics",
        address: "500 Silicon Ave",
        city: "San Jose",
        state: "CA",
        country: "USA",
        geoLat: 37.3382,
        geoLng: -121.8863,
        phone: "+1-555-0105",
        verificationStatus: "APPROVED",
        rating: 4.8,
        totalReviews: 20,
        description: "E-waste processing company recovering precious metals and refurbishing electronics.",
      },
    }),
    prisma.company.create({
      data: {
        name: "BuildRight Construction",
        type: "BOTH",
        industrySector: "Construction",
        address: "750 Builder Lane",
        city: "Chicago",
        state: "IL",
        country: "USA",
        geoLat: 41.8781,
        geoLng: -87.6298,
        phone: "+1-555-0106",
        verificationStatus: "APPROVED",
        rating: 4.3,
        totalReviews: 9,
        description: "Sustainable construction company interested in recycled building materials.",
      },
    }),
    prisma.company.create({
      data: {
        name: "AgriFuel Energy",
        type: "BUYER",
        industrySector: "Energy",
        address: "300 Farm Road",
        city: "Des Moines",
        state: "IA",
        country: "USA",
        geoLat: 41.5868,
        geoLng: -93.6250,
        phone: "+1-555-0107",
        verificationStatus: "APPROVED",
        rating: 4.1,
        totalReviews: 5,
        description: "Biogas production company using agricultural and organic waste for clean energy.",
      },
    }),
    prisma.company.create({
      data: {
        name: "Pending Corp",
        type: "SELLER",
        industrySector: "Manufacturing",
        address: "100 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
        geoLat: 40.7128,
        geoLng: -74.0060,
        verificationStatus: "PENDING",
        description: "Awaiting verification.",
      },
    }),
  ]);

  console.log(`✅ Created ${companies.length} companies`);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@circulink.com",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  // Create company users
  const users = await Promise.all(
    companies.map((company, i) =>
      prisma.user.create({
        data: {
          name: `${company.name.split(" ")[0]} Manager`,
          email: `info@${company.name.toLowerCase().replace(/\s+/g, "")}.com`,
          passwordHash,
          role: "COMPANY",
          companyId: company.id,
        },
      })
    )
  );

  console.log(`✅ Created ${users.length + 1} users (including admin)`);

  // Create waste listings
  const listingData = [
    { companyIdx: 0, title: "5 Tons Clean Steel Scrap", category: "METAL_SCRAP" as const, wasteType: "Steel", quantity: 5000, unit: "kg", price: 225000, location: "Houston, TX", tags: ["ferrous", "clean", "sorted"], industries: ["Automotive Manufacturing", "Construction"], co2: 9000, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 0, title: "Aluminum Offcuts Batch", category: "METAL_SCRAP" as const, wasteType: "Aluminum", quantity: 1200, unit: "kg", price: 180000, location: "Houston, TX", tags: ["non-ferrous", "aluminum", "high-value"], industries: ["Aerospace", "Packaging"], co2: 2160, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 0, title: "Copper Wire Scrap", category: "METAL_SCRAP" as const, wasteType: "Copper", quantity: 800, unit: "kg", price: 480000, location: "Houston, TX", tags: ["copper", "wire", "premium"], industries: ["Electronics", "Electrical Components"], co2: 1440, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 1, title: "HDPE Post-Industrial Regrind", category: "PLASTIC" as const, wasteType: "HDPE Plastic", quantity: 3000, unit: "kg", price: 75000, location: "Detroit, MI", tags: ["HDPE", "post-industrial", "clean"], industries: ["Packaging", "Injection Molding"], co2: 7500, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1562077772-3bd90403f7f0?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 1, title: "PET Bottle Flakes", category: "PLASTIC" as const, wasteType: "PET", quantity: 5000, unit: "kg", price: 125000, location: "Detroit, MI", tags: ["PET", "flakes", "food-grade"], industries: ["Textile Manufacturing", "Bottle Production"], co2: 12500, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 1, title: "Mixed PP/PE Production Offcuts", category: "PLASTIC" as const, wasteType: "PP/PE Mix", quantity: 2000, unit: "kg", price: 40000, location: "Detroit, MI", tags: ["mixed", "PP", "PE", "offcuts"], industries: ["Lumber Alternative", "Pallets"], co2: 5000, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1562077772-3bd90403f7f0?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 2, title: "Cotton Fabric Scraps — Sorted by Color", category: "TEXTILE_WASTE" as const, wasteType: "Cotton", quantity: 1500, unit: "kg", price: 45000, location: "Los Angeles, CA", tags: ["cotton", "pre-consumer", "sorted"], industries: ["Insulation", "Paper Production"], co2: 4800, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 2, title: "Denim Cutting Waste", category: "TEXTILE_WASTE" as const, wasteType: "Denim", quantity: 2500, unit: "kg", price: 62500, location: "Los Angeles, CA", tags: ["denim", "cutting-waste", "indigo"], industries: ["Insulation Manufacturing", "Automotive Interior"], co2: 8000, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 3, title: "Spent Catalyst Residue", category: "CHEMICAL_BYPRODUCTS" as const, wasteType: "Catalyst", quantity: 500, unit: "kg", price: 150000, location: "Philadelphia, PA", tags: ["catalyst", "precious-metals", "controlled"], industries: ["Precious Metal Recovery", "Chemical Processing"], co2: 250, hazard: "CLASS_6" as const, images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 3, title: "Organic Solvent Waste — Acetone/Ethanol Mix", category: "CHEMICAL_BYPRODUCTS" as const, wasteType: "Solvents", quantity: 2000, unit: "liter", price: 60000, location: "Philadelphia, PA", tags: ["solvent", "recyclable", "flammable"], industries: ["Solvent Recovery", "Fuel Production"], co2: 1000, hazard: "CLASS_3" as const, images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 5, title: "Concrete Rubble from Demolition", category: "CONSTRUCTION_DEBRIS" as const, wasteType: "Concrete", quantity: 20000, unit: "kg", price: 100000, location: "Chicago, IL", tags: ["concrete", "rubble", "aggregate"], industries: ["Road Construction", "Fill Material"], co2: 4000, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80"] },
    { companyIdx: 5, title: "Reclaimed Timber Beams", category: "WOOD" as const, wasteType: "Timber", quantity: 3000, unit: "kg", price: 90000, location: "Chicago, IL", tags: ["timber", "reclaimed", "structural"], industries: ["Furniture", "Landscaping"], co2: 3000, hazard: "NONE" as const, images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80"] },
  ];

  const listings = await Promise.all(
    listingData.map((l) =>
      prisma.wasteListing.create({
        data: {
          companyId: companies[l.companyIdx].id,
          title: l.title,
          wasteType: l.wasteType,
          category: l.category,
          description: `High-quality ${l.wasteType.toLowerCase()} available for immediate pickup. ${l.title}. Suitable for recycling and reuse in various industrial applications.`,
          quantity: l.quantity,
          unit: l.unit,
          images: l.images,
          location: l.location,
          geoLat: companies[l.companyIdx].geoLat,
          geoLng: companies[l.companyIdx].geoLng,
          hazardClass: l.hazard,
          condition: "Good — sorted and clean",
          priceExpectation: l.price,
          openToOffers: true,
          aiTags: l.tags,
          aiSuggestedIndustries: l.industries,
          aiEstimatedValue: l.price * 0.95,
          aiEstimatedCo2Savings: l.co2,
          status: "ACTIVE",
          viewCount: Math.floor(Math.random() * 100) + 10,
        },
      })
    )
  );

  console.log(`✅ Created ${listings.length} waste listings`);

  // Create sample bids
  const bids = await Promise.all([
    prisma.bid.create({
      data: {
        listingId: listings[0].id,
        buyerCompanyId: companies[5].id,
        bidAmount: 2100,
        quantityRequested: 5000,
        message: "We need steel scrap for our construction projects. Can do pickup.",
        status: "PENDING",
      },
    }),
    prisma.bid.create({
      data: {
        listingId: listings[0].id,
        buyerCompanyId: companies[4].id,
        bidAmount: 2300,
        quantityRequested: 3000,
        message: "Interested in partial lot for electronics manufacturing.",
        status: "PENDING",
      },
    }),
    prisma.bid.create({
      data: {
        listingId: listings[3].id,
        buyerCompanyId: companies[0].id,
        bidAmount: 700,
        quantityRequested: 3000,
        message: "We can process this HDPE regrind. Regular supply welcome.",
        status: "PENDING",
      },
    }),
    prisma.bid.create({
      data: {
        listingId: listings[6].id,
        buyerCompanyId: companies[6].id,
        bidAmount: 400,
        quantityRequested: 1500,
        message: "Perfect for our biomass conversion process.",
        status: "ACCEPTED",
      },
    }),
  ]);

  console.log(`✅ Created ${bids.length} bids`);

  // Create a sample transaction
  await prisma.transaction.create({
    data: {
      listingId: listings[6].id,
      bidId: bids[3].id,
      sellerCompanyId: companies[2].id,
      buyerCompanyId: companies[6].id,
      finalAmount: 400,
      quantity: 1500,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  console.log(`✅ Created 1 completed transaction`);

  // Create collaboration chains
  const chain1 = await prisma.collaborationChain.create({
    data: {
      chainName: "Metal-Auto-Construction Loop",
      description: "Steel scrap from recyclers is processed by manufacturers and used in construction",
      status: "SUGGESTED",
      aiConfidenceScore: 0.89,
      estimatedTotalSavings: 45000,
      estimatedCo2Reduction: 12000,
    },
  });

  await Promise.all([
    prisma.chainParticipant.create({
      data: { chainId: chain1.id, companyId: companies[0].id, roleInChain: "Waste Generator", inputMaterial: "Raw Steel", outputMaterial: "Steel Scrap", orderIndex: 0 },
    }),
    prisma.chainParticipant.create({
      data: { chainId: chain1.id, companyId: companies[4].id, roleInChain: "Processor", inputMaterial: "Steel Scrap", outputMaterial: "Metal Components", orderIndex: 1 },
    }),
    prisma.chainParticipant.create({
      data: { chainId: chain1.id, companyId: companies[5].id, roleInChain: "End User", inputMaterial: "Metal Components", outputMaterial: "Buildings", orderIndex: 2 },
    }),
  ]);

  console.log(`✅ Created collaboration chains`);

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: users[0].id, type: "NEW_BID", title: "New Bid Received", content: "BuildRight Construction placed a $2,100 bid on your Steel Scrap listing.", link: `/dashboard/listings/${listings[0].id}` },
      { userId: users[0].id, type: "NEW_BID", title: "New Bid Received", content: "TechReclaim Inc placed a $2,300 bid on your Steel Scrap listing.", link: `/dashboard/listings/${listings[0].id}` },
      { userId: adminUser.id, type: "NEW_COMPANY", title: "New Company Registration", content: "Pending Corp has registered and is awaiting verification.", link: "/admin/companies" },
    ],
  });

  console.log(`✅ Created notifications`);
  console.log("\n🎉 Seed complete!\n");
  console.log("Demo accounts:");
  console.log("  Admin:   admin@circulink.com / admin123");
  console.log("  Company: info@greenmetalsrecycling.com / company123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
