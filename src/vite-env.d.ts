/// <reference types="vite/client" />

interface ImportMetaEnv {
	// GitHub Actions - Secrets
	readonly VITE_FIREBASE_API_KEY: string;
	readonly VITE_FIREBASE_AUTH_DOMAIN: string;
	readonly VITE_FIREBASE_PROJECT_ID: string;
	readonly VITE_FIREBASE_STORAGE_BUCKET: string;
	readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
	readonly VITE_FIREBASE_APP_ID: string;
	readonly VITE_FIREBASE_MEASUREMENT_ID: string;
	// Local Development
	readonly VITE_FIREBASE_FIRESTORE_EMULATOR_HOST: string;
	readonly VITE_FIREBASE_FIRESTORE_EMULATOR_PORT: number;
	readonly VITE_FIREBASE_AUTH_EMULATOR_HOST: string;
	// Environment Variables
	readonly VITE_FIREBASE_ROOMS_COLLECTION_ID: string;
	readonly VITE_FIREBASE_MEMBERS_SUBCOLLECTION_ID: string;
	readonly VITE_FIREBASE_MESSAGES_SUBCOLLECTION_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
