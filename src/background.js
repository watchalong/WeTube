import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOi5de8KDLAbOGQZsLHI06QIIYfFTyoLo",  // FIXME: .env
  authDomain: "wetube-1edf0.firebaseapp.com",
  projectId: "wetube-1edf0",
  storageBucket: "wetube-1edf0.firebasestorage.app",
  messagingSenderId: "549613659675",
  appId: "1:549613659675:web:4e03048fbcba0a7a2d3abe",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchData") {
    let data = doc(db, "tc/td");
    sendResponse({ data });
    return true;
  } else if (request.action === "addData") {
    console.log(request);
    let value = (request.payload.type === "append") ?
      arrayUnion(request.payload.content) :
      request.payload.content;

    updateDoc(request.payload.doc, {
      [request.payload.field]: value
    })
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error }));
  }
});
