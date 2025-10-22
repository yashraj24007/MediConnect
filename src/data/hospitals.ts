export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  specialties: string[];
  established: number;
  beds: number;
  image: string;
  description: string;
  facilities: string[];
  timings: string;
  emergency: boolean;
}

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "Apollo Hospitals Jubilee Hills",
    address: "Road No. 72, Film Nagar, Jubilee Hills, Hyderabad - 500033",
    phone: "+91 40 2355 1066",
    email: "info@apollohyd.com",
    specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Gastroenterology"],
    established: 1988,
    beds: 550,
    image: "/placeholder.svg",
    description: "Apollo Hospitals Jubilee Hills is one of the premier healthcare institutions in Hyderabad, known for its advanced medical technology and experienced medical professionals.",
    facilities: ["ICU", "Emergency Care", "Blood Bank", "Pharmacy", "Diagnostic Center", "Operation Theaters"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "2", 
    name: "CARE Hospitals Banjara Hills",
    address: "Road No. 1, Banjara Hills, Hyderabad - 500034",
    phone: "+91 40 6165 6565",
    email: "info@carehospitals.com",
    specialties: ["Heart Surgery", "Neurosurgery", "Kidney Transplant", "Cancer Treatment", "Pediatrics"],
    established: 1997,
    beds: 435,
    image: "/placeholder.svg",
    description: "CARE Hospitals Banjara Hills is recognized for its excellence in cardiac care, neurosurgery, and multi-organ transplant services.",
    facilities: ["Cath Lab", "CT Scan", "MRI", "Dialysis Unit", "Neonatal ICU", "Rehabilitation Center"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "3",
    name: "Continental Hospitals Gachibowli",
    address: "IT Park Rd, Nanakram Guda, Gachibowli, Hyderabad - 500032",
    phone: "+91 40 6734 6734", 
    email: "info@continentalhospitals.com",
    specialties: ["Liver Transplant", "Robotic Surgery", "Interventional Cardiology", "Minimal Access Surgery"],
    established: 2013,
    beds: 750,
    image: "/placeholder.svg",
    description: "Continental Hospitals is known for its advanced robotic surgery capabilities and comprehensive liver transplant program.",
    facilities: ["Robotic Surgery Suite", "Liver Transplant Unit", "Advanced ICU", "Digital Imaging", "International Patient Services"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "4",
    name: "Yashoda Hospitals Secunderabad",
    address: "Raj Bhavan Rd, Somajiguda, Secunderabad - 500003",
    phone: "+91 40 2771 4466",
    email: "info@yashodahospitals.com", 
    specialties: ["Oncology", "Cardiology", "Neurology", "Emergency Medicine", "Critical Care"],
    established: 1989,
    beds: 350,
    image: "/placeholder.svg",
    description: "Yashoda Hospitals is renowned for its comprehensive cancer care and emergency medical services in the heart of Secunderabad.",
    facilities: ["Cancer Center", "Heart Institute", "Stroke Unit", "Trauma Center", "Advanced Diagnostics"],
    timings: "24/7", 
    emergency: true
  },
  {
    id: "5",
    name: "KIMS Hospitals Kondapur",
    address: "1-8-31/1, Minister Rd, Krishna Nagar Colony, Begumpet, Hyderabad - 500016",
    phone: "+91 40 4444 6666",
    email: "info@kimshospitals.com",
    specialties: ["Pulmonology", "Gastroenterology", "Urology", "Endocrinology", "Rheumatology"], 
    established: 2004,
    beds: 300,
    image: "/placeholder.svg",
    description: "KIMS Hospitals provides excellent healthcare services with a focus on patient-centered care and advanced medical treatments.",
    facilities: ["Pulmonary Function Lab", "Endoscopy Suite", "Lithotripsy Unit", "Sleep Lab", "Pain Management Center"],
    timings: "6:00 AM - 10:00 PM",
    emergency: true
  },
  {
    id: "6",
    name: "Rainbow Children's Hospital LB Nagar",
    address: "Opp. Kamineni Hospitals, LB Nagar, Hyderabad - 500074",
    phone: "+91 40 6677 1100",
    email: "info@rainbowhospitals.in",
    specialties: ["Pediatrics", "Neonatology", "Pediatric Surgery", "Child Development", "Pediatric Cardiology"],
    established: 1998,
    beds: 200,
    image: "/placeholder.svg",
    description: "Rainbow Children's Hospital is India's leading pediatric multi-specialty hospital chain providing world-class healthcare for children.",
    facilities: ["Pediatric ICU", "NICU", "Pediatric Surgery", "Child Psychology", "Vaccination Center", "Growth Clinic"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "7",
    name: "MaxCure Hospitals Madhapur",
    address: "Beside Cyber Towers, Madhapur, Hyderabad - 500081",
    phone: "+91 40 4455 4455",
    email: "contact@maxcurehospitals.com",
    specialties: ["Cardiology", "Oncology", "Orthopedics", "Neurosurgery", "Transplant Surgery"],
    established: 2013,
    beds: 300,
    image: "/placeholder.svg",
    description: "MaxCure Hospitals is a multi-specialty hospital providing comprehensive healthcare services with state-of-the-art technology.",
    facilities: ["Cath Lab", "Oncology Center", "Bone Marrow Transplant", "Robotic Surgery", "Emergency Care"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "8",
    name: "Sunshine Hospitals Secunderabad",
    address: "Paradise Circle, Secunderabad, Hyderabad - 500003",
    phone: "+91 40 4455 5566",
    email: "info@sunshinehospitals.com",
    specialties: ["General Surgery", "ENT", "Urology", "Gynecology", "General Medicine"],
    established: 2005,
    beds: 250,
    image: "/placeholder.svg",
    description: "Sunshine Hospitals is a trusted multi-specialty hospital known for quality care and patient-centric services.",
    facilities: ["Operation Theaters", "ICU", "Dialysis Unit", "Blood Bank", "Pharmacy", "Ambulance Services"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "9",
    name: "Star Hospitals Nanakramguda",
    address: "Financial District, Nanakramguda, Hyderabad - 500032",
    phone: "+91 40 4444 7777",
    email: "contact@starhospitals.com",
    specialties: ["Nephrology", "Urology", "Kidney Transplant", "Dialysis", "Laparoscopic Surgery"],
    established: 2009,
    beds: 200,
    image: "/placeholder.svg",
    description: "Star Hospitals is a premier healthcare institution specializing in nephrology, urology, and transplant services.",
    facilities: ["Dialysis Center", "Transplant Unit", "Laparoscopy Suite", "24x7 Lab", "Advanced ICU"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "10",
    name: "FMS Dental Hospital Kukatpally",
    address: "JNTU Road, Kukatpally, Hyderabad - 500072",
    phone: "+91 40 2311 2233",
    email: "info@fmsdental.com",
    specialties: ["Orthodontics", "Dental Implants", "Cosmetic Dentistry", "Root Canal", "Oral Surgery"],
    established: 2000,
    beds: 50,
    image: "/placeholder.svg",
    description: "FMS Dental Hospital is a leading dental care center providing comprehensive oral health services with advanced dental technology.",
    facilities: ["Digital X-Ray", "Implant Center", "Orthodontic Lab", "Cosmetic Dentistry Suite", "Pediatric Dental Care"],
    timings: "9:00 AM - 9:00 PM",
    emergency: false
  },
  {
    id: "11",
    name: "Asian Institute of Nephrology & Urology Somajiguda",
    address: "Somajiguda, Hyderabad - 500082",
    phone: "+91 40 2312 1100",
    email: "info@ainnephro.com",
    specialties: ["Nephrology", "Urology", "Kidney Transplant", "Dialysis", "Kidney Stone Treatment"],
    established: 2002,
    beds: 150,
    image: "/placeholder.svg",
    description: "Asian Institute of Nephrology & Urology is a specialized center for kidney and urological care with expert nephrologists and urologists.",
    facilities: ["Dialysis Units", "Kidney Transplant Center", "Lithotripsy", "Urology Surgery", "24x7 Nephrology Emergency"],
    timings: "24/7",
    emergency: true
  },
  {
    id: "12",
    name: "L V Prasad Eye Institute Banjara Hills",
    address: "Banjara Hills, Hyderabad - 500034",
    phone: "+91 40 3061 8888",
    email: "info@lvpei.org",
    specialties: ["Ophthalmology", "Corneal Surgery", "Retina Services", "Glaucoma", "Pediatric Ophthalmology"],
    established: 1987,
    beds: 100,
    image: "/placeholder.svg",
    description: "L V Prasad Eye Institute is a world-renowned eye care institution providing comprehensive ophthalmology services and research.",
    facilities: ["Cornea Center", "Retina Clinic", "LASIK Suite", "Pediatric Eye Care", "Low Vision Center", "Eye Bank"],
    timings: "8:00 AM - 6:00 PM",
    emergency: true
  },
  {
    id: "13",
    name: "Oliva Skin & Hair Clinic Madhapur",
    address: "Ayyappa Society, Madhapur, Hyderabad - 500081",
    phone: "+91 40 4455 3344",
    email: "info@olivaclinic.com",
    specialties: ["Dermatology", "Hair Transplant", "Laser Treatment", "Cosmetic Dermatology", "Skin Care"],
    established: 2008,
    beds: 20,
    image: "/placeholder.svg",
    description: "Oliva Clinic is a premier dermatology and hair care center offering advanced aesthetic and medical dermatology services.",
    facilities: ["Laser Center", "Hair Transplant Unit", "Skin Analysis Lab", "Cosmetic Surgery", "Anti-Aging Treatments"],
    timings: "10:00 AM - 8:00 PM",
    emergency: false
  }
];