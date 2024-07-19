import FontDownloadIcon from '@mui/icons-material/FontDownload';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

interface ChangeFontBtnMbProps {
  canvas: fabric.Canvas | null;
  activeObj: Object | null;
  saveState: () => void;
}

const ChangeFontBtnMb = ({ canvas, activeObj, saveState }: ChangeFontBtnMbProps) => {
  const [open, setOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState('Arial');

  const handleFontFamilyChange = (event: SelectChangeEvent<string>) => {

    const newFont = event.target.value;
    setFontFamily(newFont);

    if (!canvas) return;

    const activeObject = activeObj as fabric.Textbox | undefined;
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set({ fontFamily: newFont });
      canvas.renderAll();
      saveState();
    }

  };
  return (
    <div>
      <div className='text-primary'>
        フォント
      </div>
      <Select className='w-full' value={fontFamily} onChange={handleFontFamilyChange}
        onClose={() => setOpen(false)}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            style: {
              maxHeight: 200, // メニューの最大高さを設定
            },
          },
        }}
        >
        <MenuItem value="Arial">Arial</MenuItem>
        <MenuItem value="Helvetica">Helvetica</MenuItem>
        <MenuItem value="Times New Roman">Times New Roman</MenuItem>
        <MenuItem value="Courier New">Courier New</MenuItem>
        <MenuItem value="Verdana">Verdana</MenuItem>
      </Select>
    </div >
  )
}

export default ChangeFontBtnMb