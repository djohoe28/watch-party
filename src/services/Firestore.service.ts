import { getFirestore } from "firebase/firestore";
import firebaseApp from "./Firebase.service";

const firestoreDb = getFirestore(firebaseApp);

export default firestoreDb;
