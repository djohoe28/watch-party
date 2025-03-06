import { getFirestore } from "firebase/firestore";
import firebaseApp from "./Firebase.service";

const firestoreDb = getFirestore(firebaseApp); // TODO: Add Database ID?

export default firestoreDb;
