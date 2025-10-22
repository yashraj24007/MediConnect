import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, HelpCircle } from "lucide-react";

export default function HelpCenter() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      action: "support@mediconnect.com",
      link: "mailto:support@mediconnect.com"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      action: "+91 123 456 7890",
      link: "tel:+911234567890"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our office in Hyderabad",
      action: "Hyderabad, Telangana, India",
      link: "#"
    }
  ];

  const helpTopics = [
    {
      category: "Getting Started",
      topics: [
        "How to create an account",
        "How to book an appointment",
        "How to find doctors",
        "How to use AI Health Assistant"
      ]
    },
    {
      category: "Account Management",
      topics: [
        "Update personal information",
        "Change password",
        "Manage appointments",
        "View medical records"
      ]
    },
    {
      category: "Payments",
      topics: [
        "Payment methods accepted",
        "Refund policy",
        "Consultation fees",
        "Payment security"
      ]
    },
    {
      category: "Technical Support",
      topics: [
        "Browser compatibility",
        "Mobile app issues",
        "Connection problems",
        "Report a bug"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Find answers to common questions or contact our support team.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </div>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href={method.link}
                  className="text-primary hover:underline font-medium"
                >
                  {method.action}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpTopics.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.topics.map((topic, topicIndex) => (
                      <li key={topicIndex}>
                        <a 
                          href="#"
                          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <span className="text-primary">→</span>
                          {topic}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Hours */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-muted-foreground">24/7 - We respond within 24 hours</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phone Support</h4>
                <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Still Need Help?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <a href="/faqs">View FAQs</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/about">About Us</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/privacy">Privacy Policy</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
