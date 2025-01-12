chrome.runtime.sendMessage({ action: "getUser", payload: "testUser1" }, (response) => {
	console.log("Fetched Data from Firestore:", response);
});
