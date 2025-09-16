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
  phone: string;
  availability: string;
  // image: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Nitin Gupta",
    specialty: "General Physician",
    rating: 4.8,
    experience: "15 years",
    location: "Fortis Hospital Noida Sector 62",
   
    phone: "+91 6722999991",
    availability: "Available Today",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Dr. Bhawna Jain",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: "20 years",
    location: "Heart Care Institute",
    phone: "91 6722999991",
    availability: "Next Available: Tomorrow",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: 3,
    name: "Dr. Yash Mehta",
    specialty: "Pediatrician",
    rating: 4.7,
    experience: "12 years",
    location: "Children's Health Clinic",
   
    phone: "+91 9874546123",
    availability: "Available Today",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: 4,
    name: "Dr. krishna Yadav",
    specialty: "Orthopedic Surgeon",
    rating: 4.6,
    experience: "18 years",
    location: "Bone & Joint Center",
   
    phone: "+91 8765432109",
    availability: "Next Available: This Week",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    id: 5,
    name: "Dr.Urvashi Sharma",
    specialty: "Dermatologist",
    rating: 4.8,
    experience: "10 years",
    location: "Skin Health Clinic",
    
    phone: "+91 7654321098",
    availability: "Available Tomorrow",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    id: 6,
    name: "Dr. Rahul Verma",
    specialty: "Neurologist",
    rating: 4.9,
    experience: "22 years",
    location: "Brain & Spine Institute",
   
    phone: "+91 9876543210",
    availability: "Next Available: Next Week",
    // image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
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
      selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
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
                        value={
                          specialty === "All Specialties" ? "all" : specialty
                        }
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
               
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {doctor.specialty}
                    </p>
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
                    <span className="ml-auto font-medium">
                      {doctor.distance}
                    </span>
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
                  <Button
                    className="btn-healthcare flex-1"
                    onClick={() =>
                      alert(`Booking appointment with ${doctor.name}`)
                    }
                  >
                    Book Appointment
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1 "onClick={() => alert(`Viewing profile of ${doctor.name} `)}>
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
      <div className="mt-10 flex justify-center">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 max-w-md text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            Need More Options?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To connect with more doctors and specialists, visit{" "}
            <a
              href="https://www.practo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Practo
            </a>
            .
          </p>
          <a
            href="https://www.practo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Visit Practo
          </a>
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;
