import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	collection,
	addDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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

async function setDocument(collectionName, docId, data) {
	try {
		const docRef = doc(db, collectionName, docId);
		await setDoc(docRef, data, { merge: true });
		return { success: true };
	} catch (error) {
		console.error(`Error setting ${collectionName}/${docId}:`, error);
		throw new Error(`Failed to set ${collectionName}`);
	}
}

async function addDocument(collectionName, data) {
	try {
		const collRef = collection(db, collectionName);
		const docRef = await addDoc(collRef, data);
		return { success: true, id: docRef.id };
	} catch (error) {
		console.error(`Error add to ${collectionName}:`, error);
		throw new Error(`Failed to add to ${collectionName}`);
	}
}

async function deleteDocument(collectionName, docId) {
	try {
		const docRef = doc(db, collectionName, docId);
		await deleteDoc(docRef);
		return { success: true };
	} catch (error) {
		console.error(`Error deleting ${collectionName}/${docId}:`, error);
		throw new Error(`Failed to delete ${collectionName}`);
	}
}

const databaseFunctions = {
	getUser: (userId) => fetchDocument("users", userId),
	getVideo: (videoId) => fetchDocument("videos", videoId),
	getParty: (partyId) => fetchDocument("parties", partyId),

	setUser: (userId, data) => setDocument("users", userId, data),
	setVideo: (videoId, data) => setDocument("videos", videoId, data),
	setParty: (partyId, data) => setDocument("parties", partyId, data),

	addUser: (data) => addDocument("users", data),
	addVideo: (data) => addDocument("videos", data),
	addParty: (data) => addDocument("parties", data),

	deleteUser: (userId) => deleteDocument("users", userId),
	deleteVideo: (videoId) => deleteDocument("videos", videoId),
	deleteParty: (partyId) => deleteDocument("parties", partyId),
};

async function handleRequest(action, payload) {
	const fetchFunction = databaseFunctions[action];
	if (!fetchFunction) throw new Error("Invalid action");
	let response = await fetchFunction(...payload);
	return response;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const { action, payload } = request;

	handleRequest(action, payload)
		.then((data) => sendResponse({ data }))
		.catch((error) => sendResponse({ error: error.message }));

	return true;
});
