"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form} from "@/components/ui/form"
import CustomFormFilde from "../CustomFormFilde"
import SubmitBtn from "../SubmitBtn"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
export enum FormFieldType{
  INPUT ='input',
  CHECKBOX='checkbox',
  TEXTAREA='textarea',
  PHONE_INPUT='phoneInput',
  DATE_PICKER='datePicker',
  SELECT='select',
  SKELETON='skeleton',
}



const PatientForm=()=> {
  const router=useRouter()
  const [isLoading,setisLoading]=useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email:'',
      phone:''
    },
  })
 

 async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
    setisLoading(true);
    try{
      const userData={name,email,phone}
     
      const user=await createUser(userData);
      if(user) router.push(`/patients/${user.$id}/register`);
    }catch(err){
      console.log(err);
      setisLoading(false);
    }
  }
  return (
    <div>

<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-6">
          <h1 className="header">Hey There!👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormFilde 
         control={form.control}
         fieldType={FormFieldType.INPUT}
         name="name"
         label="Full Name"
         placeholder="Kenan homsi" 
         iconSrc="/assets/icons/user.svg"
         iconAlt="user"
         />
          <CustomFormFilde 
         control={form.control}
         fieldType={FormFieldType.INPUT}
         name="email"
         label="Email"
         placeholder="kenan@gmail.com" 
         iconSrc="/assets/icons/email.svg"
         iconAlt="email"
         />
          <CustomFormFilde 
         control={form.control}
         fieldType={FormFieldType.PHONE_INPUT}
         name="phone"
         label="phone number"
         placeholder="555 123 4567" 
         />
        <SubmitBtn isLoading={isLoading} >Get started</SubmitBtn>
      </form>
    </Form>
    </div>
  )
}

export default PatientForm