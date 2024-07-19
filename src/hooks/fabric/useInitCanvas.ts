import { useEffect, useRef, useState } from "react";
import { fabric } from 'fabric-with-gestures';

interface CustomLineOptions extends fabric.ILineOptions {
  isGrid?: boolean;
}

export const useInitCanvas = (aspectRatio: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [gridLines, setGridLines] = useState<fabric.Line[]>([]);
  const [windowSize, setWindowSize] = useState<{ windowWidth: number | undefined, windowHeight: number | undefined }>({
    windowWidth: undefined,
    windowHeight: undefined,
  });
  const [isMobail, setIsMobail] = useState(true);
  const handleResize = () => {
    setWindowSize({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      setIsMobail(window.innerWidth < window.innerHeight);

      // 初期サイズを設定
      handleResize();

      // リサイズイベントを設定
      window.addEventListener('resize', handleResize);

      // クリーンアップ関数
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  // キャンバスの高さと幅を設定
  useEffect(() => {
    if (containerRef.current && windowSize.windowWidth && windowSize.windowHeight) {
      if (windowSize.windowWidth < windowSize.windowHeight) {
        const offsetWidth = containerRef.current.clientWidth;
        const offsetHeight = offsetWidth / aspectRatio;

        setCanvasHeight(offsetHeight);
        setCanvasWidth(offsetWidth);
      } else {
        const offsetHeight = containerRef.current.offsetHeight;
        const offsetWidth = offsetHeight * aspectRatio;

        setCanvasHeight(offsetHeight);
        setCanvasWidth(offsetWidth);
      }
    }
  }, [containerRef, windowSize]);

  // fabricキャンバス初期化
  useEffect(() => {
    const canvasElm = canvasRef.current;
    if (!canvasElm || canvasWidth === 0 || canvasHeight === 0) return;
    const canvasInstance = new fabric.Canvas(canvasElm, {
      selection: false,
    });

    setCanvas(canvasInstance);
    // Cleanup on unmount
    return () => {
      if (canvasInstance) {
        canvasInstance.dispose();
      }
    };
  }, [canvasWidth, canvasHeight]);

  const drawGrid = (canvas: fabric.Canvas) => {
    const canvasHeight = canvas.getHeight(); // キャンバスの高さを取得
    const gridSize = canvasHeight / 4; // キャンバスの高さを4分割したサイズをグリッドサイズとする
    const canvasWidth = canvas.getWidth(); // キャンバスの幅を取得
    const lines: fabric.Line[] = [];

    // 垂直線を描画
    for (let i = 0; i <= canvasWidth / gridSize; i++) {
      const vertical = new fabric.Line(
        [i * gridSize, 0, i * gridSize, canvasHeight],
        { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
      );
      lines.push(vertical);
      canvas.add(vertical);
      vertical.moveTo(0);
    }

    // 水平線を描画
    for (let i = 0; i <= canvasHeight / gridSize; i++) {
      const horizontal = new fabric.Line(
        [0, i * gridSize, canvasWidth, i * gridSize],
        { stroke: '#ccc', selectable: false, evented: false, isGrid: true } as CustomLineOptions
      );
      lines.push(horizontal);
      canvas.add(horizontal);
      horizontal.moveTo(0);
    }

    setGridLines(lines);
  };

  return {
    canvas,
    isMobail,
    canvasRef,
    containerRef,
    canvasWidth,
    canvasHeight,
    drawGrid,
    setGridLines,
    gridLines
  };
};