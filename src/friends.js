console.log("\n\n\nFRIENDS LOCKED IN\n\n\n");
chrome.runtime.sendMessage({ action: "getUser", payload: "testUser1" }, (response) => {
	console.log(response.data);
});
