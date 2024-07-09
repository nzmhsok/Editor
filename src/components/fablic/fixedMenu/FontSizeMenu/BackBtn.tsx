import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface BackBtnProps {
  setIsFontSize: React.Dispatch<React.SetStateAction<boolean>>
}
const BackBtn = ({ setIsFontSize }: BackBtnProps) => {
  return (
    <div className='mr-5'>
      <button type='button' onClick={() => { setIsFontSize(false) }} className='hover:opacity-75'>
        <div className='flex justify-center'>
          <ArrowBackIcon fontSize='large' />
        </div>
        <div>
          <p >
            戻る
          </p>
        </div>
      </button>
    </div>
  )
}

export default BackBtn
