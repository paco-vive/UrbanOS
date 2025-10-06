import React, { useState } from 'react';

interface Neighborhood {
  id: number;
  name: string;
  coordinates: [number, number];
}

interface Recommendation {
  description: string;
  type: 'park' | 'building' | 'infrastructure' | 'garden' | 'maintenance' | 'pedestrian' | 'population' | 'infrastructureType' | 'hydrology';
}

const typeIcons: Record<string, string> = {
  park: '🌳',
  building: '🏢',
  infrastructure: '🏗️',
  garden: '🌱',
  maintenance: '🛠️',
  pedestrian: '🚶',
  population: '👥',
  infrastructureType: '🏬',
  hydrology: '💧'
};

interface RecommendationModalProps {
  neighborhood: Neighborhood;
  gridId: number | null;
  vegetationPercentage: number;
  roadLength: number;
  population: number;
  infrastructureTypes: string[];
  hydroPercentage: number;
  onClose: () => void;
}

const callGeminiAPI = async (prompt: string, apiKey: string) => {
  const model = 'gemini-2.5-flash'; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Full Gemini API Response:', JSON.stringify(data, null, 2)); 

    let responseText: string;
    if (data.text) {
      responseText = data.text; 
    } else if (data.content && data.content.text) {
      responseText = data.content.text; 
    } else if (data.candidates && Array.isArray(data.candidates) && data.candidates[0]?.content?.parts?.[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text; 
    } else if (data.candidates && data.candidates[0]?.finishReason === 'MAX_TOKENS') {
      throw new Error('Response was cut off due to token limit. Try a shorter prompt or increase the token limit.');
    } else {
      throw new Error(`Invalid response structure: no text found in response. Full response: ${JSON.stringify(data, null, 2)}`);
    }

    return responseText;
  } catch (error: any) {
    console.error('Full error in callGeminiAPI:', error.message);
    throw error;
  }
};

const getRecommendations = (
  vegetationPercentage: number,
  roadLength: number | undefined,
  population: number,
  infrastructureTypes: string[],
  hydroPercentage: number,
  neighborhoodId: number
): { recommendations: Recommendation[] } => {
  const baseRecommendations: Record<number, { healthScore: number; baseRecommendations: Recommendation[] }> = {
    1: {
      healthScore: 72,
      baseRecommendations: []
    }
  };

  const recommendations = baseRecommendations[neighborhoodId] || { healthScore: 0, baseRecommendations: [] };

  let vegetationRecommendation: Recommendation;
  if (vegetationPercentage < 20) {
    vegetationRecommendation = {
      description: `Low vegetation (${vegetationPercentage.toFixed(2)}%). Consider creating a new urban park or planting native trees to increase green coverage.`,
      type: 'park'
    };
  } else if (vegetationPercentage >= 20 && vegetationPercentage <= 50) {
    vegetationRecommendation = {
      description: `Moderate vegetation (${vegetationPercentage.toFixed(2)}%). Implement green roofs or community gardens to enhance urban greenery.`,
      type: 'garden'
    };
  } else {
    vegetationRecommendation = {
      description: `High vegetation (${vegetationPercentage.toFixed(2)}%). Focus on maintaining existing green spaces or adding recreational facilities like trails.`,
      type: 'maintenance'
    };
  }

  let roadRecommendation: Recommendation;
  const effectiveRoadLength = roadLength ?? 0;
  const roadLengthThreshold = 100;
  if (effectiveRoadLength > roadLengthThreshold) {
    roadRecommendation = {
      description: `High road density (${effectiveRoadLength.toFixed(2)} meters). Consider adding pedestrian pathways or traffic calming measures to improve safety.`,
      type: 'pedestrian'
    };
  } else {
    roadRecommendation = {
      description: `Moderate road coverage (${effectiveRoadLength.toFixed(2)} meters). Enhance connectivity with bike lanes or small pedestrian bridges.`,
      type: 'infrastructure'
    };
  }

  let populationRecommendation: Recommendation;
  if (population < 500) {
    populationRecommendation = {
      description: `Low population (${population} residents). Consider community-building initiatives like local events or small recreational facilities.`,
      type: 'population'
    };
  } else if (population >= 500 && population <= 1500) {
    populationRecommendation = {
      description: `Moderate population (${population} residents). Improve public services like community centers or public transport stops.`,
      type: 'population'
    };
  } else {
    populationRecommendation = {
      description: `High population (${population} residents). Prioritize infrastructure improvements like schools, health centers, or traffic management.`,
      type: 'population'
    };
  }

  let infrastructureRecommendation: Recommendation;
  const infrastructureCount = infrastructureTypes.length;
  const possibleInfrastructure = [
    'Civil airfield', 'Cemetery', 'Shopping mall', 'Medical assistance center', 'School',
    'Land transportation station', 'Urban infrastructure', 'Communication facility',
    'Service facility', 'Sports or recreational facility', 'Miscellaneous facility',
    'Governmental facility', 'Market', 'Plaza', 'Well', 'Pedestrian or vehicle restrictions',
    'Electrical substation', 'Water tank', 'Temple'
  ];
  const missingInfrastructure = possibleInfrastructure.filter(type => !infrastructureTypes.includes(type));
  const suggestedInfrastructure = missingInfrastructure.length > 0
    ? missingInfrastructure[0]
    : 'maintenance of existing infrastructure';

  if (infrastructureCount < 3) {
    infrastructureRecommendation = {
      description: `Low infrastructure diversity (${infrastructureCount} types). Consider adding a ${suggestedInfrastructure} to improve community services.`,
      type: 'infrastructureType'
    };
  } else if (infrastructureCount >= 3 && infrastructureCount <= 5) {
    infrastructureRecommendation = {
      description: `Moderate infrastructure diversity (${infrastructureCount} types). Adding a ${suggestedInfrastructure} like a plaza or service facility could enhance quality of life.`,
      type: 'infrastructureType'
    };
  } else {
    infrastructureRecommendation = {
      description: `High infrastructure diversity (${infrastructureCount} types). Focus on maintaining or upgrading existing infrastructure to ensure functionality.`,
      type: 'infrastructureType'
    };
  }

  let hydroRecommendation: Recommendation;
  if (hydroPercentage < 5) {
    hydroRecommendation = {
      description: `Low hydrological coverage (${hydroPercentage.toFixed(2)}%). Consider building water retention systems or artificial wetlands to improve water management.`,
      type: 'hydrology'
    };
  } else if (hydroPercentage >= 5 && hydroPercentage <= 10) {
    hydroRecommendation = {
      description: `Moderate hydrological coverage (${hydroPercentage.toFixed(2)}%). Enhance existing water bodies with protection measures or drainage systems to prevent flooding.`,
      type: 'hydrology'
    };
  } else {
    hydroRecommendation = {
      description: `High hydrological coverage (${hydroPercentage.toFixed(2)}%). Focus on maintaining water bodies and monitoring water quality for sustainability.`,
      type: 'hydrology'
    };
  }

  return {
    recommendations: [
      ...recommendations.baseRecommendations,
      vegetationRecommendation,
      roadRecommendation,
      populationRecommendation,
      infrastructureRecommendation,
      hydroRecommendation
    ]
  };
};

