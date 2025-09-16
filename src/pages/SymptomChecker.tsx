import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PredictionResult {
  condition: string;
  confidence: number;
  recommendations: string[];
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState({
    symptom1: "",
    symptom2: "",
    symptom3: "",
    symptom4: "",
    symptom5: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSymptoms(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one symptom is filled
    const filledSymptoms = Object.values(symptoms).filter(s => s.trim() !== "");
    if (filledSymptoms.length === 0) {
      toast.error("Please enter at least one symptom");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to Flask backend
    // In production, replace this with actual fetch to your Flask endpoint
    try {
      // Simulated backend response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock prediction logic based on symptoms
      const mockConditions = [
        { condition: "Common Cold", confidence: 85 },
        { condition: "Seasonal Allergies", confidence: 78 },
        { condition: "Influenza", confidence: 72 },
        { condition: "Migraine", confidence: 68 },
        { condition: "Arthritis", confidence: 65 },
      ];
      
      const randomCondition = mockConditions[Math.floor(Math.random() * mockConditions.length)];
      
      const mockResult: PredictionResult = {
        condition: randomCondition.condition,
        confidence: randomCondition.confidence,
        recommendations: [
          "Schedule an appointment with your primary care physician",
          "Keep track of your symptoms over the next 48 hours",
          "Stay hydrated and get adequate rest",
          "Consider over-the-counter pain relief if needed",
        ],
      };
      
      setResult(mockResult);
      toast.success("Analysis complete!");
      
      /* 
      // Actual implementation for Flask backend:
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(symptoms),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }
      
      const data = await response.json();
      setResult(data);
      */
    } catch (error) {
      toast.error("Failed to analyze symptoms. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setSymptoms({
      symptom1: "",
      symptom2: "",
      symptom3: "",
      symptom4: "",
      symptom5: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            Symptom Checker
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="animate-fadeIn">
              <Card className="healthcare-card">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">
                  Enter Your Symptoms
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num}>
                      <label
                        htmlFor={`symptom${num}`}
                        className="block text-sm font-medium mb-2 text-foreground"
                      >
                        Symptom {num}
                      </label>
                      <input
                        type="text"
                        id={`symptom${num}`}
                        name={`symptom${num}`}
                        value={symptoms[`symptom${num}` as keyof typeof symptoms]}
                        onChange={handleInputChange}
                        className="healthcare-input"
                        placeholder={`Enter symptom ${num} (e.g., headache, fever, fatigue)`}
                      />
                    </div>
                  ))}
                  
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="btn-healthcare flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Check Symptoms
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={clearForm}
                      variant="outline"
                      className="flex-1"
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Results Section */}
            <div className={`${result ? 'animate-slideIn' : ''}`}>
              {result ? (
                <Card className="healthcare-card border-primary/20">
                  <div className="flex items-start space-x-3 mb-6">
                    <div className="bg-primary/10 rounded-full p-2">
                      <AlertCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-foreground">
                        Analysis Results
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Based on your symptoms
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-primary/5 rounded-lg p-4">
                      <p className="text-lg font-medium text-foreground mb-2">
                        Possible Condition:
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {result.condition}
                      </p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">
                            Confidence Level
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {result.confidence}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        Recommendations:
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-warning-light border border-warning/20 rounded-lg p-4">
                      <p className="text-sm text-healthcare-dark">
                        <strong>Disclaimer:</strong> This is a preliminary analysis based on the symptoms provided. 
                        It is not a substitute for professional medical advice, diagnosis, or treatment. 
                        Please consult with a qualified healthcare provider for accurate diagnosis.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="healthcare-card h-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      No Analysis Yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Enter your symptoms in the form and click "Check Symptoms" to receive a health analysis
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;