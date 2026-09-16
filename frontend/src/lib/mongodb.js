// lib/mongodb.js
// Lazy connection: defer connect() until first await getMongoClientPromise().
// next build runs with NODE_ENV=production — eager connect caused querySrv failures during compile.

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI is not defined. Database operations will fail.");
}

/** @type {Promise<MongoClient> | undefined} */
let clientPromiseSingleton;

/**
 * Real Promise<MongoClient> (not a fake thenable) so prod bundlers always await a MongoClient instance.
 */
export function getMongoClientPromise() {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI not configured"));
  }
  if (clientPromiseSingleton === undefined) {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        global._mongoClientPromise = new MongoClient(uri).connect();
      }
      clientPromiseSingleton = global._mongoClientPromise;
    } else {
      clientPromiseSingleton = new MongoClient(uri).connect();
    }
  }
  return clientPromiseSingleton;
}
