import { EditIcon, PlusSquareIcon } from 'lucide-react'
import { ButtonCancel, ButtonOK } from '../icon-buttons'
import Loading from '../loading'

interface Props {
  onSaveClick?: () => void
  onCancelClick?: () => void
  loading?: boolean
  id?: string
  children?: any
  title?: string
  icon?:React.ReactNode
}
export function StandartForm({
  onCancelClick, onSaveClick, loading, id, children, title, icon
}: Props) {

  return (<div className='flex flex-col gap-4 h-full'>
    {!loading &&
      <div className='flex flex-col gap-4 '>
        <div className='flex justify-between border-b'>
          <h2 className='flex items-center gap-4 border-none'>
            {!icon && <>
            {id == 'addnew' && <PlusSquareIcon />}
            {id != 'addnew' && <EditIcon />}
            </>}
            {icon && <>{icon}</>}
            {title}
          </h2>
          <div className='flex gap-2'>
            {onSaveClick && <ButtonOK onClick={onSaveClick} />}
            {onCancelClick && <ButtonCancel onClick={onCancelClick} />}
          </div>
        </div>
        <div>
          {children}
        </div>

      </div>
    }
    {
      loading &&
      <div className='flex w-full h-full justify-center items-center'>
        <Loading />
      </div>
    }
  </div>)
}