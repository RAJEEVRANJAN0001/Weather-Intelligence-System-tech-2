import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    const stars = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random(),
        deltaAlpha: Math.random() * 0.02 + 0.005
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        // Twinkling effect
        star.alpha += star.deltaAlpha;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.deltaAlpha = -star.deltaAlpha;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-950/50 via-purple-950/50 to-indigo-950/50" />
      
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Enhanced Nebula blobs with multiple layers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large background blobs */}
        <div className="nebula-blob w-[600px] h-[600px] bg-gradient-to-br from-blue-600/30 to-cyan-600/20 top-[-15%] left-[-10%]" 
             style={{ animationDelay: '0s', animationDuration: '25s' }} />
        <div className="nebula-blob w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 to-pink-600/20 top-[10%] right-[-12%]" 
             style={{ animationDelay: '4s', animationDuration: '30s' }} />
        <div className="nebula-blob w-[450px] h-[450px] bg-gradient-to-br from-indigo-600/30 to-blue-600/20 bottom-[-10%] left-[25%]" 
             style={{ animationDelay: '8s', animationDuration: '28s' }} />
        <div className="nebula-blob w-[400px] h-[400px] bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 bottom-[15%] right-[15%]" 
             style={{ animationDelay: '12s', animationDuration: '32s' }} />
        
        {/* Medium accent blobs */}
        <div className="nebula-blob w-[300px] h-[300px] bg-gradient-to-br from-teal-500/20 to-emerald-500/10 top-[40%] left-[15%]" 
             style={{ animationDelay: '2s', animationDuration: '22s' }} />
        <div className="nebula-blob w-[250px] h-[250px] bg-gradient-to-br from-rose-500/20 to-orange-500/10 top-[60%] right-[30%]" 
             style={{ animationDelay: '6s', animationDuration: '26s' }} />
        
        {/* Small highlight blobs */}
        <div className="nebula-blob w-[200px] h-[200px] bg-gradient-to-br from-cyan-400/25 to-sky-400/15 top-[25%] left-[60%]" 
             style={{ animationDelay: '10s', animationDuration: '20s' }} />
        <div className="nebula-blob w-[180px] h-[180px] bg-gradient-to-br from-amber-400/20 to-yellow-400/10 bottom-[40%] left-[5%]" 
             style={{ animationDelay: '14s', animationDuration: '24s' }} />
      </div>
      
      {/* Radial gradient overlay for depth */}
      <div className="fixed inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none z-0" />
    </>
  );
};

export default AnimatedBackground;
