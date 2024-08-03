"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"
import { Appointment } from "@/types/appwrite.types"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell:({row})=><p className="text-14-medium">{row.index +1}</p>
  },
  {
    accessorKey:'patient',
    header:'Patient',
    cell:({row})=> {
        const lastName=row.original.patient.name.split(' ')[1];
       return <div className=" flex items-center gap-3">
            <p className=" rounded-3xl bg-green-500 p-1 text-black capitalize">{row.original.patient.name.substring(0,1)} {lastName.substring(0,1)}</p>
            <p className=" whitespace-nowrap">{row.original.patient.name}</p>
        </div>
    }   
  },
  {
    accessorKey:'schedule',
    header:'Date',
    cell:({row})=>(
        <p className="text-14-regular min-w-[100px]">
            {formatDateTime(row.original.schedule).dateTime}
        </p>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell:({row})=>(
        <div className="min-w-[115px]">
            <StatusBadge status={row.original.status} />
        </div>
    )

  },
  {
    accessorKey:'primaryPhysician',
    header:'Doctor',
    cell:({row})=>{
        const docktor=Doctors.find((doc)=> doc.name === row.original.primaryPhysician);
        return <div className=" flex items-center gap-3">
            <Image src={docktor?.image!} alt="docktorImage"
             width={100} height={100}
            className=" size-8" />
            <p className=" whitespace-nowrap">Dr.{docktor?.name!}</p>
        </div>
    }
  },
  {
    id: "actions",
    header:()=> <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
        return(
            <div className="">
                <AppointmentModal 
                  type='schedule' 
                  patientId={row.original.patient.$id}
                  userId={row.original.userId}
                  appointment={row.original}
                  // title='Schedule appointment'
                  // description='Please confirm the following details to scheduled'
                  />
                <AppointmentModal 
                  type='cancel' 
                 patientId={row.original.patient.$id}
                 userId={row.original.userId}
                 appointment={row.original}
                //  title='Cancel appointment'
                //  description='Are you Sure you want to cansel this appointment'
                 />
            </div>
        )
    }
  },
]
