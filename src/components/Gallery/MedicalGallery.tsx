import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import doctorConsultation from "@/assets/doctor-consultation.jpg";
import patientsWaiting from "@/assets/patients-waiting.jpg";
import medicalTeam from "@/assets/medical-team.jpg";
import clinicHyderabad from "@/assets/clinic-hyderabad.jpg";

export const MedicalGallery = () => {
  const images = [
    {
      src: doctorConsultation,
      alt: "Doctor consultation with patient",
      title: "Professional Consultations",
      link: "/doctors",
      description: "Connect with expert doctors"
    },
    {
      src: patientsWaiting,
      alt: "Patients in comfortable waiting area",
      title: "Comfortable Environment",
      link: "/booking",
      description: "Book your appointment"
    },
    {
      src: medicalTeam,
      alt: "Experienced medical team",
      title: "Expert Medical Team",
      link: "/doctors",
      description: "Meet our specialists"
    },
    {
      src: clinicHyderabad,
      alt: "Modern clinic facility in Hyderabad",
      title: "Modern Facilities",
      link: "/hospitals",
      description: "Explore our hospitals"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-primary mb-4">
            Our Medical Facility
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience world-class healthcare in our state-of-the-art facility in Hyderabad
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="medical-card overflow-hidden group cursor-pointer">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-primary-foreground font-semibold mb-1">
                      {image.title}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm mb-3">
                      {image.description}
                    </p>
                    <Button asChild size="sm" variant="secondary" className="w-fit">
                      <Link to={image.link} className="flex items-center gap-1">
                        Explore
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};