const RecommendationModal: React.FC<RecommendationModalProps> = ({ neighborhood, gridId, vegetationPercentage, roadLength, population, infrastructureTypes, hydroPercentage, onClose }) => {
  const { recommendations } = getRecommendations(vegetationPercentage, roadLength, population, infrastructureTypes, hydroPercentage, neighborhood.id);

  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    {
      role: 'bot',
      content: `Hello! I have information about the ${neighborhood.name} neighborhood (ID: ${gridId}). Would you like to know something specific about its:\n* Vegetation (${vegetationPercentage.toFixed(2)}%)\n* Road length (${roadLength.toFixed(2)} meters)\n* Population (${population})\n* Infrastructure types (${infrastructureTypes.length > 0 ? infrastructureTypes.join(', ') : 'None'})\n* Hydrological coverage (${hydroPercentage.toFixed(2)}%)\nOr any other question?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''); 

  const getDataContext = () => `
    - Vegetation: ${vegetationPercentage.toFixed(2)}%
    - Road length: ${roadLength.toFixed(2)} meters
    - Population: ${population}
    - Infrastructure types: ${infrastructureTypes.join(', ')}
    - Hydrological coverage: ${hydroPercentage.toFixed(2)}%
  `;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputMessage('');
    setIsLoading(true);

    if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('hi')) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `Hi! I'm here to help with information about the ${neighborhood.name} neighborhood (ID: ${gridId}). Do you have any questions about its data?`
      }]);
      setIsLoading(false);
      return;
    }

    if (userMsg.toLowerCase().includes('vegetation')) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `The vegetation in the ${neighborhood.name} neighborhood is ${vegetationPercentage.toFixed(2)}%.`
      }]);
      setIsLoading(false);
      return;
    }

    if (userMsg.toLowerCase().includes('hydrological') || userMsg.toLowerCase().includes('coverage') || userMsg.toLowerCase().includes('water')) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `The hydrological coverage in the ${neighborhood.name} neighborhood is ${hydroPercentage.toFixed(2)}%.`
      }]);
      setIsLoading(false);
      return;
    }

    if (userMsg.toLowerCase().includes('population') || userMsg.toLowerCase().includes('how many people')) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: `The population of the ${neighborhood.name} neighborhood is ${population} residents.`
      }]);
      setIsLoading(false);
      return;
    }

    if (userMsg.toLowerCase().includes('can i build') || userMsg.toLowerCase().includes('construct')) {
      const staticResponse = `I cannot verify specific zoning regulations for ${neighborhood.name} without more data. However, with vegetation at ${vegetationPercentage.toFixed(2)}% and a population of ${population}, you might consider sustainable projects like green spaces or community infrastructure. Please consult local authorities for construction permits.`;
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'bot', content: staticResponse }]);
        setIsLoading(false);
        return;
      }
    }

    if (userMsg.toLowerCase().includes('how much is') || userMsg.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      try {
        const result = eval(userMsg.match(/\d+\s*[\+\-\*\/]\s*\d+/)?.[0] || '');
        setMessages(prev => [...prev, { role: 'bot', content: `${userMsg} equals ${result}.` }]);
        setIsLoading(false);
        return;
      } catch (e) {
      }
    }

    const contextPrompt = `You are an urban planning expert for Torreón, Mexico. Analyze this data for the ${neighborhood.name} neighborhood (Grid ID: ${gridId}):${getDataContext()}. User's question: ${userMsg}. Respond in English, concisely and helpfully.`;

    try {
      const botResponse = await callGeminiAPI(contextPrompt, apiKey);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    } catch (error: any) {
      console.error('Error in Gemini:', error);
      const fallbackResponse = userMsg.toLowerCase().includes('build') || userMsg.toLowerCase().includes('construct')
        ? `I cannot verify specific zoning regulations for ${neighborhood.name} without more data. However, with vegetation at ${vegetationPercentage.toFixed(2)}% and a population of ${population}, you might consider sustainable projects like green spaces or community infrastructure. Please consult local authorities for construction permits.`
        : `Error: ${error.message}. Try again or verify your API key.`;
      setMessages(prev => [...prev, { role: 'bot', content: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1002,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            {neighborhood.name}
          </h2>
          <button
            onClick={onClose}
            style={{ color: '#9ca3af', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {}
          <div style={{ flex: 2, padding: '24px', overflowY: 'auto', borderRight: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
              Recommendations
            </h3>
            <p style={{ color: '#6b7280', marginTop: '4px', marginBottom: '16px' }}>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'box-shadow 0.2s',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{typeIcons[rec.type]}</span>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 12px 0', flex: 1 }}>
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           
           
            {}
            <div style={{ flex: '0 0 auto' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                AI Assistant (Gemini)
              </h3>
              <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>
                Ask about recommendations or data
              </p>
              <div
                style={{
                  height: '250px',
                  overflowY: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px',
                  backgroundColor: 'white',
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '6px',
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        backgroundColor: msg.role === 'user' ? '#3b82f6' : '#e5e7eb',
                        color: msg.role === 'user' ? 'white' : '#111827',
                        fontSize: '12px',
                        maxWidth: '80%',
                      }}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
                {isLoading && <div style={{ fontSize: '12px', color: '#6b7280' }}>Loading response...</div>}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="E.g., Why a park?"
                  style={{
                    flex: 1,
                    padding: '6px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
           
            {}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>Vegetation</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                    {vegetationPercentage.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Source: Earth Observations Toolkit "Nasa partners"
                  </div>
                </div>
                <div style={{ backgroundColor: '#e0f2fe', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>Road Length</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
                    {roadLength.toFixed(2)} meters
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Source: INEGI
                  </div>
                </div>
                <div style={{ backgroundColor: '#fefce8', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>Total Population</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#b45309' }}>
                    {population}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Source: World Resource Institute "Nasa partners"
                  </div>
                </div>
                <div style={{ backgroundColor: '#f3e8ff', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>Infrastructure Types</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6d28d9' }}>
                    {infrastructureTypes.length > 0 ? infrastructureTypes.join(', ') : 'None'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Source: INEGI
                  </div>
                </div>
                <div style={{ backgroundColor: '#e0f2fe', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#4b5563' }}>Hydrological Coverage</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e90ff' }}>
                    {hydroPercentage.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Source: GHSL - Global Human Settlement Layer "Nasa partners" 
 
                  </div>
                </div>
              </div>
            </div>

            
            
          </div>
        </div>

        {}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;