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
  },
  {
    id: "7",
    name: "Dr. Ramesh Babu",
    specialty: "Gastroenterologist",
    hospital: "Yashoda Hospitals Malakpet",
    experience: 16,
    qualification: "DM Gastroenterology, MD Internal Medicine",
    phone: "+91 40 2771 4466",
    email: "dr.ramesh@yashodahospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Ramesh Babu is a leading gastroenterologist in Hyderabad with extensive experience in liver diseases and advanced endoscopic procedures. He has performed over 10,000 endoscopic procedures.",
    expertise: ["Liver Disease", "Endoscopy", "Colonoscopy", "IBD Treatment", "Pancreatic Disorders"],
    consultationFee: 0,
    availability: {
      "Monday": "9:00 AM - 1:00 PM",
      "Tuesday": "9:00 AM - 1:00 PM",
      "Wednesday": "9:00 AM - 1:00 PM",
      "Thursday": "9:00 AM - 1:00 PM",
      "Friday": "9:00 AM - 1:00 PM",
      "Saturday": "9:00 AM - 12:00 PM"
    },
    languages: ["English", "Telugu", "Hindi"]
  },
  {
    id: "8",
    name: "Dr. Lakshmi Devi",
    specialty: "Pulmonologist",
    hospital: "CARE Hospitals Hi-Tech City",
    experience: 11,
    qualification: "DM Pulmonology, MD Internal Medicine",
    phone: "+91 40 6165 6565",
    email: "dr.lakshmi@carehospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Lakshmi Devi is a renowned pulmonologist specializing in respiratory diseases, sleep disorders, and critical care. She has been at the forefront of COVID-19 treatment in Hyderabad.",
    expertise: ["Asthma Treatment", "COPD Management", "Sleep Disorders", "Lung Cancer", "Respiratory Infections"],
    consultationFee: 0,
    availability: {
      "Monday": "10:00 AM - 2:00 PM",
      "Tuesday": "10:00 AM - 2:00 PM",
      "Wednesday": "10:00 AM - 2:00 PM",
      "Thursday": "10:00 AM - 2:00 PM",
      "Friday": "10:00 AM - 2:00 PM",
      "Saturday": "10:00 AM - 1:00 PM"
    },
    languages: ["English", "Telugu", "Hindi", "Tamil"]
  },
  {
    id: "9",
    name: "Dr. Venkat Reddy",
    specialty: "Endocrinologist",
    hospital: "Continental Hospitals Gachibowli",
    experience: 13,
    qualification: "DM Endocrinology, MD Internal Medicine",
    phone: "+91 40 6734 6734",
    email: "dr.venkat@continentalhospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Venkat Reddy is a distinguished endocrinologist with expertise in diabetes management, thyroid disorders, and hormonal imbalances. He has helped thousands of patients achieve better metabolic health.",
    expertise: ["Diabetes Management", "Thyroid Disorders", "PCOS Treatment", "Obesity Management", "Hormone Therapy"],
    consultationFee: 0,
    availability: {
      "Monday": "9:00 AM - 1:00 PM",
      "Tuesday": "9:00 AM - 1:00 PM",
      "Wednesday": "9:00 AM - 1:00 PM",
      "Thursday": "9:00 AM - 1:00 PM",
      "Friday": "9:00 AM - 1:00 PM",
      "Saturday": "9:00 AM - 12:00 PM"
    },
    languages: ["English", "Telugu", "Hindi"]
  },
  {
    id: "10",
    name: "Dr. Sridevi Patel",
    specialty: "Psychiatrist",
    hospital: "NIMHANS Hyderabad",
    experience: 9,
    qualification: "MD Psychiatry, Fellowship in Child Psychiatry",
    phone: "+91 40 2340 0000",
    email: "dr.sridevi@nimhans.ac.in",
    image: "/placeholder.svg",
    about: "Dr. Sridevi Patel is a compassionate psychiatrist specializing in anxiety disorders, depression, and child mental health. She believes in holistic treatment approaches combining therapy and medication.",
    expertise: ["Depression Treatment", "Anxiety Disorders", "Child Psychiatry", "Addiction Medicine", "Couple Therapy"],
    consultationFee: 0,
    availability: {
      "Monday": "10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM",
      "Tuesday": "10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM",
      "Wednesday": "10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM",
      "Thursday": "10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM",
      "Friday": "10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM",
      "Saturday": "10:00 AM - 2:00 PM"
    },
    languages: ["English", "Telugu", "Hindi", "Urdu"]
  },
  {
    id: "11",
    name: "Dr. Krishna Murthy",
    specialty: "Oncologist",
    hospital: "AIG Hospitals Gachibowli",
    experience: 17,
    qualification: "DM Medical Oncology, MD Internal Medicine",
    phone: "+91 40 4433 4455",
    email: "dr.krishna@aighospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Krishna Murthy is a leading medical oncologist with extensive experience in cancer treatment and research. He has been involved in numerous clinical trials and has a compassionate approach to cancer care.",
    expertise: ["Breast Cancer", "Lung Cancer", "Blood Cancers", "Chemotherapy", "Immunotherapy"],
    consultationFee: 0,
    availability: {
      "Monday": "9:00 AM - 1:00 PM",
      "Tuesday": "9:00 AM - 1:00 PM",
      "Wednesday": "9:00 AM - 1:00 PM",
      "Thursday": "9:00 AM - 1:00 PM",
      "Friday": "9:00 AM - 1:00 PM",
      "Saturday": "9:00 AM - 12:00 PM"
    },
    languages: ["English", "Telugu", "Hindi", "Kannada"]
  },
  {
    id: "12",
    name: "Dr. Hari Prasad",
    specialty: "Urologist",
    hospital: "Star Hospitals Banjara Hills",
    experience: 14,
    qualification: "MCh Urology, MS General Surgery",
    phone: "+91 40 4433 7777",
    email: "dr.hari@starhospitals.in",
    image: "/placeholder.svg",
    about: "Dr. Hari Prasad is a skilled urologist specializing in minimally invasive urological procedures, kidney stone management, and prostate treatments. He has performed over 2000 laparoscopic surgeries.",
    expertise: ["Kidney Stone Treatment", "Prostate Surgery", "Laparoscopic Urology", "Male Infertility", "Urological Cancers"],
    consultationFee: 0,
    availability: {
      "Monday": "8:00 AM - 12:00 PM",
      "Tuesday": "8:00 AM - 12:00 PM",
      "Wednesday": "8:00 AM - 12:00 PM",
      "Thursday": "8:00 AM - 12:00 PM",
      "Friday": "8:00 AM - 12:00 PM",
      "Saturday": "8:00 AM - 11:00 AM"
    },
    languages: ["English", "Telugu", "Hindi", "Tamil"]
  },
  {
    id: "13",
    name: "Dr. Sunitha Reddy",
    specialty: "Rheumatologist",
    hospital: "Asian Institute of Gastroenterology",
    experience: 12,
    qualification: "DM Rheumatology, MD Internal Medicine",
    phone: "+91 40 2378 9999",
    email: "dr.sunitha@aigindia.net",
    image: "/placeholder.svg",
    about: "Dr. Sunitha Reddy is an experienced rheumatologist specializing in autoimmune diseases, arthritis, and joint disorders. She is known for her patient-centric approach and advanced treatment protocols.",
    expertise: ["Rheumatoid Arthritis", "Lupus Treatment", "Osteoarthritis", "Gout Management", "Autoimmune Diseases"],
    consultationFee: 0,
    availability: {
      "Monday": "10:00 AM - 2:00 PM",
      "Tuesday": "10:00 AM - 2:00 PM",
      "Wednesday": "10:00 AM - 2:00 PM",
      "Thursday": "10:00 AM - 2:00 PM",
      "Friday": "10:00 AM - 2:00 PM",
      "Saturday": "10:00 AM - 1:00 PM"
    },
    languages: ["English", "Telugu", "Hindi"]
  },
  {
    id: "14",
    name: "Dr. Mohan Kumar",
    specialty: "ENT Specialist",
    hospital: "Sunshine Hospitals Secunderabad",
    experience: 15,
    qualification: "MS ENT, Fellowship in Head & Neck Surgery",
    phone: "+91 40 2780 4455",
    email: "dr.mohan@sunshinehospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Mohan Kumar is a renowned ENT specialist with expertise in head and neck surgery, hearing disorders, and sinus treatments. He has pioneered several minimally invasive ENT procedures in Hyderabad.",
    expertise: ["Sinus Surgery", "Hearing Loss Treatment", "Voice Disorders", "Sleep Apnea", "Head & Neck Cancers"],
    consultationFee: 0,
    availability: {
      "Monday": "9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      "Tuesday": "9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      "Wednesday": "9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      "Thursday": "9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      "Friday": "9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
      "Saturday": "9:00 AM - 1:00 PM"
    },
    languages: ["English", "Telugu", "Hindi", "Tamil"]
  },
  {
    id: "15",
    name: "Dr. Padma Priya",
    specialty: "Radiologist",
    hospital: "Image Hospitals Ameerpet",
    experience: 10,
    qualification: "MD Radiology, Fellowship in Interventional Radiology",
    phone: "+91 40 2373 5555",
    email: "dr.padma@imagehospitals.com",
    image: "/placeholder.svg",
    about: "Dr. Padma Priya is a skilled radiologist with expertise in diagnostic imaging and interventional radiology procedures. She has been instrumental in early diagnosis of various conditions through advanced imaging techniques.",
    expertise: ["CT Scan Interpretation", "MRI Analysis", "Interventional Procedures", "Mammography", "Ultrasound"],
    consultationFee: 0,
    availability: {
      "Monday": "8:00 AM - 4:00 PM",
      "Tuesday": "8:00 AM - 4:00 PM",
      "Wednesday": "8:00 AM - 4:00 PM",
      "Thursday": "8:00 AM - 4:00 PM",
      "Friday": "8:00 AM - 4:00 PM",
      "Saturday": "8:00 AM - 2:00 PM"
    },
    languages: ["English", "Telugu", "Hindi", "Tamil"]
  }
];