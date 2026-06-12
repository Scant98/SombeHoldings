export const company = {
  name: "Sombe Holding Company Limited",
  shortName: "Sombe Holdings",
  slogan: "Quality in every Detail. Efficiency in every Delivery.",
  tagline:
    "Construction and building materials supply for schools, hospitals and institutions across Tanzania.",
  phone: "+255 755 218 181",
  phoneHref: "+255755218181",
  email: "sombecompany@gmail.com",
  location: "Dar es Salaam, Tanzania",
  hours: [
    { days: "Monday to Friday", time: "8:30 AM to 6:00 PM" },
    { days: "Weekends & public holidays", time: "Closed" },
  ],
};

export const stats = [
  { value: 50, suffix: "+", label: "Projects completed" },
  { value: 15, suffix: "", label: "Years of experience" },
  { value: 5, suffix: "", label: "Institutions served" },
];

export const clients = [
  { name: "TARURA", logo: "/clients/tarura.jpg" },
  { name: "Ilala Municipal Council", logo: "/clients/ilala.jpg" },
  { name: "Serengeti Breweries", logo: "/clients/serengeti.png" },
];

export const services = [
  {
    slug: "construction",
    icon: "HardHat",
    title: "Construction Services",
    image: "/services/construction.jpg",
    description:
      "Complete building construction from foundation to finishing, including residential, commercial, and institutional projects.",
    features: [
      "Residential buildings",
      "Commercial complexes",
      "Schools and hospitals",
      "Renovations",
    ],
  },
  {
    slug: "materials-supply",
    icon: "Truck",
    title: "Building Materials Supply",
    image: "/services/steel.jpg",
    description:
      "Sourcing, procurement, transportation, storage, and distribution of quality building materials, available exactly when needed.",
    features: [
      "Cement and aggregates",
      "Steel and rebar",
      "Roofing materials",
      "Electrical and plumbing",
    ],
  },
  {
    slug: "timber-doors",
    icon: "DoorOpen",
    title: "Timber & Wood Doors",
    image: "/services/timber.jpg",
    description:
      "Supply, design, and installation of solid hardwood doors and timber for interior and exterior applications, built to last.",
    features: [
      "Panel, flush and barn styles",
      "Measured fitting and hardware",
      "Sealing and finishing",
      "After-installation care",
    ],
  },
  {
    slug: "project-management",
    icon: "ClipboardList",
    title: "Project Management",
    description:
      "Professional project management ensuring timely completion, quality control, and budget adherence on every site.",
    features: [
      "Timeline planning",
      "Quality assurance",
      "Budget management",
      "Safety compliance",
    ],
  },
  {
    slug: "logistics",
    icon: "Warehouse",
    title: "Logistics & Storage",
    description:
      "Efficient logistics and storage for construction materials and equipment, from warehouse to site.",
    features: [
      "Warehouse storage",
      "Transportation",
      "Inventory management",
      "Just-in-time delivery",
    ],
  },
  {
    slug: "maintenance",
    icon: "Wrench",
    title: "Maintenance & Repair",
    description:
      "Ongoing maintenance and repair services that preserve the beauty and structural integrity of your buildings over time.",
    features: [
      "Preventive maintenance",
      "Repairs",
      "Renovations",
      "Upgrades",
    ],
  },
] as const;

export const projects = [
  {
    id: "pugu-secondary-seminar",
    title: "Pugu Secondary School Seminar Building",
    location: "Pugu, Dar es Salaam",
    description:
      "Complete renovation and construction of a large seminar building at Pugu Secondary School, enhancing educational facilities for the whole school community.",
    image: "/projects/pugu-seminar.png",
    status: "In Progress",
    year: "2024",
    category: "Educational Buildings",
    features: ["Seminar hall", "Modern finishes", "Structural renovation"],
  },
  {
    id: "kitunda-secondary-toilets",
    title: "Kitunda Secondary School Toilets",
    location: "Kitunda, Dar es Salaam",
    description:
      "Construction of modern toilet facilities for Kitunda Secondary School, improving sanitation infrastructure for over 500 students.",
    image: "/projects/kitunda-toilet-block.jpg",
    gallery: ["/projects/toilet-interior.jpg", "/projects/kitunda-toilets.png"],
    status: "Completed",
    year: "2024",
    category: "Education Infrastructure",
    features: ["Modern sanitation", "Water systems", "Accessibility compliant"],
  },
  {
    id: "kivule-hospital-doors",
    title: "Kivule Hospital Doors",
    location: "Kivule, Dar es Salaam",
    description:
      "Supply and installation of solid hardwood doors throughout Kivule Hospital, providing security, privacy, and a timeless finish for patients and staff.",
    image: "/projects/kivule-doors.jpg",
    gallery: ["/projects/door-installation.jpg", "/projects/hardwood-doors.jpg"],
    status: "Completed",
    year: "2024",
    category: "Healthcare Fit-Out",
    features: ["Solid hardwood doors", "Precision installation", "Sealed and finished"],
  },
  {
    id: "pugu-kajiungeni-primary",
    title: "Pugu Kajiungeni Primary School",
    location: "Pugu Kajiungeni, Dar es Salaam",
    description:
      "Classroom construction and door installation for Pugu Kajiungeni Primary School, restoring full functionality to the school's buildings.",
    image: "/projects/pugu-kajiungeni.jpg",
    gallery: ["/projects/handover.jpg"],
    status: "Completed",
    year: "2023",
    category: "Education Infrastructure",
    features: ["Classroom block", "Door installation", "Roofing"],
  },
  {
    id: "kipunguni-hospital",
    title: "Kipunguni Hospital",
    location: "Kipunguni, Dar es Salaam",
    description:
      "Ongoing interior fit-out and timber works at Kipunguni Hospital, including ward partitions and hardwood door frames.",
    image: "/projects/kipunguni-hospital.jpg",
    status: "In Progress",
    year: "2025",
    category: "Healthcare Fit-Out",
    features: ["Ward fit-out", "Timber frames", "Hardwood doors"],
  },
] as const;

export const projectTypes = [
  "Residential Construction",
  "Commercial Building",
  "School / Hospital",
  "Renovation",
  "Materials Supply",
  "Timber & Doors",
  "Other",
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;
