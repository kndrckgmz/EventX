import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const clientCredentials = {
	apiKey: "AIzaSyCNHozucyvjsT1qnLfoCq4gYA40v_dDWts",
	authDomain: "kendrickgomez.firebaseapp.com",
	projectId: "kendrickgomez",
	storageBucket: "kendrickgomez.appspot.com",
	messagingSenderId: "376648720161",
	appId: "1:376648720161:web:334b376379b59ddae8e860",
	clientId: "376648720161-5m23gg58uu7gd43pdro15kolamc2b2n9.apps.googleusercontent.com",
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
