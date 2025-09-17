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
  }
];