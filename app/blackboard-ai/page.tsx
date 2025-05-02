"use client";

import React, { useRef, useState, useEffect } from "react";
import { Inter } from 'next/font/google'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'] })

const Whiteboard = () => {
  const URL = process.env.NEXT_PUBLIC_VITE_MAGIC_BOARD_BE_URL;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [penSize, setPenSize] = useState(2);
  const [eraserSize, setEraserSize] = useState(20);
  const [penColor, setPenColor] = useState("#ffffff"); // Default to white
  const [result, setResult] = useState("");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.55; // Adjusted height

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const preventTouchDefault = (e: Event) => {
      e.preventDefault();
    };

    canvas.addEventListener("touchstart", preventTouchDefault, { passive: false });
    canvas.addEventListener("touchmove", preventTouchDefault, { passive: false });
    canvas.addEventListener("touchend", preventTouchDefault, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", preventTouchDefault);
      canvas.removeEventListener("touchmove", preventTouchDefault);
      canvas.removeEventListener("touchend", preventTouchDefault);
    };
  }, []);

  const getCursorPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (e instanceof TouchEvent && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return {x:0, y:0}
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCursorPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCursorPosition(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === "pen" ? penColor : "#1a1a1a";
    ctx.lineWidth = tool === "pen" ? penSize : eraserSize;
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setResult('');
  };

  const sendCanvasToBackend = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageBase64 = canvas.toDataURL("image/png");
    try {
      const response = await fetch(`${URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageBase64,
          variables: { x: 5, y: 10 }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProblem(`Expression: ${data.problem}`);
        setResult(`Result: ${data.result}`);
        console.log(`Extracted Problem: ${data.problem}\nResult: ${data.result}`);
      } else {
        setResult(`Error: ${data.message}`);
      }
    } catch (error: any) {
      console.error("Error connecting to backend:", error);
      setResult("Failed to connect to the backend. Please try again.");
    }
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageBase64 = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = imageBase64;
    downloadLink.download = "whiteboard_screenshot.png";
    downloadLink.click();
  };

  const randomStyle = () => {
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    return {
      position: `absolute`,
      left: `${random(0, 100)}vw`,
      animationName: `fall`,
      top: `0`,
      animationIterationCount: `infinite`,
      fontSize: `${random(15, 20)}px`,
      animationDuration: `${random(10, 20)}s`,
      animationDelay: `${random(0, 5)}s`,
      transform: `rotate(${random(0, 90)}deg)`,
      opacity: `${random(0, 0.2)}`
    };
  };

  const fallingItems = [
    "y = mx + c",
    "∫xdx",
    "(a+b)²",
    "E = mc²",
    "sin(x) + cos(x)",
    "📚",
    "✏️",
    "🍎",
    "🚀",
    "📐",
    "a² + b² = c²",
    "🧮",
    "1 + 1 = 2",
    "πr²",
    "Δy/Δx",
    "∑x",
    "log(x)",
    "∞",
    "√x",
    "θ",
    "cos(θ)",
    "tan(θ)",
    "∂f/∂x",
    "v = u + at",
    "F = ma",
    "🌟",
    "🌍",
    "🌌",
    "☀️",
    "🎨",
    "📓",
    "✂️",
    "🎲",
    "🖋️",
    "x³",
    "∫e^x dx",
    "Ω",
    "⊗",
    "∘",
    "⇔",
    "∀x ∈ ℝ",
    "∃y",
    "ℕ",
    "φ",
    "∆",
    "v(t)",
    "∂²/∂x²",
    "lim(x→∞)",
    "∫∫dxdy",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Falling Items */}
      <div className="falling-items">
        {fallingItems.map((item, index) => (
          <div
            key={index}
            className="falling"
            style={randomStyle() as React.CSSProperties}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="rounded-lg shadow-md p-6 bg-gray-800"> {/* Changed background to dark gray */}
          <h1 className="text-2xl font-semibold mb-4 text-center">Whiteboard</h1>

           {/* Toolbar */}
           <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setTool("pen")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
                tool === "pen" ? "bg-gray-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-gray-200" // Darker toolbar buttons
              )}
            >
              Pen
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
                tool === "eraser" ? "bg-gray-700 text-white" : "bg-gray-600 hover:bg-gray-700 text-gray-200" // Darker toolbar buttons
              )}
            >
              Eraser
            </button>
            <button onClick={clearCanvas} className="rounded-full px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white">
              Clear
            </button>
            <button onClick={sendCanvasToBackend} className="rounded-full px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white">
              Calculate
            </button>
            <button onClick={downloadCanvasImage} className="rounded-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white">
              Download
            </button>
          </div>

          {/* Settings */}
          <div className="flex items-center space-x-4 mb-4">
            {tool === "pen" && (
              <div className="flex items-center space-x-2">
                <label htmlFor="penSize" className="text-sm font-medium text-gray-300">Pen Size:</label>
                <input
                  type="range"
                  id="penSize"
                  min="1"
                  max="20"
                  value={penSize}
                  onChange={(e) => setPenSize(Number(e.target.value))}
                  className="w-32 h-1 rounded-full bg-gray-700 appearance-none cursor-pointer" // Darker slider
                />
                <span className="text-sm text-gray-500">{penSize}px</span>
              </div>
            )}

            {tool === "eraser" && (
              <div className="flex items-center space-x-2">
                <label htmlFor="eraserSize" className="text-sm font-medium text-gray-300">Eraser Size:</label>
                <input
                  type="range"
                  id="eraserSize"
                  min="10"
                  max="50"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(Number(e.target.value))}
                  className="w-32 h-1 rounded-full bg-gray-700 appearance-none cursor-pointer" // Darker slider
                />
                <span className="text-sm text-gray-500">{eraserSize}px</span>
              </div>
            )}

            {tool === "pen" && (
              <div className="flex items-center space-x-2">
                <label htmlFor="penColor" className="text-sm font-medium text-gray-300">Pen Color:</label>
                <input
                  type="color"
                  id="penColor"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="w-8 h-8 rounded-full border border-gray-700 cursor-pointer" // Darker border
                />
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="flex justify-center"> {/* Centering the canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="shadow-lg rounded-lg"
            />
          </div>

          {/* Result */}
          <div className="mt-6 p-4 rounded-md bg-gray-700 text-center"> {/* Darker Result background */}
            {result && (
              <>
                <h2 className="text-lg font-semibold mb-2">Answer:</h2>
                <h3 className="text-gray-300">{problem}</h3>
                <h3 className="text-green-400">{result}</h3>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(-90deg);
            opacity: 0.2;
          }
          100% {
            transform: translateY(100vh) rotate(90deg);
            opacity: 0;
          }
        }

        .falling-items {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .falling {
          position: absolute;
          white-space: nowrap;
          will-change: transform;
        }

         /* Styling for sliders (dark theme) */
         input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #444;
          outline: none;
          -webkit-transition: .2s;
          transition: opacity .2s;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1; /* Indigo */
          cursor: pointer;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1; /* Indigo */
          cursor: pointer;
          border: 0;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Whiteboard;