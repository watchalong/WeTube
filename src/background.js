import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOi5de8KDLAbOGQZsLHI06QIIYfFTyoLo", // FIXME: .env
  authDomain: "wetube-1edf0.firebaseapp.com",
  projectId: "wetube-1edf0",
  storageBucket: "wetube-1edf0.firebasestorage.app",
  messagingSenderId: "549613659675",
  appId: "1:549613659675:web:4e03048fbcba0a7a2d3abe",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getUser(userId) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

async function getVideo(videoId) {
  try {
    const docRef = doc(db, "videos", videoId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

async function getParty(partyId) {
  try {
    const docRef = doc(db, "parties", partyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let command = request.action;

  if (command.startsWith("get")) {
    command = command.substr(3);
    let fetchFunction;

    if (command === "User") {
      fetchFunction = getUser;
    } else if (command === "Video") {
      fetchFunction = getVideo;
    } else if (command === "Party") {
      fetchFunction = getParty;
    } else {
      sendResponse({ error: "Invalid action" });
      return;
    }

    fetchFunction(request.payload)
      .then((data) => {
        sendResponse({ data });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    return true;
  } else {
    sendResponse({ error: "Unsupported action" });
  }
});
