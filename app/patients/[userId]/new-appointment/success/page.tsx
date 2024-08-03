import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.actions';
const SuccessPage = async ({params:{userId},searchParams}:SearchParamProps) => {
    const appointmentId = (searchParams.appointmentId as string) || '';
    const appointmentData=await getAppointment(appointmentId);
    const docktor=Doctors.find((doc)=> doc.name === appointmentData.primaryPhysician)
    const user=await getUser(userId);
    Sentry.metrics.set("user_view_appointment_SuccessPage", 'user.name');
  return (
    <div className=' flex h-screen max-h-screen px-[5%]'>
            <div className="success-img">
                <Link href='/'>
                    <Image src='/assets/icons/logo-full.svg'
                    width={1000} height={1000} alt='succesLogo'
                    className='h-10 w-fit' />
                </Link>
                <section className='flex flex-col items-center'>
                    <Image src='/assets/gifs/success.gif' height={300} width={280} alt='success' />
                    <h2 className='header text-center mb-6 max-w-[600px]'>
                    Your <span className='text-green-500'>appointment request</span> has been successfully submitted!
                    </h2>
                    <p>{`We\'ll be in touch shortly to confirm.`}</p>
                </section>
                <section className='request-details'>
                        <p>Requested appointment details:</p>
                        <div className=" flex items-center gap-3">
                            <Image  src={docktor?.image!} width={100} height={100} alt='docktor' className='size-6'/>
                            <p className=' whitespace-nowrap'>Dr.{docktor?.name}</p>
                        </div>
                        <div className=" flex gap-2">
                        <Image  src='/assets/icons/calendar.svg' width={24} height={24} alt='calendar' className='calendar'/>
                        <p>{formatDateTime(appointmentData.schedule).dateTime}</p>
                        </div>
                </section>
                <Button variant={'outline'} className='shad-primary-btn' asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                    new appointment</Link>
                </Button>
                <p className=" py-6 copyright ">©2024 CarePulse</p>
            </div>
    </div>
  )
}

export default SuccessPage