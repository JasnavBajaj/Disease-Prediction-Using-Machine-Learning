import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Loader2, Menu, X, Home, Activity, Info, Settings } from 'lucide-react';


const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('checker');

  // Corrected API endpoint URLs
  const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://172.30.52.94:8000";

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/symptoms`);
        const data = await response.json();
        setAvailableSymptoms(data);
      } catch (error) {
        setError("Failed to load symptoms. Please try again later.");
      }
    };
    fetchSymptoms();
  }, [API_BASE_URL]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredSymptoms([]);
        return;
      }
  
      const filtered = availableSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSymptoms(filtered.slice(0, 5));
    }, 300);
  
    return () => clearTimeout(timer);
  }, [searchTerm, availableSymptoms]);

  const handleSymptomClick = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setSearchTerm('');
    setFilteredSymptoms([]);
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const handlePredict = async () => {
    if (symptoms.length === 0) {
      setError("Please select at least one symptom");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms.join(','),
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="text-center p-6">
            <h1 className="text-4xl font-bold mb-4 text-indigo-600">Welcome to Health Assistant</h1>
            <p className="text-lg text-gray-600">Your AI-powered health companion for preliminary symptom analysis</p>
          </div>
        );
      case 'checker':
        return (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-600">Symptom Checker</h2>
                <p className="text-gray-600 mt-2">
                  Enter your symptoms to get a potential diagnosis
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Type to search symptoms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {filteredSymptoms.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                      {filteredSymptoms.map((symptom, index) => (
                        <button
                          key={index}
                          onClick={() => handleSymptomClick(symptom)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="hover:text-indigo-600 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Error</h3>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePredict}
                  disabled={loading || symptoms.length === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                    ${loading || symptoms.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get Prediction'
                  )}
                </button>
              </div>
            </div>

            {prediction && (
              <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h3 className="text-2xl font-bold mb-4 text-green-600">Prediction Results</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700"><b>Random Forest</b></p>
                      <p className="mt-1 text-lg">{prediction.rf_model_prediction}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700"><b>Naive Bayes</b></p>
                      <p className="mt-1 text-lg">{prediction.naive_bayes_prediction}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700"><b>SVM</b></p>
                      <p className="mt-1 text-lg">{prediction.svm_model_prediction}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <h3 className="font-medium text-green-800">Final Prediction</h3>
                    <p className="mt-1 text-xl font-semibold text-green-900">
                      {prediction.final_prediction}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case 'about':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-4 text-indigo-600">About Health Assistant</h2>
            <p className="text-gray-600">
              Health Assistant is an AI-powered tool that uses machine learning algorithms to analyze symptoms
              and provide preliminary health insights. This tool combines multiple prediction models including
              Random Forest, Naive Bayes, and Support Vector Machines to provide more accurate results.
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-4 text-indigo-600">Settings</h2>
            <p className="text-gray-600">
              Application settings and preferences will be available here in future updates.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-2xl font-bold text-gray-800">Health Assistant</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium {
                  activeTab === 'home' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="h-4 w-4 inline mr-1" />
                Home
              </button>
              <button
                onClick={() => setActiveTab('checker')}
                className={`px-3 py-2 rounded-md text-sm font-medium {
                  activeTab === 'checker' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Activity className="h-4 w-4 inline mr-1" />
                Symptom Checker
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-2 rounded-md text-sm font-medium {
                  activeTab === 'about' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Info className="h-4 w-4 inline mr-1" />
                About
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 rounded-md text-sm font-medium {
                  activeTab === 'settings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-1" />
                Settings
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <Home className="h-4 w-4 inline mr-2" />
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab('checker');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <Activity className="h-4 w-4 inline mr-2" />
                Symptom Checker
              </button>
              <button
                onClick={() => {
                  setActiveTab('about');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <Info className="h-4 w-4 inline mr-2" />
                About
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Settings
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default SymptomChecker;