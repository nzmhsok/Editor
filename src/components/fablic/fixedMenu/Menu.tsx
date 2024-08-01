import React, { useEffect, useState, MouseEvent, useRef } from 'react';
import { fabric } from 'fabric';
import DefaultMenu from './defaultMenu/DefaultMenu';
import TextMenu from './textMenu/TextMenu';
import FontSizeMenu from './FontSizeMenu/FontSizeMenu';
import { Box, CssBaseline, styled, SwipeableDrawer, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Global } from '@emotion/react';
import { MenuProps } from '@/type/fabricType';

const Root = styled('div')(({ theme }) => ({
  // height: '50%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const Menu = ({
  canvas,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  continuous,
  setContinuous,
  saveState,
  containerElm,
  canvasElm,
  bubbleElm,
  setBubbleMenuPosition,
  setSelectObject,
  selectObject,
  gridLines,
  setGridLines,
  drawGrid,
  keep,
  isMobail,
  MAX_HISTORY,
  addToStack,
  restoreGridProperties
}: MenuProps) => {
  const [isFontSize, setIsFontSize] = useState<boolean>(false)
  const [isTextMenu, setIsTextMenu] = useState<boolean>(false)
  const [open, setOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null)
  const theme = useTheme();
  const drawwerHeightRef = useRef<string>('')
  useEffect(() => {
    drawwerHeightRef.current = isMobail ? '42%' : '17%'
  }, [isMobail])


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (undoStack.length > MAX_HISTORY) {
      undoStack.shift();
    }
  }, [undoStack])


  const clickInput = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // クリックイベントをバブリングしないようにする
    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
    if (input) {
      input.click(); // ファイル入力要素に対してclick()を呼び出す
    }
  };

  const showBubbleMenu = () => {
    const activeObj = canvas?.getActiveObject();
    if (canvasElm && canvas && bubbleElm && activeObj) {
      const canvasRect = canvasElm.getBoundingClientRect();

      const boundingRect = activeObj.getBoundingRect();
      // アクティブオブジェクトの右上にバブルメニューを表示
      let left = boundingRect.left + boundingRect.width + 10; // 右端に表示する
      let top = boundingRect.top; // デフォルトの位置計算

      // 上に出る場合の調整
      if (top < 0) {
        top = boundingRect.top + boundingRect.height; // 下に表示する
      }

      // 左右の画面外に出た場合の調整
      if (left > canvasRect.right) {
        left = canvasRect.right - boundingRect.width -50; // 画面右端に合わせる
      } else if (left < canvasRect.left) {
        left = canvasRect.left + 10; // 画面左端に合わせる
      }

      setBubbleMenuPosition({
        left: left,
        top: top,
      });
      setSelectObject(true);
    }
  };

  const handleSelectionCleared = () => {
    setIsTextMenu(false)
    setIsFontSize(false)
    setSelectObject(false);
    setOpen(false)
  };

  const handleSelectionCreatedOrUpdated = (e: fabric.IEvent) => {
    if (canvas) {
      let selectedObject = e.target;
      const activeObj = canvas.getActiveObject()

      if (activeObj?.type === 'textbox') {
        setIsTextMenu(true)
      }
      if (e.selected) {
        selectedObject = e.selected[0];
      } else if (e.target) {
        selectedObject = e.target;
      }
      if (selectedObject) {
        showBubbleMenu();
        setOpen(true)
      }
    }
  };

  useEffect(() => {
    if (canvas && bubbleElm) {
      canvas.on('selection:updated', handleSelectionCreatedOrUpdated);
      canvas.on('selection:created', handleSelectionCreatedOrUpdated);
      canvas.on('selection:cleared', handleSelectionCleared);
      canvas.on('mouse:up', handleSelectionCreatedOrUpdated);
    }

    return () => {
      if (canvas) {
        canvas.off('selection:updated', handleSelectionCleared);
        canvas.off('selection:created', handleSelectionCleared);
        canvas.off('selection:cleared', handleSelectionCleared);
        canvas.off('mouse:up', handleSelectionCreatedOrUpdated);
      }
    }
  }, [canvas, bubbleElm, canvasElm, selectObject])

  return (
    <div ref={containerRef} className={`fixed bottom-0 left-0 w-screen ${isMobail ? 'h-[40%]' : 'h-[15%]'} bg-primary flex justify-center items-center rounded-tl-[5rem] rounded-tr-[5rem]`}>
      {!open &&
        <DefaultMenu
          canvas={canvas}
          gridLines={gridLines}
          setGridLines={setGridLines}
          containerElm={containerElm}
          drawGrid={drawGrid}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
          saveState={saveState}
          setRedoStack={setRedoStack}
          setContinuous={setContinuous}
          clickInput={clickInput}
          continuous={continuous}
          redoStack={redoStack}
          keep={keep}
          isMobail={isMobail}
          addToStack={addToStack}
          restoreGridProperties={restoreGridProperties}
        />
      }
      {(open && !isMobail) &&
        <div className='w-full flex justify-center items-center h-full'>
          {(!isFontSize && isTextMenu) &&
            <TextMenu
              canvas={canvas}
              saveState={saveState}
              clickInput={clickInput}
              setIsFontSize={setIsFontSize}
              isMobail={isMobail}
            />
          }
          {
            (isFontSize && !isMobail) &&
            <FontSizeMenu canvas={canvas} saveState={saveState} setIsFontSize={setIsFontSize} />
          }
        </div>
      }
      {(containerRef.current && isMobail) &&
        <Root>
          <CssBaseline />
          <Global
            styles={{
              '.MuiDrawer-root > .MuiPaper-root': {
                height: drawwerHeightRef.current,
                overflow: 'visible',
                borderTopLeftRadius: '5rem',
                borderTopRightRadius: '5rem',
                border: `2 solid ${theme.palette.primary.main}`

              },
              '.MuiModal-root': {
                height: '17%'
              },
            }}
          />
          {containerRef.current && ( // containerRef.current が初期化されていることを確認
            <SwipeableDrawer
              // container={containerRef.current}
              anchor="bottom"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              swipeAreaWidth={0}
              disableSwipeToOpen={false}
              disableBackdropTransition={true}
              hideBackdrop={true}
              ModalProps={{
                keepMounted: true,
                hideBackdrop: true,
              }}

            >
              <Box
                sx={{
                  height: '100%',
                  overflow: 'auto',
                  backgroundColor: 'white',
                  borderTopLeftRadius: '5rem',
                  borderTopRightRadius: '5rem',
                  border: `2 solid ${theme.palette.primary.main}`
                }}
              >
                <div className='flex justify-center items-center h-full'>
                  {(!isFontSize && isTextMenu) &&
                    <TextMenu
                      canvas={canvas}
                      saveState={saveState}
                      clickInput={clickInput}
                      setIsFontSize={setIsFontSize}
                      isMobail={isMobail}
                    />
                  }
                  {
                    (isFontSize && !isMobail) &&
                    <FontSizeMenu canvas={canvas} saveState={saveState} setIsFontSize={setIsFontSize} />
                  }
                </div>
              </Box>
            </SwipeableDrawer>
          )}
        </Root>
      }

    </div>
  )
}

export default Menu
