"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormFilde"
import SubmitBtn from "../SubmitBtn"
import { useState } from "react"
import {  getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import { Doctors } from "@/constants"
import { createAppointment ,UpdateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"


const AppointmentForm = ({type,userId, patientId,appointment,setOpen}:{
    type:'create' | 'cancel' | 'schedule',
    userId:string, 
    patientId:string,
    appointment?:Appointment | undefined,
    setOpen?:(v:boolean)=>void
}) => {
    const router=useRouter()
    const [isLoading,setisLoading]=useState(false);

    const appointmentSchema=getAppointmentSchema(type);
    const form = useForm<z.infer<typeof appointmentSchema>>({
      resolver: zodResolver(appointmentSchema),
      defaultValues: {
        primaryPhysician: appointment && appointment.primaryPhysician,
        schedule: appointment ?  new Date(appointment.schedule):new Date(),
        reason: appointment ? appointment.reason:'',
        note: appointment ? appointment.note:'',
        cancellationReason:appointment&& appointment.cancellationReason || ''
      },
    })
   
  
   async function onSubmit(values: z.infer<typeof appointmentSchema>) {
      setisLoading(true);
      let status;
      switch(type){
        case 'cancel':
            status='cancelled';
            break
        case 'schedule':
            status='scheduled';
            break
        default:
            status='pending';
            break
      }
      try{
        if(type === 'create' && patientId){
            const appointmentData={
                userId,
                patient:patientId,
                primaryPhysician:values.primaryPhysician,
                schedule:new Date(values.schedule),
                reason:values.reason,
                note:values.note,
                status:status as Status,
            }
            const appointment=await createAppointment(appointmentData);
            if(appointment){
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
            }
        }else{
          const appointmentToUpdate={
            userId,
            appointmentId:appointment && appointment.$id,
            appointment:{
                primaryPhysician:values.primaryPhysician,
                schedule:new Date(values.schedule),
                status:status as Status,
                cancellationReason:values.cancellationReason,
            },
            type
          }
          //@ts-ignore
          const updateAppointment=await UpdateAppointment(appointmentToUpdate);
          if(updateAppointment){
            setOpen && setOpen(false);
            form.reset();
          }
        }
      }catch(err){
        console.log(err);
        setisLoading(false);
      }
    }
    let buttonLable;
    switch (type){
        case 'cancel':
            buttonLable='cancel Appointment';
            break;
        case 'create':
            buttonLable='create Appointment';
            break;
        case 'schedule':
            buttonLable='schedule Appointment';
            break;

    }
    return (
      <div>
  
  <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          {
            type == 'create' &&
          <section className="mb-12 space-y-6">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
          </section>
          }
          {
            type !=='cancel' && <>
            
            <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a Doctor"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
              
            />
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reason"
              label="Reason for appointment "
              placeholder="ex: Annual montly check-up"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="note"
              label="AdditionalComments/notes"
              placeholder="ex: Prefer afternoon appointments, if possible"
            />
          </div>
       
          
           
           
            </>
          }
          {
            type === 'cancel' && (
                <>
                   <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="cancellationReason"
                    label="Reason for cancellation"
                    placeholder="enter reasone of cancellation"
                    />
                </>
            )}


            <SubmitBtn isLoading={isLoading} 
            className={`${type === 'cancel'?'shad-danger-btn':'shad-primary-btn'} w-full`}>{buttonLable}</SubmitBtn>
        </form>
      </Form>
      </div>
    )
}

export default AppointmentForm