import { MouseEvent } from "react"
import AddFileBtn from "./AddFileBtn"
import AddTextBtn from "./AddTextBtn"
import ExportImageBtn from "./ExportImageBtn"
import ExportPdfBtn from "./ExportPdfBtn"
import RedoBtn from "./RedoBtn"
import UndoBtn from "./UndoBtn"
import SaveBtn from "./SaveBtn"
import DeleteBtn from "./DeleteBts"
interface DefaultMenuProps {
  canvas: fabric.Canvas | null;
  gridLines: fabric.Line[];
  setGridLines: React.Dispatch<React.SetStateAction<fabric.Line[]>>;
  containerElm: HTMLDivElement | null;
  drawGrid: (canvas: fabric.Canvas) => void;
  undoStack: string[];
  setUndoStack: React.Dispatch<React.SetStateAction<string[]>>;
  continuous: boolean;
  setContinuous: React.Dispatch<React.SetStateAction<boolean>>;
  redoStack: string[];
  setRedoStack: React.Dispatch<React.SetStateAction<string[]>>;
  maxHistory: number;
  saveState: () => void;
  clickInput: (e: MouseEvent<HTMLButtonElement>) => void;
  width: number;
  height: number;
  keep: {
    uuid: string;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
  } | null;
  isMobail: boolean
}
const DefaultMenu = ({ canvas, gridLines, setGridLines, containerElm, drawGrid, undoStack, setUndoStack, saveState, setRedoStack, maxHistory, setContinuous, clickInput, continuous, redoStack, width, height, keep, isMobail }: DefaultMenuProps) => {
  return (
    <div className={`grid ${isMobail ? 'grid-cols-2 w-11/12 gap-y-10' : 'grid-cols-8 w-2/3'}`}>
      <AddTextBtn canvas={canvas} saveState={saveState} />
      <AddFileBtn canvas={canvas} saveState={saveState} clickInput={clickInput} />
      {!isMobail &&
        <>
          <UndoBtn canvas={canvas} undoStack={undoStack} setUndoStack={setUndoStack} continuous={continuous} setContinuous={setContinuous} setRedoStack={setRedoStack} maxHistory={maxHistory} isMobaile={isMobail} />
          <RedoBtn canvas={canvas} redoStack={redoStack} setRedoStack={setRedoStack} setUndoStack={setUndoStack} maxHistory={maxHistory} isMobaile={isMobail} />
        </>
      }
      <ExportImageBtn canvas={canvas} gridLines={gridLines} setGridLines={setGridLines} drawGrid={drawGrid} />
      <ExportPdfBtn canvas={canvas} gridLines={gridLines} setGridLines={setGridLines} containerElm={containerElm} drawGrid={drawGrid} />
      <SaveBtn canvas={canvas} width={width} height={height} setGridLines={setGridLines} gridLines={gridLines} keep={keep} />
      {keep &&
        <DeleteBtn uuid={keep.uuid} />
      }
    </div>
  )
}

export default DefaultMenu
