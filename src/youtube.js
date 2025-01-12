chrome.runtime.sendMessage({ action: "fetchData" }, (response) => {
	console.log("Fetched Data from Firestore:", response.data);
});

chrome.runtime.sendMessage({ action: "addData", payload: newData }, (response) => {
	if (response.success) {
		console.log("Data added successfully!");
	}
});

if (document.readyState !== "loading") {
	console.log("document is already ready");
	init();
} else {
	document.addEventListener("DOMContentLoaded", function () {
		console.log("document was not ready");
		init();
	});
}

function waitForElement(selector, timeout = 10000) {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();

		const interval = setInterval(() => {
			const element = document.querySelector(selector);
			if (element) {
				clearInterval(interval);
				resolve(element);
			} else if (Date.now() - startTime >= timeout) {
				clearInterval(interval);
				reject(new Error("Element with selector " + selector + " not found within " + timeout + "ms"));
			}
		}, 100);
	});
}

async function init() {
	console.log("\n\n\n\n\n\nWETUBE\n\n\n\n\n\n");
	try {
		let sections = await waitForElement("#sections");
		console.log(sections);
		let explore = await waitForElement("#sections > :nth-child(3)");
		console.log(explore);
		let exploreItems = await waitForElement("#sections > :nth-child(3) > #items");
		console.log(exploreItems);

		let firstItem = await waitForElement("#sections > :nth-child(3) > #items > ytd-guide-entry-renderer:nth-child(1)");
		let friendTab = firstItem.cloneNode(true);
		friendTab.querySelector("a").href = "/feed/friends";
		friendTab.querySelector("a").title = "Friends";
		friendTab.querySelector("yt-formatted-string").textContent = "Friends";
		exploreItems.appendChild(friendTab);

		friendTab.querySelector("yt-formatted-string").removeAttribute("is-empty");
		friendTab.querySelector("yt-formatted-string").innerHTML = "Friends";
	} catch (error) {
		console.error("Error: ", error);
	}
}
