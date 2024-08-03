"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from "@/lib/utils";
  
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"

const PassKeyModal = ({isAdmin}:{isAdmin:boolean}) => {
    const router=useRouter();
    const path=usePathname();
    const [open, setOpen] = useState(isAdmin)
    const [passkey, setpasskey] = useState('')
    const [error, setError] = useState('')
    const encerptedKey= typeof window !== 'undefined' ?
     localStorage.getItem('accessKey'):null;
     useEffect(()=>{
            if(path){
                const passkey=decryptKey(encerptedKey!)
                if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
                    // const encryptedKey=encryptKey(passkey);
                    // localStorage.setItem('accessKey',encryptedKey);
                    setOpen(false);
                    router.push('/admin');
                }else{
                    setOpen(true);

                }
            }
     },[encerptedKey])
    const validatePassKey=(e:React.MouseEvent<HTMLButtonElement,MouseEvent>)=>{
        e.preventDefault();
        if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY){
            const encryptedKey=encryptKey(passkey);
            localStorage.setItem('accessKey',encryptedKey);
            setOpen(false);
            router.push('/admin');
        }else{
            setError('Invalid PassKey,please try again.')
        }
    }
    const CloseModal=()=>{
        setOpen(false);
        router.push('/');
    }
  return (
    <div> 
        <AlertDialog open={open} onOpenChange={setOpen}>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-start justify-between">
                        Access Verification
                    <Image src='/assets/icons/close.svg' alt="close" className=" cursor-pointer" width={20}  height={20} onClick={()=>CloseModal()}/>        
                </AlertDialogTitle>
                <AlertDialogDescription>
                To access the admin page, please enter the passkey.....
                </AlertDialogDescription>
            </AlertDialogHeader>
                <div className="">
                <InputOTP maxLength={6} value={passkey} onChange={(value)=>setpasskey(value)}>
                <InputOTPGroup className="shad-otp text-green-500">
                    <InputOTPSlot className="shad-otp-slot " index={0} />
                    <InputOTPSlot className="shad-otp-slot" index={1} />
                    <InputOTPSlot className="shad-otp-slot" index={2} />
                    <InputOTPSlot className="shad-otp-slot" index={3} />
                    <InputOTPSlot className="shad-otp-slot" index={4} />
                    <InputOTPSlot className="shad-otp-slot" index={5} />
                </InputOTPGroup>
                </InputOTP>
                {error && <p className="shad-error text-14-regular mt-4 flex justify-center">
                    {error}</p>}
                </div>
            <AlertDialogFooter>
                <AlertDialogAction 
                onClick={(e)=>validatePassKey(e)}
                className="shad-primary-btn w-full">Enter admin panel</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default PassKeyModal