'use client'

import { useEffect, useRef } from "react";
import * as paper from "paper";

interface AsciiCanvasProps {
    imageUrl: string
}

const AsciiCanvas = ({ imageUrl }: AsciiCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let scope: any = null;

            if (!canvasRef.current) return;

            paper.setup(canvasRef.current); // Initialize Paper.js on the canvas
            // 1. Create a completely isolated Paper instance scope
            scope = new paper.PaperScope();
            scope.setup(canvasRef.current);
            scope.activate(); // Force this canvas context to be active

            // 2. Initialize the raster explicitly using the scope object
            const raster = new scope.Raster({
                source: imageUrl,
                position: scope.view.center // Anchored safely to the scoped view
            });

            // raster.crossOrigin = 'anonymous';
            raster.visible = false;

            const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
            const textItems: any[] = [];
            const SPACING = 12;

            raster.onLoad = () => {
                raster.fitBounds(scope.view.bounds);

                for (let y = 0; y < raster.height; y += SPACING) {
                    for (let x = 0; x < raster.width; x += SPACING) {
                        const color = raster.getPixel(x, y);
                        if (!color) continue;

                        const brightness = color.gray;
                        const charIndex = Math.floor(brightness * (asciiChars.length - 1));
                        const char = asciiChars[charIndex];

                        const textItem = new scope.PointText({
                            point: new scope.Point(x, y),
                            content: char,
                            fillColor: color,
                            fontSize: SPACING,
                            fontWeight: 'bold',
                            fontFamily: 'Courier New, monospace'
                        });
                        textItems.push(textItem);
                    }
                }

                scope.view.onFrame = (event: any) => {
                    textItems.forEach((textItem, index) => {
                        let spinSpeed = 12;

                        spinSpeed += (index % 3) * 0.5;

                        textItem.rotate(spinSpeed);
                    });
                };
            };
   

        return () => {
            if (scope && scope.project) {
                scope.project.clear();
            }
        };
    }, [imageUrl]);

    return (
        <canvas
            ref={canvasRef}
            className="block w-screen h-screen bg-black"
        />
    )
}

export default AsciiCanvas;