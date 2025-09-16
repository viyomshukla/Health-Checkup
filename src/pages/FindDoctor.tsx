import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, User, ChevronRight } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  distance: string;
  phone: string;
  availability: string;
  image: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    rating: 4.8,
    experience: "15 years",
    location: "Downtown Medical Center",
    distance: "2.3 miles",
    phone: "(555) 123-4567",
    availability: "Available Today",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: "20 years",
    location: "Heart Care Institute",
    distance: "3.5 miles",
    phone: "(555) 234-5678",
    availability: "Next Available: Tomorrow",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.7,
    experience: "12 years",
    location: "Children's Health Clinic",
    distance: "1.8 miles",
    phone: "(555) 345-6789",
    availability: "Available Today",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    rating: 4.6,
    experience: "18 years",
    location: "Bone & Joint Center",
    distance: "4.2 miles",
    phone: "(555) 456-7890",
    availability: "Next Available: This Week",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Dermatologist",
    rating: 4.8,
    experience: "10 years",
    location: "Skin Health Clinic",
    distance: "2.9 miles",
    phone: "(555) 567-8901",
    availability: "Available Tomorrow",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    id: 6,
    name: "Dr. Robert Davis",
    specialty: "Neurologist",
    rating: 4.9,
    experience: "22 years",
    location: "Brain & Spine Institute",
    distance: "5.1 miles",
    phone: "(555) 678-9012",
    availability: "Next Available: Next Week",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
];

const FindDoctor = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const specialties = [
    "All Specialties",
    "General Physician",
    "Cardiologist",
    "Pediatrician",
    "Orthopedic Surgeon",
    "Dermatologist",
    "Neurologist",
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      doctor.specialty === selectedSpecialty;
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            Find My Doctor
          </h1>

          {/* Search and Filter Section */}
          <div className="mb-8 animate-fadeIn">
            <Card className="healthcare-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Search Doctors
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, specialty, or location..."
                    className="healthcare-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Filter by Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="healthcare-input"
                  >
                    {specialties.map((specialty) => (
                      <option
                        key={specialty}
                        value={specialty === "All Specialties" ? "all" : specialty}
                      >
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <Card
                key={doctor.id}
                className="healthcare-card animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="ml-1 text-sm font-medium">
                        {doctor.rating}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        • {doctor.experience} experience
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{doctor.location}</span>
                    <span className="ml-auto font-medium">{doctor.distance}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-success" />
                    <span
                      className={
                        doctor.availability.includes("Today")
                          ? "text-success font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {doctor.availability}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="btn-healthcare flex-1">
                    Book Appointment
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Profile
                    <User className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <Card className="healthcare-card">
              <div className="text-center py-12">
                <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  No Doctors Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;