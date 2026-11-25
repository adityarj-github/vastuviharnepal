import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Team Accounts
  const rootPassword = await bcrypt.hash("info123", 10);
  const mediaPassword = await bcrypt.hash("media123", 10);
  const hrPassword = await bcrypt.hash("hr123", 10);
  const salesPassword = await bcrypt.hash("sales123", 10);

  // Root Superadmin
  await prisma.user.upsert({
    where: { email: "info@vastuvihar.org" },
    update: {
      password: rootPassword,
      role: "ROOT",
      name: "Root Admin",
    },
    create: {
      email: "info@vastuvihar.org",
      password: rootPassword,
      name: "Root Admin",
      role: "ROOT",
    },
  });

  // Media Team
  await prisma.user.upsert({
    where: { email: "media@vastuvihar.org" },
    update: {
      password: mediaPassword,
      role: "MEDIA",
      name: "Media Team",
    },
    create: {
      email: "media@vastuvihar.org",
      password: mediaPassword,
      name: "Media Team",
      role: "MEDIA",
    },
  });

  // HR Team
  await prisma.user.upsert({
    where: { email: "hr@vastuvihar.org" },
    update: {
      password: hrPassword,
      role: "HR",
      name: "HR Team",
    },
    create: {
      email: "hr@vastuvihar.org",
      password: hrPassword,
      name: "HR Team",
      role: "HR",
    },
  });

  // Sales Team
  await prisma.user.upsert({
    where: { email: "sales@vastuvihar.org" },
    update: {
      password: salesPassword,
      role: "SALES",
      name: "Sales Team",
    },
    create: {
      email: "sales@vastuvihar.org",
      password: salesPassword,
      name: "Sales Team",
      role: "SALES",
    },
  });

  console.log("✓ All 4 role accounts seeded (Root, Media, HR, Sales)");

  // 2. Initial Job Openings
  const openings = [
    {
      jobId: "senior-structural-engineer",
      title: "Senior Structural Engineer (RCC & Monolithic)",
      department: "Engineering & Design",
      type: "Full-Time",
      location: "Birtamode / Birgunj, Nepal",
      description:
        "Lead structural modeling, seismic load simulations, and oversee monolithic aluminum formwork execution across upcoming residential phases.",
      requirements: JSON.stringify([
        "B.E. / M.E. in Civil or Structural Engineering",
        "5+ years experience in RCC structures, seismic design, or precast / monolithic tech",
        "Proficiency in ETABS, STAAD.Pro, and AutoCAD",
        "Registered with Nepal Engineering Council (NEC)",
      ]),
      isOpen: true,
    },
    {
      jobId: "architecture-3d-lead",
      title: "Architecture & 3D Visualization Lead",
      department: "Planning & Architecture",
      type: "Full-Time",
      location: "Birtamode / Kathmandu Office",
      description:
        "Shape exterior facades, interior floor plans, and photorealistic 3D renders for premium bungalow models while adhering to authentic Vastu principles.",
      requirements: JSON.stringify([
        "B.Arch from a recognized university",
        "3+ years experience in residential design and master planning",
        "Mastery of Lumion, 3ds Max, SketchUp, and Revit",
        "Strong understanding of traditional Vastu Shastra residential orientations",
      ]),
      isOpen: true,
    },
    {
      jobId: "site-project-manager",
      title: "Site Project Manager (Civil)",
      department: "Construction Operations",
      type: "Full-Time",
      location: "Birgunj Township Site",
      description:
        "Drive day-to-day site execution, contractor management, material quality testing, and maintain zero-compromise safety protocols on active township blocks.",
      requirements: JSON.stringify([
        "B.E. Civil with 7+ years on-site residential execution experience",
        "Proven track record delivering large-scale gated township units on schedule",
        "Strong leadership, vendor coordination, and inventory management skills",
      ]),
      isOpen: true,
    },
    {
      jobId: "housing-sales-advisor",
      title: "Assistant Sales & Housing Advisor",
      department: "Sales & Customer Relations",
      type: "Full-Time",
      location: "Birtamode Site Office",
      description:
        "Guide prospective homeowners through model walkthroughs, pricing breakdowns, home loan options, and smooth booking registration workflows.",
      requirements: JSON.stringify([
        "Bachelor's degree in Business, Marketing, or related field",
        "2+ years experience in real estate sales, banking, or luxury customer relationship",
        "Fluency in Nepali and Hindi; English proficiency preferred",
        "Excellent communication and consultative negotiation skills",
      ]),
      isOpen: true,
    },
  ];

  for (const job of openings) {
    await prisma.jobOpening.upsert({
      where: { jobId: job.jobId },
      update: job,
      create: job,
    });
  }
  console.log(`✓ Seeded ${openings.length} job openings`);

  // 3. Initial Blog Posts
  const blogs = [
    {
      slug: "monolithic-rcc-construction-nepal",
      title: "Monolithic RCC Construction: Why Nepal's Future Homes Must Be Cast as Single-Pour Structures",
      excerpt:
        "Explore how monolithic reinforced concrete construction provides unmatched earthquake resilience, eliminating joint vulnerabilities common in traditional brick-and-mortar builds.",
      category: "Engineering",
      publishedDate: "Nov 18, 2026",
      readTime: "5 min read",
      coverImage: "/quality/wire-girder.webp",
      coverImageAlt: "Monolithic RCC wire girder and reinforced formwork",
      featured: true,
      isPublished: true,
      authorName: "Er. Bikash Thapa",
      authorRole: "Chief Structural Engineer",
      tags: JSON.stringify(["Monolithic RCC", "Earthquake Resilience", "Engineering", "Structural Integrity"]),
      keyTakeaways: JSON.stringify([
        "Monolithic construction pours slabs and walls simultaneously, eliminating structural cold joints.",
        "Box-action structural behavior dissipates seismic shock waves uniformly throughout the entire building.",
        "Eliminates plastering cracks and dampness penetration, ensuring 100+ years of structural longevity.",
      ]),
      sections: JSON.stringify([
        {
          heading: "The Seismic Challenge in Nepal's Residential Landscape",
          paragraphs: [
            "Nepal sits on one of the most active tectonic fault lines in the world. For decades, conventional residential construction has relied on reinforced concrete column-and-beam frames filled in with unreinforced brick masonry. While ubiquitous, this approach introduces hundreds of weak interface joints where masonry meets concrete.",
            "During severe seismic shaking, non-structural infill walls frequently crack or shear out of plane, creating catastrophic structural hazards. Monolithic construction completely re-engineers this equation by casting foundations, walls, and slabs into a single, continuous, box-type reinforced concrete envelope.",
          ],
        },
        {
          heading: "How Single-Pour Monolithic Pouring Works",
          paragraphs: [
            "In Vastu Vihar Nepal's construction methodology, high-precision modular aluminum and steel formwork forms the entire 3D shell of the bungalow. Reinforcement steel cages with wire girders are positioned continuously across both vertical shear walls and horizontal floor diaphragms.",
            "Ready-mix concrete with specialized self-compacting polymers is poured in a continuous, single operation. As the concrete cures together, there are no cold joints, no air pockets, and no structural seams between walls and floors.",
          ],
          bulletPoints: [
            "Box-Action Resilience: The entire house behaves as an integrated, monolithic shear-wall box during seismic oscillations.",
            "Zero Leakage Seams: Eliminates water seepage paths between brick mortar joints and concrete frames.",
            "Thermal Mass Efficiency: Dense concrete walls provide natural thermal dampening against extreme outside weather.",
          ],
          quote:
            "A monolithic home does not resist earthquake energy with isolated pillars—the entire structure absorbs, distributes, and neutralizes vibration as a singular whole.",
        },
        {
          heading: "Longevity and Sustainable Performance",
          paragraphs: [
            "Beyond seismic safety, monolithic buildings require zero exterior plaster maintenance and will not suffer from structural mortar degradation over decades. For Nepalese families investing in a generational home, this technology transforms safety from a hope into an engineering certainty.",
          ],
        },
      ]),
      metaTitle: "Monolithic RCC Construction in Nepal | Vastu Vihar Nepal",
      metaDescription:
        "Learn why single-pour monolithic RCC construction provides unmatched seismic safety and generational durability for residential homes in Nepal.",
    },
    {
      slug: "rise-of-planned-townships-nepal",
      title: "The Rise of Planned Gated Townships in Nepal: Community, Security & Open Spaces",
      excerpt:
        "Why families in Birtamode, Birgunj, and the Terai are trading standalone plots for integrated residential townships with private roads, parks, and clubhouses.",
      category: "Township Living",
      publishedDate: "Nov 12, 2026",
      readTime: "4 min read",
      coverImage: "/Images/hero.webp",
      coverImageAlt: "Planned gated residential township overview",
      featured: true,
      isPublished: true,
      authorName: "Sunita Shrestha",
      authorRole: "Township Urban Planner",
      tags: JSON.stringify(["Township Living", "Community", "Security", "Urban Planning"]),
      keyTakeaways: JSON.stringify([
        "Integrated infrastructure: underground drainage, reliable electricity, and private wide roads.",
        "Gated 24/7 security with perimeter CCTV and dedicated security checkpoints.",
        "Generous landscaped parks, sports amenities, and multi-purpose community centers.",
      ]),
      sections: JSON.stringify([
        {
          heading: "From Haphazard Subdivisions to Master-Planned Communities",
          paragraphs: [
            "Rapid urbanization across Nepal's key economic centers like Birtamode, Biratnagar, and Birgunj has often outpaced municipal infrastructure. Standalone plot buyers routinely struggle with inadequate drainage, narrow access roads, unpaved lanes, and erratic utility provisioning.",
            "Master-planned townships address these pain points proactively. By designing the entire residential ecosystem before breaking ground, Vastu Vihar Nepal guarantees wide paved roads, dedicated utility conduits, sewage management, and green reserves.",
          ],
        },
      ]),
      metaTitle: "Planned Gated Townships in Nepal | Vastu Vihar Nepal",
      metaDescription:
        "Discover the benefits of integrated township living in Nepal: community parks, 24/7 gated security, and planned infrastructure.",
    },
  ];

  for (const blog of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }
  console.log(`✓ Seeded ${blogs.length} blog posts`);

  // 4. Initial Gallery Folders & Images
  const galleryData = [
    {
      slug: "event",
      title: "Community Events & Celebrations",
      category: "Community Life",
      description:
        "Vibrant cultural festivals, homeowner community meets, family gatherings, and milestone celebrations across our townships.",
      coverImage: "/gallery/event/image-1.webp",
      order: 1,
      imageCount: 10,
    },
    {
      slug: "expo",
      title: "Property Expos & Exhibitions",
      category: "Exhibitions",
      description:
        "Showcasing residential bungalow models, masterplans, and upcoming township developments at major housing expos and property summits.",
      coverImage: "/gallery/expo/image-1.webp",
      order: 2,
      imageCount: 9,
    },
    {
      slug: "tournament",
      title: "Sports Tournaments & Athletics",
      category: "Sports & Recreation",
      description:
        "Annual cricket championships, youth athletics, and outdoor recreational tournaments hosted across our planned township grounds.",
      coverImage: "/gallery/tournament/image-1.webp",
      order: 3,
      imageCount: 8,
    },
    {
      slug: "press",
      title: "Press Conferences & Media Coverage",
      category: "Media & Press",
      description:
        "Leadership announcements, project launch press conferences, media interviews, and national coverage of our construction innovations.",
      coverImage: "/gallery/press/image-1.webp",
      order: 4,
      imageCount: 7,
    },
  ];

  for (const folder of galleryData) {
    const createdFolder = await prisma.galleryFolder.upsert({
      where: { slug: folder.slug },
      update: {
        title: folder.title,
        category: folder.category,
        description: folder.description,
        coverImage: folder.coverImage,
        order: folder.order,
      },
      create: {
        slug: folder.slug,
        title: folder.title,
        category: folder.category,
        description: folder.description,
        coverImage: folder.coverImage,
        order: folder.order,
      },
    });

    // Check if images already exist
    const count = await prisma.galleryImageItem.count({
      where: { folderId: createdFolder.id },
    });

    if (count === 0) {
      const imagesToCreate = Array.from({ length: folder.imageCount }, (_, i) => ({
        folderId: createdFolder.id,
        src: `/gallery/${folder.slug}/image-${i + 1}.webp`,
        alt: `${folder.title} photo ${i + 1}`,
        caption: `${folder.title} ${i + 1}`,
        order: i + 1,
      }));
      await prisma.galleryImageItem.createMany({
        data: imagesToCreate,
      });
    }
  }
  console.log(`✓ Seeded ${galleryData.length} gallery folders and images`);

  // 5. Initial Sample Leads
  const initialLeads = [
    {
      fullName: "Anand Raj Joshi",
      phone: "+977 9841234567",
      email: "anand.joshi@gmail.com",
      source: "Model Inquiry",
      residenceName: "Pashupati Bungalow",
      budget: "1.2 Cr - 1.5 Cr",
      purpose: "Residential Living",
      status: "NEW",
      notes: "Interested in G+1 facing East. Requested site visit for next Saturday.",
    },
    {
      fullName: "Pooja Gurung",
      phone: "+977 9803456789",
      email: "pooja.gurung@yahoo.com",
      source: "Model Inquiry",
      residenceName: "Kanchanjunga Bungalow",
      budget: "1.8 Cr - 2.2 Cr",
      purpose: "Investment",
      status: "CONTACTED",
      notes: "Called on 24th Nov. Discussed payment schedule and bank loan tie-up.",
    },
    {
      fullName: "Sushil Bhattarai",
      phone: "+977 9851098765",
      email: "sushil.b@outlook.com",
      source: "Blog Lead",
      locationPref: "Birtamode",
      interestType: "Monolithic RCC",
      blogSlug: "monolithic-rcc-construction-nepal",
      status: "IN_PROGRESS",
      notes: "Wants a brochure regarding earthquake resilient raft foundation.",
    },
    {
      fullName: "Nabin Karki",
      phone: "+977 9812348765",
      email: "nabin.karki@gmail.com",
      source: "Contact Form",
      purpose: "Booking & Pricing Inquiry",
      message: "Please share pricing list and handover dates for Birgunj Phase 2.",
      status: "NEW",
    },
  ];

  for (const lead of initialLeads) {
    await prisma.lead.create({ data: lead });
  }
  console.log(`✓ Seeded ${initialLeads.length} initial sample leads`);

  // 6. Initial Sample Job Application
  const engineerJob = await prisma.jobOpening.findUnique({
    where: { jobId: "senior-structural-engineer" },
  });

  if (engineerJob) {
    await prisma.jobApplication.create({
      data: {
        fullName: "Dipendra Sharma",
        email: "dipendra.sharma@engineer.org.np",
        phone: "+977 9849876543",
        location: "Kathmandu / Jhapa",
        position: engineerJob.title,
        jobOpeningId: engineerJob.id,
        experience: "3-5 years",
        portfolioUrl: "https://linkedin.com/in/dipendra-engineer",
        coverNote:
          "Experienced with ETABS modeling for multi-story RCC buildings and passionate about monolithic single-pour construction methodology.",
        resumeUrl: "/uploads/resumes/dipendra-sharma-cv.pdf",
        resumeFileName: "Dipendra_Sharma_Structural_Resume.pdf",
        status: "REVIEWING",
        notes: "Good candidate. Has NEC registration and monolithic foundation experience.",
      },
    });
    console.log("✓ Seeded sample job application");
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
