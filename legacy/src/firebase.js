import firebase from "firebase";
import 'firebase/analytics';

const MODES = {
	DEV: "Dev",
	LOCAL: "Local",
	PROD: "Production",
};
const devMode = MODES.PROD;
let config = {};

if (devMode === MODES.DEV || devMode === MODES.LOCAL) {
	config = {
		apiKey: "AIzaSyDiVP0sXjbSJ2t6M8fEMqPiVNk-EdckGWs",
		authDomain: "yseportal-test.firebaseapp.com",
		databaseURL: "https://yseportal-test.firebaseio.com",
		projectId: "yseportal-test",
		storageBucket: "yseportal-test.appspot.com",
		messagingSenderId: "988589637847",
		appId: "1:988589637847:web:e2eb98b8b5538f5e9ff092",
		measurementId: "G-LCB7SHM6FM",
	};
} else {
	config = {
		apiKey: "AIzaSyBu0UlsNxxhhqELOGdzkG-7DkXjyQ-A3eM",
		authDomain: "yse-portal.firebaseapp.com",
		databaseURL: "https://yse-portal.firebaseio.com",
		projectId: "yse-portal",
		storageBucket: "yse-portal.appspot.com",
		messagingSenderId: "495646511154",
		appId: "1:495646511154:web:32f52cda9f588534",
	};
}
export const fb = firebase.initializeApp(config);
export const fn = firebase.functions();
export const db = firebase.firestore();
// export const realtimeDB = firebase.database();
export const auth = firebase.auth();
export const analytics = firebase.analytics();

if (window.location.hostname === "localhost" && devMode === MODES.LOCAL) {
	db.useEmulator("localhost", 5002);
	fn.useEmulator("localhost", 5001);
	auth.useEmulator("http://localhost:9099/");
	// realtimeDB.useEmulator("http://localhost:9000/");
}
