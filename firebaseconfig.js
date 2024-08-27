import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const clientCredentials = {
	apiKey: "AIzaSyBCGjyibEmex7ofahCxG_KobHK3J90sWZU",
	authDomain: "artist-manager-coa.firebaseapp.com",
	projectId: "artist-manager-coa",
	storageBucket: "artist-manager-coa.appspot.com",
	messagingSenderId: "621348933740",
	appId: "1:621348933740:web:15ae48464e463c248a4849"
}

let firestore, firebaseAuth

if (!getApps().length) {
	const app = initializeApp(clientCredentials)

	// Check that `window` is in scope for the analytics module!
	if (typeof window !== 'undefined') {
		if (app.name) {
			firestore = getFirestore(app)
			firebaseAuth = getAuth(app)
		}
	}
}

export { firestore, firebaseAuth }
