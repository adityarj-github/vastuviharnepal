export interface OfficeData {
  eyebrow: string;
  title: string;
  address: string;
  phones: string[];
  email: string;
  coordinates: string;
}

export const officeData: OfficeData[] = [
  {
    eyebrow: "Birgunj office",
    title: "Birgunj",
    address: "Shop No-8, 2nd Floor, Rungta Mall, Adarsh Nagar, Birgunj - 44300",
    phones: ["+977 - 98025-91815"],
    email: "info@vastuvihar.org",
    coordinates: "27.010567,84.875074",
  },
  {
    eyebrow: "Birtamode office",
    title: "Birtamode",
    address: "211, 2nd Floor, Hanuman Center, Mukti Chowk, Birtamode, Jhapa",
    phones: ["+977 - 97051-91815", "+977 - 97080-91332"],
    email: "info@vastuvihar.org",
    coordinates: "26.645816643704492,87.9900848872459",
  },
];
