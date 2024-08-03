"use server";
import { ID, Query } from "node-appwrite";
import { datebase, storage, users  } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from 'node-appwrite/file'
export const createUser = async (user: CreateUserParams) => {
    try {
      // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
      const newuser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      );
  
      return parseStringify(newuser);
    } catch (error: any) {
      // Check existing user
      if (error && error?.code === 409) {
        const existingUser = await users.list([
          Query.equal("email", [user.email]),
        ]);
  
        return existingUser.users[0];
      }
      console.error("An error occurred while creating a new user:", error);
    }
  };
export const getUser=async(userId:string)=>{
 try{
  const user=await users.get(userId);
  return parseStringify(user);
 }catch(err){
  console.log(err);
 } 
}

export const registerPatient = async ({
  identificationDocumentid,
  ...patient
  }: RegisterUserParams) => {

  
  try {
  // Upload file -> // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
  let file;
  if (identificationDocumentid) {
  const inputFile =
  identificationDocumentid &&
  InputFile.fromBuffer(
    identificationDocumentid?.get("blobFile") as Blob,
    identificationDocumentid?.get("fileName") as string
  );
  
    file = await storage.createFile(process.env.NEXT_PUBLIC_BUCKET_ID!, ID.unique(), inputFile);
  }
  // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
  const newPatient = await datebase.createDocument(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
    ID.unique(),
    {
      identificationDocumentid: file?.$id ? file.$id : null,
      identificationDocumentUrl: file?.$id
        ? `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file.$id}/view??project=${process.env.NEXT_PUBLIC_PROJECT_ID}`
        : null,
      ...patient,
    }
  );
 
  
  return parseStringify(newPatient);
  } catch (error) {
  console.error("An error occurred while creating a new patient:", error);
  }
  };
export const getPatient=async(userId:string)=>{
  try{
    const patient=await datebase.listDocuments(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      [Query.equal('userId',userId)]
    )
    return parseStringify(patient.documents[0]);
   }catch(err){
    console.log(err);
   } 
}