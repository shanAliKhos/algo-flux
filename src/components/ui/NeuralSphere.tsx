import { useEffect, useRef } from "react";

export function NeuralSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; pulse: number }[] = [];
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const sphereRadius = Math.min(centerX, centerY) * 0.7;

    // Create nodes in a sphere pattern
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * sphereRadius;
      nodes.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw sphere glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, sphereRadius * 1.2
      );
      gradient.addColorStop(0, "rgba(127, 245, 127, 0.1)");
      gradient.addColorStop(0.5, "rgba(127, 245, 127, 0.05)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Draw connections
      ctx.strokeStyle = "rgba(127, 245, 127, 0.15)";
      ctx.lineWidth = 1;
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((other) => {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.globalAlpha = 1 - dist / 80;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        // Keep within sphere
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const dist = Math.hypot(dx, dy);
        if (dist > sphereRadius) {
          node.x = centerX + (dx / dist) * sphereRadius;
          node.y = centerY + (dy / dist) * sphereRadius;
          node.vx *= -0.8;
          node.vy *= -0.8;
        }

        const pulseScale = 1 + Math.sin(node.pulse) * 0.3;
        
        // Node glow
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 3 * pulseScale
        );
        nodeGradient.addColorStop(0, "rgba(127, 245, 127, 0.8)");
        nodeGradient.addColorStop(0.5, "rgba(127, 245, 127, 0.3)");
        nodeGradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3 * pulseScale, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = "#7FF57F";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
