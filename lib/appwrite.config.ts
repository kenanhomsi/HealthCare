import * as sdk from 'node-appwrite'

// export const { NEXT_PUBLIC_PROJECT_ID,
//     NEXT_PUBLIC_API_KEY,
//     NEXT_PUBLIC_DATABASE_ID,
//     NEXT_PUBLIC_PATIENT_COLLECTION_ID,
//     NEXT_PUBLIC_DOCTOR_COLLECTION_ID,
//     NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID,
//         NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
//         NEXT_PUBLIC_ENDPOINT 
//     }=process.env;


const client = new sdk.Client()
.setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)//! معناتا انو موجودة متل important
.setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
.setKey(process.env.NEXT_PUBLIC_API_KEY!)

export const datebase=new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users=new sdk.Users(client);
export const messaging=new sdk.Messaging(client); 