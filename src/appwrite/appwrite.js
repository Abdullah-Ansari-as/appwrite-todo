import { Client, Databases, ID } from "appwrite";

const client = new Client();

const DB_ID = "6718d389000e7960a5cc";
const COLLECTION_ID = "6718d397000b0cb12008"


client.setProject('6718d34200127694d46e');

export const databases = new Databases(client);
export {DB_ID, COLLECTION_ID, ID}