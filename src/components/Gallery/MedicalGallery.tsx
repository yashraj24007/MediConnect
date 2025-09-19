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
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent mb-6">
            Our Medical Facility
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-body leading-relaxed">
            Experience world-class healthcare in our state-of-the-art facility in Hyderabad
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {images.map((image, index) => (
            <Card key={index} className="medical-card overflow-hidden group cursor-pointer h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    />
                  </div>
                  <div className="p-6 bg-background/95 backdrop-blur-sm">
                    <h3 className="text-xl font-display font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                      {image.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 font-body leading-relaxed">
                      {image.description}
                    </p>
                    <Button asChild size="sm" className="btn-modern w-full group-hover:scale-105 transition-transform duration-300">
                      <Link to={image.link} className="flex items-center justify-center gap-2">
                        Explore
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};