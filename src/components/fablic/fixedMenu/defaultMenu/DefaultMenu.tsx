import AddFileBtn from "./AddFileBtn"
import AddTextBtn from "./AddTextBtn"
import ExportImageBtn from "./ExportImageBtn"
import ExportPdfBtn from "./ExportPdfBtn"
import RedoBtn from "./RedoBtn"
import UndoBtn from "./UndoBtn"
import SaveBtn from "./SaveBtn"
import DeleteBtn from "./DeleteBts"
import { DefaultMenuProps } from "@/type/fabricType"

const DefaultMenu = ({ canvas, gridLines, setGridLines, containerElm, drawGrid, undoStack, setUndoStack, saveState, setRedoStack, setContinuous, clickInput, continuous, redoStack, keep, isMobail, addToStack, restoreGridProperties }: DefaultMenuProps) => {
  const style = () => {
    let style;
    if(isMobail) {
      style = 'grid-cols-2 w-11/12 gap-y-10';
    } else if (keep) {
      style = 'grid-cols-8 w-2/3'
    } else {
      style = 'grid-cols-7 w-2/3'
    }

    return style
  }
  return (
    <div className={`grid ${style()}`}>
      <AddTextBtn canvas={canvas} saveState={saveState} />
      <AddFileBtn canvas={canvas} saveState={saveState} clickInput={clickInput} />
      {!isMobail &&
        <>
          <UndoBtn canvas={canvas} undoStack={undoStack} setUndoStack={setUndoStack} continuous={continuous} setContinuous={setContinuous} setRedoStack={setRedoStack} isMobile ={isMobail} addToStack={addToStack} restoreGridProperties={restoreGridProperties} />
          <RedoBtn canvas={canvas} redoStack={redoStack} setRedoStack={setRedoStack} setUndoStack={setUndoStack} isMobile ={isMobail} addToStack={addToStack} restoreGridProperties={restoreGridProperties} />
        </>
      }
      <ExportImageBtn canvas={canvas} gridLines={gridLines} setGridLines={setGridLines} drawGrid={drawGrid} />
      <ExportPdfBtn canvas={canvas} gridLines={gridLines} setGridLines={setGridLines} containerElm={containerElm} drawGrid={drawGrid} />
      <SaveBtn canvas={canvas} setGridLines={setGridLines} gridLines={gridLines} keep={keep} isMobail={isMobail} />
      {keep &&
        <DeleteBtn uuid={keep.uuid} isMobaile={isMobail}/>
      }
    </div>
  )
}

export default DefaultMenu
