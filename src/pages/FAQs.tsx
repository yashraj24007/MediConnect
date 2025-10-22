import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQs() {
  const faqCategories = [
    {
      category: "General Questions",
      questions: [
        {
          question: "What is MediConnect?",
          answer: "MediConnect is an AI-powered healthcare platform that connects patients with qualified doctors, enables online consultations, and provides smart health management tools."
        },
        {
          question: "Is MediConnect free to use?",
          answer: "Creating an account and browsing doctors is free. Consultation fees vary by doctor and are displayed before booking. Payment is only required when you book an appointment."
        },
        {
          question: "Which areas do you serve?",
          answer: "We currently serve Hyderabad and surrounding areas in Telangana, India. We're expanding to more cities soon."
        }
      ]
    },
    {
      category: "Booking & Appointments",
      questions: [
        {
          question: "How do I book an appointment?",
          answer: "You can book appointments through our AI Smart Booking system, by browsing doctors directly, or by using our AI Health Assistant for personalized recommendations."
        },
        {
          question: "Can I cancel or reschedule my appointment?",
          answer: "Yes, you can cancel or reschedule appointments from your 'My Appointments' page. Please note cancellation policies may vary by doctor."
        },
        {
          question: "How far in advance can I book an appointment?",
          answer: "You can book appointments up to 30 days in advance, subject to doctor availability."
        },
        {
          question: "Will I receive appointment reminders?",
          answer: "Yes, we send email and SMS reminders 24 hours and 1 hour before your scheduled appointment."
        }
      ]
    },
    {
      category: "Payments",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards, UPI, net banking, and digital wallets through our secure Razorpay payment gateway."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, all payments are processed through Razorpay with industry-standard encryption. We never store your complete card details."
        },
        {
          question: "What is your refund policy?",
          answer: "Cancellations made 24+ hours before the appointment are eligible for full refund. Late cancellations may incur a fee as per doctor's policy."
        },
        {
          question: "Do consultation fees include follow-ups?",
          answer: "Consultation fees are per visit. Some doctors offer free follow-ups within a certain period - check individual doctor profiles for details."
        }
      ]
    },
    {
      category: "AI Features",
      questions: [
        {
          question: "How does the AI Health Assistant work?",
          answer: "Our AI Health Assistant uses natural language processing to understand your health concerns and provide personalized guidance, doctor recommendations, and health tips."
        },
        {
          question: "Is the Symptom Analyzer accurate?",
          answer: "Our Symptom Analyzer uses advanced AI algorithms, but it's not a replacement for professional medical advice. Always consult with a qualified doctor for diagnosis."
        },
        {
          question: "What is Smart Booking?",
          answer: "Smart Booking uses AI to analyze your symptoms, preferences, and location to recommend the best doctors and optimal appointment times."
        },
        {
          question: "How does Health Insights work?",
          answer: "Health Insights analyzes your medical history, appointments, and health data to provide personalized health trends, risk assessments, and wellness recommendations."
        }
      ]
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'Sign Up' in the header, choose your role (Patient/Doctor), and fill in your details. You'll receive a verification email to activate your account."
        },
        {
          question: "How do I update my personal information?",
          answer: "Go to 'My Appointments' page and click on the 'Personal' tab to update your profile information, contact details, and preferences."
        },
        {
          question: "Is my medical information private?",
          answer: "Yes, we follow strict HIPAA-equivalent privacy standards. Your medical data is encrypted and only shared with your chosen healthcare providers."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can request account deletion from Account Settings. Note that this will permanently remove all your data."
        }
      ]
    },
    {
      category: "For Doctors",
      questions: [
        {
          question: "How do I register as a doctor?",
          answer: "Sign up with a Doctor account, complete your profile with license verification, and our team will review your application within 48 hours."
        },
        {
          question: "How do I manage my schedule?",
          answer: "Use the Doctor Dashboard to set your availability, manage appointments, block time slots, and update your consultation fees."
        },
        {
          question: "Can I conduct video consultations?",
          answer: "Yes, our Telemedicine feature enables secure video consultations directly through the platform (coming soon)."
        },
        {
          question: "How do I receive payments?",
          answer: "Consultation fees are collected through the platform and transferred to your registered bank account weekly, minus our service fee."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <HelpCircle className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about using MediConnect
          </p>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{category.category}</CardTitle>
              <CardDescription>
                Common questions about {category.category.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {/* Still have questions */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle>Still have questions?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? Our support team is here to help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/help" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Support
              </a>
              <a 
                href="mailto:support@mediconnect.com"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
