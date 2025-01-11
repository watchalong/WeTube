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

    let exploreItem1 = waitForElement("#sections > :nth-child(3) > #items > ytd-guide-entry-renderer:nth-child(1)");

    let friendTab = exploreItem1.cloneNode(true);
    friendTab.querySelector("a").href = "/feed/channels";
    friendTab.querySelector("a").title = "Friends";
    friendTab.querySelector("yt-formatted-string").textContent = "Friends";
    exploreItems.appendChild(friendTab);
	} catch (error) {
		console.error("Error: ", error);
	}
}
