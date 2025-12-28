import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import bubbleImg from "../assets/bubble.png";

function Bubble({ id, initialX, initialY, size, onPop, allBubbles, scrollHeight }) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const vx = useRef((Math.random() - 0.5) * 0.5);
  const vy = useRef((Math.random() - 0.5) * 0.5);
  const [isPopped, setIsPopped] = useState(false);

  useAnimationFrame(() => {
    if (isPopped) return;

    const currentX = x.get();
    const currentY = y.get();

    // Update position
    let newX = currentX + vx.current;
    let newY = currentY + vy.current;

    // Bounce off edges - use scrollHeight for vertical bounds
    if (newX <= 0 || newX >= window.innerWidth - size) {
      vx.current = -vx.current;
      newX = Math.max(0, Math.min(window.innerWidth - size, newX));
    }
    if (newY <= 0 || newY >= scrollHeight - size) {
      vy.current = -vy.current;
      newY = Math.max(0, Math.min(scrollHeight - size, newY));
    }

    // Check collision with other bubbles
    for (const other of allBubbles) {
      if (other.id === id) continue;
      
      const dx = newX - other.x;
      const dy = newY - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (size + other.size) / 2;

      if (distance < minDistance) {
        setIsPopped(true);
        onPop(id);
        return;
      }
    }

    x.set(newX);
    y.set(newY);
  });

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        x,
        y,
        width: size,
        height: size,
      }}
      animate={{
        scale: isPopped ? 0 : [1, 1.1, 1],
        opacity: isPopped ? 0 : [0.6, 0.7, 0.6],
      }}
      transition={{
        scale: isPopped
          ? { duration: 0.3 }
          : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
        opacity: isPopped
          ? { duration: 0.3 }
          : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
      }}
    >
      <img src={bubbleImg} alt="" className="w-full h-full object-contain" />
    </motion.div>
  );
}

export function FloatingBubbles() {
  const [bubbles, setBubbles] = useState([]);
  const [scrollHeight, setScrollHeight] = useState(0);
  const nextId = useRef(0);

  useEffect(() => {
    const updateScrollHeight = () => {
      setScrollHeight(Math.max(document.documentElement.scrollHeight, window.innerHeight));
    };

    updateScrollHeight();
    
    // Update scroll height when window resizes or content changes
    window.addEventListener('resize', updateScrollHeight);
    const observer = new MutationObserver(updateScrollHeight);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updateScrollHeight);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollHeight === 0) return;

    // Initialize bubbles throughout the entire scrollable area
    const initialBubbles = Array.from({ length: 25 }, () => ({
      id: nextId.current++,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * scrollHeight,
      size: Math.random() * 25 + 20,
    }));
    setBubbles(initialBubbles);
  }, [scrollHeight]);

  const handlePop = (id) => {
    // Remove the popped bubble
    setBubbles((prev) => prev.filter((b) => b.id !== id));

    // Add a new bubble after a delay
    setTimeout(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: nextId.current++,
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() < 0.5 ? -50 : scrollHeight + 50,
          size: Math.random() * 25 + 20,
        },
      ]);
    }, 2000);
  };

  return (
    <div className="absolute pointer-events-none overflow-hidden" style={{ top: 0, left: 0, width: '100%', height: scrollHeight }}>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          id={bubble.id}
          initialX={bubble.x}
          initialY={bubble.y}
          size={bubble.size}
          onPop={handlePop}
          allBubbles={bubbles}
          scrollHeight={scrollHeight}
        />
      ))}
    </div>
  );
}
