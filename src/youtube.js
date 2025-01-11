{
	if (document.readyState !== "loading") {
		console.log("document is already ready");
		init();
	} else {
		document.addEventListener("DOMContentLoaded", function () {
			console.log("document was not ready");
			init();
		});
	}
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

		let friendTab = document.createElement("ytd-guide-entry-renderer");
		friendTab.className = "style-scope ytd-item-section-renderer";

		let friendTabContent = document.createElement("a");
		friendTabContent.className = "yt-simple-endpoint style-scope ytd-guide-entry-renderer";
		friendTabContent.href = "/feed/channels";
		friendTabContent.title = "Friends";
		friendTabContent.setAttribute("tabindex", "-1");

		let friendTabIcon = document.createElement("yt-icon");
		friendTabIcon.className = "style-scope ytd-guide-entry-renderer";
		friendTabIcon.setAttribute("icon", "yt-icons:account-circle");
		friendTabIcon.setAttribute("class", "style-scope yt-icon");

		let friendTabText = document.createElement("yt-formatted-string");
		friendTabText.className = "style-scope ytd-guide-entry-renderer";
		friendTabText.innerText = "Friends";

		friendTabContent.appendChild(friendTabIcon);

		friendTab.appendChild(friendTabContent);
		friendTab.appendChild(friendTabText);

		exploreItems.appendChild(friendTab);
		console.log(exploreItems);
	} catch (error) {
		console.error("Error: ", error);
	}
}
