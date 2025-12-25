import { useEffect, useRef } from "react";

interface MiniChartProps {
  data?: number[];
  color?: "primary" | "bullish" | "bearish";
  height?: number;
}

export function MiniChart({ data, color = "primary", height = 40 }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chartData = data || Array.from({ length: 30 }, () => Math.random() * 100);
    
    const width = canvas.offsetWidth;
    const h = height;
    canvas.width = width * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);

    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;

    const colors = {
      primary: { line: "#7FF57F", fill: "rgba(127, 245, 127, 0.1)" },
      bullish: { line: "#7FF57F", fill: "rgba(127, 245, 127, 0.1)" },
      bearish: { line: "#ef4444", fill: "rgba(239, 68, 68, 0.1)" },
    };

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, colors[color].fill);
    gradient.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.moveTo(0, h);
    chartData.forEach((val, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const y = h - ((val - min) / range) * h * 0.9;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(width, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    chartData.forEach((val, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const y = h - ((val - min) / range) * h * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colors[color].line;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw endpoint dot
    const lastX = width;
    const lastY = h - ((chartData[chartData.length - 1] - min) / range) * h * 0.9;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = colors[color].line;
    ctx.fill();

  }, [data, color, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
}
