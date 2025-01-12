import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

export const firebaseConfig = {
	apiKey: "AIzaSyCOi5de8KDLAbOGQZsLHI06QIIYfFTyoLo",
	authDomain: "wetube-1edf0.firebaseapp.com",
	projectId: "wetube-1edf0",
	storageBucket: "wetube-1edf0.appspot.com",
	messagingSenderId: "549613659675",
	appId: "1:549613659675:web:4e03048fbcba0a7a2d3abe",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchDocument(collectionName, docId) {
	try {
		const docRef = doc(db, collectionName, docId);
		const snap = await getDoc(docRef);
		return snap.exists() ? snap.data() : null;
	} catch (error) {
		console.error(`Error fetching ${collectionName}/${docId}:`, error);
		throw new Error(`Failed to fetch ${collectionName}`);
	}
}

const databaseFunctions = {
	getUser: (userId) => fetchDocument("users", userId),
	getVideo: (videoId) => fetchDocument("videos", videoId),
	getParty: (partyId) => fetchDocument("parties", partyId),
};

async function handleRequest(action, payload) {
	const fetchFunction = databaseFunctions[action];
	if (!fetchFunction) throw new Error("Invalid action");
	let response = await fetchFunction(payload);
	return response;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const { action, payload } = request;

	handleRequest(action, payload)
		.then((data) => sendResponse({ data }))
		.catch((error) => sendResponse({ error: error.message }));

	return true;
});
