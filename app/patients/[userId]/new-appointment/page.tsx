import React from 'react'
import Image from 'next/image'
import AppointmentForm from '@/components/Forms/AppointmentForm'
import { getPatient } from '@/lib/actions/patient.actions';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs'
const NewAppointment = async ({params:{userId}}:SearchParamProps) => {
  const patient =await getPatient(userId);
  
  Sentry.metrics.set("user_view_Appointment", patient.name);
  return (
    <div className="flex h-screen max-h-screen">
        
    <section className="remove-scrollbar container ">
      <div className=" sub-container max-w-[860px] flex-1 flex-col py-10">
        <Link href='/'>
            <Image src='/assets/icons/logo-full.svg' alt="patient" 
            height={1000} width={1000} 
            className="mb-12 h-10 w-fit"/>
        </Link>
  
            <AppointmentForm 
            type="create"
            userId={userId} 
            patientId={patient.$id}/>
          <p className=" py-6 copyright mt-10">©2024 CarePulse</p>
       
      </div>
    </section>
    <Image src="/assets/images/appointment-img.png" height={1000}
     width={1000} alt="patient" 
     className=" side-img max-w-[390px]" />
</div>
  )
}

export default NewAppointment