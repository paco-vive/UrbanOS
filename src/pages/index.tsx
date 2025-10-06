import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [temperature, setTemperature] = useState<string>("--");
  const [loadingText, setLoadingText] = useState("");
  const fullLoadingText = "Loading UrbanOS...";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullLoadingText.length) {
        setLoadingText(fullLoadingText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    const timer1 = setTimeout(() => setIsLoaded(true), 2500);
    const timer2 = setTimeout(() => setShowContent(true), 100);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const styles = {
    loadingOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transform: isLoaded ? 'scale(0)' : 'scale(1)',
      opacity: isLoaded ? 0 : 1,
    },
    loadingText: {
      color: '#7c3aed',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      fontFamily: '"SF Pro Display", -apple-system, sans-serif',
      textAlign: 'center' as const,
      letterSpacing: '0.05em',
      minHeight: '60px',
    },
    cursor: {
      display: 'inline-block',
      width: '3px',
      height: '40px',
      backgroundColor: '#a78bfa',
      marginLeft: '5px',
      animation: 'blink 0.7s infinite',
      verticalAlign: 'middle',
    },
    loadingBar: {
      width: '300px',
      height: '4px',
      backgroundColor: 'rgba(167, 139, 250, 0.2)',
      borderRadius: '10px',
      marginTop: '2rem',
      overflow: 'hidden',
      position: 'relative' as const,
    },
    loadingBarFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #a78bfa, #c7d2fe, #a78bfa)',
      borderRadius: '10px',
      animation: 'loading 2s ease-in-out infinite',
    },
    container: {
      minHeight: '100vh',
      background: 'white', 
      position: 'relative' as const,
      overflow: 'hidden' as const,
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transform: showContent ? 'scale(1)' : 'scale(1.5)',
      opacity: showContent ? 1 : 0,
      transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    cityscape: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '40px',
      paddingBottom: '1px',
    },
    road: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: '100%',
      height: '100px',
      background: ' #bab3daff 100%',
      zIndex: 8,
    
      overflow: 'hidden',
    },
    roadMarkings: {
      position: 'absolute' as const,
      top: '50%',
      left: 0,
      width: '100%',
      height: '4px',
      transform: 'translateY(-50%)',
      background: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255, 255, 255, 0.8) 30px, rgba(255, 255, 255, 0.8) 60px)',
      animation: 'roadScroll 3s linear infinite',
    },
    mainContent: {
      position: 'relative' as const,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center' as const,
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.7rem 1.6rem',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(167, 139, 250, 0.3)',
      borderRadius: '50px',
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#7c3aed',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(167, 139, 250, 0.15)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
    },
   mainTitle: {
      fontSize: 'clamp(3.5rem, 10vw, 7rem)',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 40%, #10b981 70%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1rem',
      lineHeight: '1',
      fontFamily: '"SF Pro Display", sans-serif',
      letterSpacing: '-0.03em',
    },
    subtitle: {
      fontSize: '2rem',
      background: 'linear-gradient(135deg, #a78bfa, #10b981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: '600',
      marginBottom: '2.5rem',
      fontFamily: '"SF Pro Display", sans-serif',
      letterSpacing: '0.15em',
    },
    description: {
      fontSize: '1.15rem',
      color: '#6b7280',
      lineHeight: '1.8',
      marginBottom: '3rem',
      maxWidth: '780px',
      background: 'rgba(255, 255, 255, 0.85)',
      padding: '2.5rem',
      borderRadius: '24px',
      border: '1px solid rgba(167, 139, 250, 0.2)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    },
    highlight: {
      color: '#652fc3ff',
      fontWeight: '600',
      
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '4rem',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      padding: '1.2rem 2.5rem',
      fontSize: '1.05rem',
      fontWeight: '600',
      fontFamily: '"SF Pro Display", sans-serif',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      
      boxShadow: '0 8px 25px rgba(167, 139, 250, 0.35)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em', 
      transition: 'all 0.3s ease',
            
    },
    secondaryButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      padding: '1.2rem 2.5rem',
      fontSize: '1.05rem',
      fontWeight: '600',
      fontFamily: '"SF Pro Display", sans-serif',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
            
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },

    infoCard: {
      maxWidth: '780px',
      background: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '24px',
      padding: '2.5rem',
      border: '1px solid rgba(167, 139, 250, 0.2)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      color: '#6b7280',
      fontSize: '1.05rem',
      fontWeight: '500',
      textAlign: 'center' as const,
      lineHeight: '1.8',
    },
  };

  const Car = ({ color, delay, duration }: any) => (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '-100px',
        width: '70px',
        height: '35px',
        animation: `carMove ${duration}s linear ${delay}s infinite`,
        filter: 'drop-shadow(0 8px 15px rgba(0, 0, 0, 0.3))',
      }}
    >
      {}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '20px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: '8px 8px 4px 4px',
        }}
      />
      {}
      <div
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '20%',
          width: '60%',
          height: '15px',
          background: `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`,
          borderRadius: '6px 6px 0 0',
        }}
      />
      {}
      <div
        style={{
          position: 'absolute',
          bottom: '17px',
          left: '25%',
          width: '20%',
          height: '10px',
          background: 'rgba(167, 189, 250, 0.6)',
          borderRadius: '3px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '17px',
          right: '25%',
          width: '20%',
          height: '10px',
          background: 'rgba(167, 189, 250, 0.6)',
          borderRadius: '3px',
        }}
      />
      {}
      <div
        style={{
          position: 'absolute',
          bottom: '-5px',
          left: '10px',
          width: '14px',
          height: '14px',
          background: 'radial-gradient(circle, #1f2937 0%, #111827 100%)',
          borderRadius: '50%',
          border: '2px solid #4b5563',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-5px',
          right: '10px',
          width: '14px',
          height: '14px',
          background: 'radial-gradient(circle, #1f2937 0%, #111827 100%)',
          borderRadius: '50%',
          border: '2px solid #4b5563',
        }}
      />
      {}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '-2px',
          width: '6px',
          height: '6px',
          background: '#fbbf24',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
        }}
      />
    </div>
  );

  const cars = [
   
    { color: '#f59e0b', delay: 0, duration: 12 },
    { color: '#3b82f6', delay: 3, duration: 14 },
    { color: '#ef4444', delay: 6, duration: 13 },
    { color: '#10b981', delay: 2, duration: 15 },
  
  ];

  const IsometricBuilding = ({ width, height, color, type, delay }: any) => {
    const perspective = width * 0.5;
    const roofHeight = width * 0.3;
    
    return (
      <div
        style={{
          position: 'relative',
          animation: `riseUp 1.2s ease-out ${delay}s both`,
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))',
        }}
      >
        

        {}
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: `linear-gradient(180deg, ${color}f8 0%, ${color}d5 100%)`,
            position: 'relative',
            zIndex: 3,
            overflow: 'hidden',
            boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.15)',
          }}
        >
          {}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: type === 'slim' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: type === 'round' ? '12px' : '8px',
              padding: '20px 15px',
              height: '100%',
            }}
          >
            {[...Array(type === 'tall' ? 18 : type === 'round' ? 18 : 21)].map((_, i) => {
              const isLit = Math.random() > 0.3;
              return (
                <div
                  key={i}
                  style={{
                    background: isLit
                      ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.8), rgba(139, 92, 246, 0.6))'
                      : 'linear-gradient(135deg, rgba(251, 191, 36, 0.7), rgba(245, 158, 11, 0.5))',
                    borderRadius: type === 'round' ? '50%' : '2px',
                    boxShadow: isLit
                      ? '0 0 15px rgba(167, 139, 250, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.5)'
                      : '0 0 10px rgba(251, 191, 36, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.3)',
                    animation: `glowWindow ${2 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 2}s`,
                  }}
                />
              );
            })}
          </div>

          {}
          {type !== 'round' &&
            [...Array(type === 'slim' ? 1 : 2)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: type === 'slim' ? '50%' : `${33 + i * 33}%`,
                  width: '1px',
                  height: '100%',
                  background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  opacity: 0.6,
                }}
              />
            ))}
        </div>


        {}
        {type === 'tall' && (
          <>
            <div
              style={{
                position: 'absolute',
                top: `-${roofHeight + 0}px`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '3px',
                height: '35px',
                background: 'linear-gradient(to top, rgba(167, 139, 250, 0.9), transparent)',
                zIndex: 6,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0px',
                  left: '-190%',
                  transform: 'translateX(0%)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #c7d2fe, #a78bfa)',
                  boxShadow: '0 0 25px rgba(167, 139, 250, 0.9), 0 0 50px rgba(167, 139, 250, 0.5)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </div>
          </>
        )}

       
      </div>
    );
  };

  const buildings = [
    { width: 110, height: 340, color: '#e9d5ff', type: 'tall', delay: 0.1 },
    { width: 95, height: 260, color: '#ddd6fe', type: 'medium', delay: 0.2 },
    { width: 130, height: 400, color: '#c7d2fe', type: 'tall', delay: 0.15 },
    { width: 105, height: 300, color: '#bae6fd', type: 'round', delay: 0.25 },
    { width: 80, height: 280, color: '#a7f3d0', type: 'slim', delay: 0.3 },
    { width: 120, height: 360, color: '#ddd6fe', type: 'medium', delay: 0.18 },
    { width: 105, height: 300, color: '#bae6fd', type: 'round', delay: 0.25 },
    { width: 80, height: 280, color: '#a7f3d0', type: 'slim', delay: 0.3 },
    { width: 120, height: 360, color: '#ddd6fe', type: 'tall', delay: 0.18 },
  ];

  return (
    <>
      {}
      <div style={styles.loadingOverlay}>
        <div style={styles.loadingText}>
          🌱 {loadingText}
          <span style={styles.cursor}></span>
        </div>
        <div style={{ fontSize: '1.1rem', marginTop: '1.5rem', color: '#7c3aed', opacity: 0.7 }}>
          Initializing urban systems...
        </div>
        <div style={styles.loadingBar}>
          <div style={styles.loadingBarFill}></div>
        </div>
      </div>

      {}
      <div style={styles.container}>
        {}
        <div style={styles.road}>
          <div style={styles.roadMarkings}></div>
          {cars.map((car, index) => (
            <Car key={index} {...car} />
          ))}
        </div>

        <div style={styles.cityscape}>
          {buildings.map((building, index) => (
            <IsometricBuilding key={index} {...building} />
          ))}
        </div>

        <div style={styles.mainContent}>


          <h1 style={styles.mainTitle}>UrbanOS</h1>
          <h2 style={styles.subtitle}>TORREÓN</h2>

          <div style={styles.description}>
            <strong>Why Torreón?</strong> This city faces unique environmental challenges including high
            temperatures, air quality issues, and urban heat islands. Our{' '}
            <span style={styles.highlight}>NASA powered platform</span> monitors air, heat, roads, infrastructure, demographics, hydrology, soil, and vegetation to build a more sustainable city. 
            Explore any neighborhood to <span style={styles.highlight}> view data, receive recommendations, and report local challenges </span> to improve urban planning and community wellbeing.
          </div>

          <div style={styles.buttonContainer}>
            <Link
              href="/map"
              style={styles.primaryButton}
              
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow =
                '0 9px 0 #8b1eafff, 0 15px 30px rgba(182, 37, 235, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 6px 0 #8b1eafff, 0 12px 25px rgba(182, 37, 235, 0.5)';
            }}
            >
              🚀 Launch Map
            </Link>

            <Link
              href="/report"
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 9px 0 #047857, 0 15px 25px rgba(16,185,129,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 0 #047857, 0 12px 20px rgba(16,185,129,0.3)';
          }}
            >
              📊 Write Report
            </Link>
          </div>

          
        </div>
      </div>

      <style jsx>{`
        @keyframes riseUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glowWindow {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes roadScroll {
          0% {
            transform: translateX(0) translateY(-50%);
          }
          100% {
            transform: translateX(60px) translateY(-50%);
          }
        }

        @keyframes carMove {
          0% {
            left: -100px;
          }
          100% {
            left: calc(100% + 100px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 3rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Home;