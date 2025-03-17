import { signInAnonymously } from "firebase/auth";
import auth from "../services/Auth.service";

export const useAuth = async () => signInAnonymously(auth);