import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Clock, Award } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Your Health, Our Priority
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 opacity-95 animate-fadeIn text-gray-700"
              style={{ animationDelay: "0.2s" }}
            >
              Advanced symptom checking and doctor recommendations powered by AI
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn"
              style={{ animationDelay: "0.4s" }}
            >
              <Link
                to="/symptom-checker"
                className="bg-primary-foreground text-primary px-6 py-3 rounded-[var(--radius)] font-semibold transition-[var(--transition-base)] hover:bg-opacity-90 hover:scale-105 shadow-[var(--shadow-md)] inline-flex items-center justify-center"
              >
                Check Symptoms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/find-doctor"
                className="bg-primary-foreground text-primary px-6 py-3 rounded-[var(--radius)] font-semibold transition-[var(--transition-base)] hover:bg-opacity-90 hover:scale-105 shadow-[var(--shadow-md)] inline-flex items-center justify-center"
              >
                Find a Doctor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Health Checkup?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="healthcare-card text-center animate-fadeIn">
              <div className="bg-accent-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Trusted Analysis
              </h3>
              <p className="text-muted-foreground">
                Advanced AI-powered symptom analysis for accurate health
                insights
              </p>
            </div>

            <div
              className="healthcare-card text-center animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-success-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Expert Doctors
              </h3>
              <p className="text-muted-foreground">
                Connect with qualified healthcare professionals in your area
              </p>
            </div>

            <div
              className="healthcare-card text-center animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-warning-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Quick Results
              </h3>
              <p className="text-muted-foreground">
                Get instant health predictions and recommendations
              </p>
            </div>

            <div
              className="healthcare-card text-center animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Certified Care
              </h3>
              <p className="text-muted-foreground">
                All recommendations follow medical best practices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Start with our free symptom checker and get personalized health
            insights in minutes
          </p>
          <Link
            to="/symptom-checker"
            className="btn-healthcare inline-flex items-center"
          >
       
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
