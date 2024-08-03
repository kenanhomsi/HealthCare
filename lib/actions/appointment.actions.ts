'use server';
import { ID, Query } from "node-appwrite";
import { datebase, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment=async(appointment:CreateAppointmentParams)=>{
    try{
        const newAppointment = await datebase.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            {
                ...appointment
            }
          );
          return parseStringify(newAppointment);
    }catch(err){
        console.log(err)
    }
}
export const getAppointment =async(appointmentId:string)=>{
    try{
        const appointment=await datebase.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )
        return parseStringify(appointment)
    }catch(err){
        console.log(err);
    }
}
export const getRecentAppointmentList=async()=>{
    try{
        const appointmentList= await datebase.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        )

        const initialCount={
            scheduledCount:0,
            pendingCount:0,
            canceledCount:0,
        }
        const counts=(appointmentList.documents as Appointment[])
        .reduce((acc,appointment)=>{
                if(appointment.status === 'scheduled'){
                    acc.scheduledCount +=1;
                }else if(appointment.status === 'pending'){
                    acc.pendingCount +=1;
                }else if(appointment.status === 'cancelled'){
                    acc.canceledCount +=1;
                }
                return acc
        },initialCount)

        const Data={
            totalCount:appointmentList.total,
            ...counts,
            documents:appointmentList.documents
        }
        return parseStringify(Data);
    }catch(err){
        console.log(err)
    }
}

export const UpdateAppointment=async({userId,appointmentId,appointment,type}:UpdateAppointmentParams)=>{
    try{
            const updatedAppointment=await datebase.updateDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
                appointmentId,
                appointment
            )
            if(!updatedAppointment){
               throw new Error('Appointment not found')
            }
            //SMS NOTIFICATION
            const SMSMessage=`Hi, it's CarePulse,
             ${type === 'schedule' ? `your appointment has been scheduled ${formatDateTime(appointment.schedule).dateTime} with doctor ${appointment.primaryPhysician} `
             :`We egret to inform you that your appointment has been cancelled . for the following Reasons:${appointment.cancellationReason}` }`;
            
            await sendSMSNotification(userId,SMSMessage);

            revalidatePath('/admin')
            return parseStringify(updatedAppointment);
    }catch(err){
        console.log(err);
    }
}
export const sendSMSNotification=async(userId:string,content:string)=>{
    try {
        const message=await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )
        return parseStringify(message);
        
    } catch (error) {
        console.log(error)
    }
}