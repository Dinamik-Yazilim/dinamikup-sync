import { CheckIcon, ListTreeIcon, PlusCircleIcon, PlusIcon, PlusSquareIcon, XIcon } from 'lucide-react'
import { Button } from './ui/button'

interface ButtonProps {
  className?: string
  onClick?: () => void
}
export function ButtonOK({ className, onClick }: ButtonProps) {
  return (
    <Button
      className={`bg-blue-600 text-white hover:bg-blue-800 hover:text-white px-2 ${className}`}
      variant={'outline'}
      size={'sm'}
      onClick={() => onClick && onClick()}
    >
      <CheckIcon size={'24px'} />
    </Button>
  )
}

export function ButtonCancel({ className, onClick }: ButtonProps) {
  return (
    <Button
      className={`bg-gray-600 text-white hover:bg-gray-800 hover:text-white px-2 ${className}`}
      variant={'outline'}
      size={'sm'}
      onClick={() => onClick && onClick()}
    >
      <XIcon size={'24px'} />
    </Button>
  )
}
export function ButtonLinePlus({ className, onClick }: ButtonProps) {
  return (
    <Button
      className={`bg-green-600 text-white hover:bg-green-800 hover:text-white px-2 flex gap-1 ${className}`}
      variant={'outline'}
      size={'sm'}
      onClick={() => onClick && onClick()}
    >
      <ListTreeIcon size={'24px'} /><PlusSquareIcon size={'24px'} />
    </Button>
  )
}