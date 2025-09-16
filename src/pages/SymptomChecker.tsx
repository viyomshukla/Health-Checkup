import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, X, Info } from "lucide-react";
import { toast } from "sonner";
import { symptomsList } from "@/data/symptoms";

interface PredictionResult {
  disease: string;
  confidence: number;
  description: string;
  recommendations: string;
}

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSymptoms = symptomsList.filter(symptom =>
    symptom.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedSymptoms.includes(symptom.value)
  );

  const handleAddSymptom = (symptomValue: string) => {
    if (selectedSymptoms.length < 5) {
      setSelectedSymptoms([...selectedSymptoms, symptomValue]);
      setSearchQuery("");
      setShowDropdown(false);
    } else {
      toast.error("Maximum 5 symptoms allowed");
    }
  };

  const handleRemoveSymptom = (symptomValue: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    setIsLoading(true);
    
    try {
      // Connect to Flask backend running on localhost:5000
      const response = await fetch('https://health-checkup-4.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }
      
      const data = await response.json();
      setResult(data);
      toast.success("Analysis complete!");
      
    } catch (error) {
      // If Flask backend is not running, show error message with instructions
      toast.error("Cannot connect to Flask backend. Please ensure your Flask server is running on port 5000.");
      console.error("Error:", error);
      
      // Show instructions in result area
      setResult({
        disease: "Backend Not Connected",
        confidence: 0,
        description: "The Flask backend server is not running. To use this feature:",
        recommendations: "1. Open a terminal in the project directory\n2. Install Flask dependencies: pip install flask flask-cors scikit-learn pandas numpy\n3. Run: python public/backend/app.py\n4. The server will start on http://localhost:5000\n5. Try the symptom checker again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
            AI-Powered Symptom Checker
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="animate-fadeIn">
              <Card className="healthcare-card">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">
                  Select Your Symptoms
                </h2>
                
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Search and select symptoms..."
                      className="healthcare-input pr-10"
                      disabled={selectedSymptoms.length >= 5}
                    />
                    <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    
                    {showDropdown && searchQuery && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSymptoms.length > 0 ? (
                          filteredSymptoms.slice(0, 10).map(symptom => (
                            <button
                              key={symptom.value}
                              type="button"
                              onClick={() => handleAddSymptom(symptom.value)}
                              className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors text-sm"
                            >
                              {symptom.label}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-muted-foreground text-sm">
                            No matching symptoms found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Select up to 5 symptoms ({selectedSymptoms.length}/5 selected)
                  </p>
                </div>

                {/* Selected Symptoms */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-foreground">Selected Symptoms:</h3>
                  {selectedSymptoms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map(symptom => {
                        const symptomLabel = symptomsList.find(s => s.value === symptom)?.label || symptom;
                        return (
                          <div
                            key={symptom}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                          >
                            <span>{symptomLabel}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSymptom(symptom)}
                              className="hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No symptoms selected yet</p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || selectedSymptoms.length === 0}
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
                        Analyze Symptoms
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={clearForm}
                    variant="outline"
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Backend Status Info */}
           
              </Card>
            </div>

            {/* Results Section */}
            <div className={`${result ? 'animate-slideIn' : ''}`}>
              {result ? (
                <Card className={`healthcare-card ${result.disease === "Backend Not Connected" ? 'border-warning' : 'border-primary/20'}`}>
                  <div className="flex items-start space-x-3 mb-6">
                    <div className={`${result.disease === "Backend Not Connected" ? 'bg-warning/10' : 'bg-primary/10'} rounded-full p-2`}>
                      <AlertCircle className={`h-6 w-6 ${result.disease === "Backend Not Connected" ? 'text-warning' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {result.disease === "Backend Not Connected" ? "Setup Required" : "Analysis Results"}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {result.disease === "Backend Not Connected" ? "Follow these steps to connect" : "Based on your symptoms"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {result.disease !== "Backend Not Connected" && (
                      <div className="bg-primary/5 rounded-lg p-4">
                        <p className="text-lg font-medium text-foreground mb-2">
                          Predicted Condition:
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {result.disease}
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
                    )}
                    
                    <div>
                     
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-foreground">
                        {result.disease === "Backend Not Connected" ? "Steps to Connect:" : "Recommendations:"}
                      </h3>
                      <div className="space-y-2">
                        {result.recommendations.split('\n').map((rec, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {result.disease !== "Backend Not Connected" && (
                      <div className="bg-warning-light border border-warning/20 rounded-lg p-4">
                        {/* <p className="text-sm text-healthcare-dark">
                          <strong>Medical Disclaimer:</strong> This is an AI-based preliminary analysis. 
                          Always consult with a qualified healthcare provider for accurate diagnosis and treatment.
                        </p> */}
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="healthcare-card h-full flex items-center justify-center min-h-[500px]">
                  <div className="text-center">
                    <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Ready for Analysis
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Select your symptoms from the list and click "Analyze Symptoms" to receive an AI-powered health prediction
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