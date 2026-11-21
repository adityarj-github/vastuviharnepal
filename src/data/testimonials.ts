export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  modelPurchased: string;
}

export interface TestimonialsSectionData {
  headingLine1: string;
  headingLine2: string;
  description: string;
  testimonials: TestimonialItem[];
}

export const testimonialsData: TestimonialsSectionData = {
  headingLine1: "Stories From",
  headingLine2: "Our Homeowners",
  description:
    "Hear from families who have made Vastu Vihar communities their home across Nepal.",
  testimonials: [
    {
      id: "testimonial-1",
      quote:
        "From the initial site visit to handover, the team kept everything transparent. The natural ventilation and layout of our bungalow feel thoughtfully planned for everyday family life.",
      name: "Rajesh Shrestha",
      modelPurchased: "Pashupati Bungalow",
    },
    {
      id: "testimonial-2",
      quote:
        "We wanted a peaceful neighborhood with open green spaces for our parents and kids. Moving into our new home here has been the best decision for our family.",
      name: "Suman Adhikari",
      modelPurchased: "Kanchanjunga Bungalow",
    },
    {
      id: "testimonial-3",
      quote:
        "The build quality and attention to thermal comfort really stand out. Even during peak summer, the interiors stay noticeably cooler than our previous house.",
      name: "Prakash Gurung",
      modelPurchased: "Sagarmatha Bungalow",
    },
    {
      id: "testimonial-4",
      quote:
        "Everything from the gated security to the wide internal roads gives us complete peace of mind. Our children can play outside freely without us worrying.",
      name: "Anita Karki",
      modelPurchased: "Suryodaya Bungalow",
    },
    {
      id: "testimonial-5",
      quote:
        "Having a Vastu-compliant home with modern construction standards was our top priority. The finishing and structural strength exceeded what we expected.",
      name: "Bikash Thapa",
      modelPurchased: "Bagmati Bungalow",
    },
    {
      id: "testimonial-6",
      quote:
        "The community atmosphere here is warm and welcoming. Regular water supply, power backup, and clean surroundings make daily living completely hassle-free.",
      name: "Nirmala Poudel",
      modelPurchased: "Pashupati Bungalow",
    },
  ],
};