import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackBtnProps {
  canvas: fabric.Canvas | null;
}

const BackBtn = ({ canvas }: BackBtnProps) => {

  const focusOut = () => {
    if (canvas) {
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  return (
    <button type='button' onClick={focusOut}>
      <div className='flex justify-center'>
        <ArrowBackIcon />
      </div>
      <div>
        <p className='text-xs'>
          戻る
        </p>
      </div>
    </button>
  )
}

export default BackBtn