import { Button } from './ui/button'
import Image from 'next/image'
interface BtnProps{
    isLoading:boolean,
    className?:string,
    children:React.ReactNode
}
const SubmitBtn = ({isLoading,className,children}:BtnProps) => {
  return (
    <Button type='submit' disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
        {isLoading ? (
            <div className=' flex items-center gap-4'>
                <Image src='' alt='loader' 
                width={24} height={24} 
                className='animate-spin'/>
                ...loading
            </div>
        ):children }
    </Button>
  )
}

export default SubmitBtn