export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  experience: number;
  qualification: string;
  phone: string;
  email: string;
  image: string;
  about: string;
  expertise: string[];
  consultationFee: number;
  availability: {
    [key: string]: string;
  };
  languages: string[];
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    hospital: "Apollo Hospitals Jubilee Hills",
    experience: 15,
    qualification: "MD Cardiology, DM Interventional Cardiology",
    phone: "+91 40 2355 1066",
    email: "dr.rajesh@apollohyd.com",
    image: "/placeholder.svg",
    about: "Dr. Rajesh Kumar is a leading interventional cardiologist with extensive experience in complex cardiac procedures. He has performed over 5000 successful angioplasties and cardiac interventions.",
    expertise: ["Angioplasty", "Cardiac Catheterization", "Pacemaker Implantation", "Heart Attack Treatment", "Preventive Cardiology"],
    consultationFee: 0,
    availability: {
      "Monday": "9:00 AM - 1:00 PM",
      "Tuesday": "9:00 AM - 1:00 PM", 
      "Wednesday": "9:00 AM - 1:00 PM",
      "Thursday": "9:00 AM - 1:00 PM",
      "Friday": "9:00 AM - 1:00 PM",
      "Saturday": "9:00 AM - 12:00 PM"
    },
    languages: ["English", "Hindi", "Telugu"]
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialty: "Gynecologist",
    hospital: "CARE Hospitals Banjara Hills",
    experience: 12,
    qualification: "MD Obstetrics & Gynecology, Fellowship in Laparoscopy",
    phone: "+91 40 6165 6565",
    email: "dr.priya@carehospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Priya Sharma is a renowned gynecologist specializing in high-risk pregnancies and minimally invasive gynecological procedures. She has helped thousands of women with their reproductive health needs.",
    expertise: ["High-Risk Pregnancy", "Laparoscopic Surgery", "Infertility Treatment", "Menopause Management", "Gynecological Oncology"],
    consultationFee: 0,
    availability: {
      "Monday": "10:00 AM - 2:00 PM",
      "Tuesday": "10:00 AM - 2:00 PM",
      "Wednesday": "10:00 AM - 2:00 PM", 
      "Thursday": "10:00 AM - 2:00 PM",
      "Friday": "10:00 AM - 2:00 PM",
      "Saturday": "10:00 AM - 1:00 PM"
    },
    languages: ["English", "Hindi", "Telugu", "Tamil"]
  },
  {
    id: "3",
    name: "Dr. Anil Reddy",
    specialty: "Orthopedic Surgeon",
    hospital: "Continental Hospitals Gachibowli", 
    experience: 18,
    qualification: "MS Orthopedics, Fellowship in Joint Replacement",
    phone: "+91 40 6734 6734",
    email: "dr.anil@continentalhospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Anil Reddy is a distinguished orthopedic surgeon known for his expertise in joint replacement surgeries and sports medicine. He has successfully performed over 3000 joint replacement procedures.",
    expertise: ["Joint Replacement", "Sports Medicine", "Arthroscopy", "Spine Surgery", "Trauma Surgery"],
    consultationFee: 0,
    availability: {
      "Monday": "8:00 AM - 12:00 PM",
      "Tuesday": "8:00 AM - 12:00 PM",
      "Wednesday": "8:00 AM - 12:00 PM",
      "Thursday": "8:00 AM - 12:00 PM", 
      "Friday": "8:00 AM - 12:00 PM",
      "Saturday": "8:00 AM - 11:00 AM"
    },
    languages: ["English", "Telugu", "Hindi"]
  },
  {
    id: "4", 
    name: "Dr. Meena Rao",
    specialty: "Pediatrician",
    hospital: "Yashoda Hospitals Secunderabad",
    experience: 10,
    qualification: "MD Pediatrics, Fellowship in Neonatology",
    phone: "+91 40 2771 4466",
    email: "dr.meena@yashodahospitals.com",
    image: "/placeholder.svg", 
    about: "Dr. Meena Rao is a compassionate pediatrician with special interest in newborn care and childhood development. She is known for her gentle approach with children and comprehensive care.",
    expertise: ["Newborn Care", "Vaccination", "Growth & Development", "Childhood Nutrition", "Pediatric Infections"],
    consultationFee: 0,
    availability: {
      "Monday": "9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM",
      "Tuesday": "9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM",
      "Wednesday": "9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM",
      "Thursday": "9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM",
      "Friday": "9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM",
      "Saturday": "9:00 AM - 1:00 PM"
    },
    languages: ["English", "Telugu", "Hindi", "Urdu"]
  },
  {
    id: "5",
    name: "Dr. Suresh Gupta",
    specialty: "Neurologist", 
    hospital: "KIMS Hospitals Kondapur",
    experience: 14,
    qualification: "DM Neurology, MD Internal Medicine",
    phone: "+91 40 4444 6666",
    email: "dr.suresh@kimshospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Suresh Gupta is an experienced neurologist specializing in stroke management, epilepsy, and movement disorders. He has been instrumental in establishing stroke protocols in multiple hospitals.",
    expertise: ["Stroke Management", "Epilepsy Treatment", "Movement Disorders", "Headache Treatment", "Neurological Rehabilitation"],
    consultationFee: 0,
    availability: {
      "Monday": "10:00 AM - 2:00 PM",
      "Tuesday": "10:00 AM - 2:00 PM",
      "Wednesday": "10:00 AM - 2:00 PM",
      "Thursday": "10:00 AM - 2:00 PM",
      "Friday": "10:00 AM - 2:00 PM", 
      "Saturday": "10:00 AM - 1:00 PM"
    },
    languages: ["English", "Hindi", "Telugu"]
  },
  {
    id: "6",
    name: "Dr. Kavitha Nair",
    specialty: "Dermatologist",
    hospital: "Apollo Hospitals Jubilee Hills", 
    experience: 8,
    qualification: "MD Dermatology, Fellowship in Cosmetic Dermatology",
    phone: "+91 40 2355 1066",
    email: "dr.kavitha@apollohyd.com",
    image: "/placeholder.svg",
    about: "Dr. Kavitha Nair is a skilled dermatologist with expertise in both medical and cosmetic dermatology. She is known for her innovative treatments for skin conditions and anti-aging procedures.",
    expertise: ["Acne Treatment", "Psoriasis Management", "Cosmetic Procedures", "Hair Loss Treatment", "Skin Cancer Screening"],
    consultationFee: 0,
    availability: {
      "Monday": "2:00 PM - 6:00 PM",
      "Tuesday": "2:00 PM - 6:00 PM", 
      "Wednesday": "2:00 PM - 6:00 PM",
      "Thursday": "2:00 PM - 6:00 PM",
      "Friday": "2:00 PM - 6:00 PM",
      "Saturday": "2:00 PM - 5:00 PM"
    },
    languages: ["English", "Telugu", "Malayalam", "Hindi"]
  }
];