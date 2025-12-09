import { motion } from 'motion/react';

export function PreciseBubbles() {
  // Exact bubble positions from the reference image
  const bubbles = [
    // Top left area
    { size: 45, left: 8, top: 15, delay: 0, blur: 0 },
    { size: 32, left: 4, top: 24, delay: 0.8, blur: 0 },
    
    // Left side around text
    { size: 60, left: 14, top: 35, delay: 1.2, blur: 0 },
    { size: 28, left: 3, top: 48, delay: 0.5, blur: 0 },
    { size: 38, left: 6, top: 62, delay: 1.5, blur: 0 },
    
    // Around the 'World's' text
    { size: 50, left: 24, top: 28, delay: 0.3, blur: 0 },
    { size: 35, left: 28, top: 52, delay: 1.8, blur: 0 },
    
    // Center area (around water ink)
    { size: 42, left: 42, top: 20, delay: 0.6, blur: 0 },
    { size: 55, left: 48, top: 48, delay: 1.1, blur: 0 },
    { size: 38, left: 52, top: 68, delay: 0.9, blur: 0 },
    
    // Right side of ink
    { size: 48, left: 64, top: 25, delay: 1.4, blur: 0 },
    { size: 40, left: 70, top: 52, delay: 0.4, blur: 0 },
    { size: 45, left: 68, top: 72, delay: 1.6, blur: 0 },
    
    // Far right
    { size: 35, left: 85, top: 18, delay: 0.7, blur: 0 },
    { size: 50, left: 92, top: 35, delay: 1.3, blur: 0 },
    { size: 38, left: 88, top: 58, delay: 0.2, blur: 0 },
    
    // Bottom area
    { size: 42, left: 20, top: 78, delay: 1.7, blur: 0 },
    { size: 36, left: 45, top: 85, delay: 0.5, blur: 0 },
    { size: 40, left: 75, top: 82, delay: 1.2, blur: 0 },
    
    // Additional scattered bubbles
    { size: 25, left: 15, top: 8, delay: 0.9, blur: 0 },
    { size: 30, left: 38, top: 12, delay: 1.5, blur: 0 },
    { size: 28, left: 72, top: 10, delay: 0.6, blur: 0 },
    { size: 26, left: 95, top: 15, delay: 1.8, blur: 0 },
    { size: 32, left: 10, top: 70, delay: 0.4, blur: 0 },
    { size: 30, left: 55, top: 82, delay: 1.1, blur: 0 },
  ];

  // Smaller bubbles
  const smallBubbles = Array.from({ length: 30 }, (_, i) => ({
    size: Math.random() * 12 + 8,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  // Tiny particles
  const particles = Array.from({ length: 80 }, (_, i) => ({
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
  }));

  return (
    <>
      {/* Main bubbles */}
      {bubbles.map((bubble, index) => (
        <motion.div
          key={`bubble-${index}`}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            background: 'radial-gradient(circle at 32% 28%, rgba(200, 235, 245, 0.3), rgba(180, 220, 235, 0.12) 45%, rgba(160, 205, 220, 0.05) 70%)',
            boxShadow: '0 4px 20px rgba(200, 235, 245, 0.08), inset -3px -3px 10px rgba(0, 0, 0, 0.15), inset 3px 3px 10px rgba(200, 235, 245, 0.2)',
            backdropFilter: 'blur(3px)',
            border: '1px solid rgba(200, 235, 245, 0.25)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.6, 0.85, 0.6],
            scale: 1,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: {
              duration: 5 + index * 0.3,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 0.6,
              delay: bubble.delay,
            },
            y: {
              duration: 4 + index * 0.2,
              delay: bubble.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        >
          {/* Inner highlight for glass effect */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '38%',
              height: '38%',
              top: '16%',
              left: '20%',
              background: 'rgba(200, 235, 245, 0.35)',
              filter: 'blur(5px)',
            }}
          />
          {/* Secondary smaller highlight */}
          <div 
            className="absolute rounded-full"
            style={{
              width: '20%',
              height: '20%',
              top: '25%',
              left: '30%',
              background: 'rgba(200, 235, 245, 0.25)',
              filter: 'blur(3px)',
            }}
          />
        </motion.div>
      ))}

      {/* Small bubbles */}
      {smallBubbles.map((bubble, index) => (
        <motion.div
          key={`small-${index}`}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            background: 'radial-gradient(circle at 35% 30%, rgba(200, 235, 245, 0.25), rgba(180, 220, 235, 0.08) 55%)',
            boxShadow: '0 2px 10px rgba(200, 235, 245, 0.06), inset 1px 1px 5px rgba(200, 235, 245, 0.2)',
            backdropFilter: 'blur(2px)',
            border: '0.5px solid rgba(200, 235, 245, 0.2)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4 + index * 0.2,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="absolute rounded-full"
            style={{
              width: '35%',
              height: '35%',
              top: '18%',
              left: '22%',
              background: 'rgba(200, 235, 245, 0.3)',
              filter: 'blur(2px)',
            }}
          />
        </motion.div>
      ))}

      {/* Tiny floating particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: 'rgba(200, 235, 245, 0.25)',
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 0.5, 0],
            scale: [0.3, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 6,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}
