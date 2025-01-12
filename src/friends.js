if (document.readyState !== "loading") {
	console.log("document is already ready");
	createCustomFeed();
} else {
	document.addEventListener("DOMContentLoaded", function () {
		console.log("document was not ready");
		createCustomFeed();
	});
}

async function createCustomFeed() {
	let pgmanager = await waitForElement("#content > ytd-page-manager");
	pgmanager.innerHTML = "";

	let searchContainer = document.createElement("div");
	searchContainer.id = "custom-search-container";
	searchContainer.style = `
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    `;

	let contentWrapper = document.createElement("div");
	contentWrapper.id = "custom-content-wrapper";
	contentWrapper.style = `
        width: 80%;
        max-width: 1200px;
        padding-top: 20px;
    `;

	let videos = {};

	chrome.runtime.sendMessage({ action: "getUser", payload: ["Arjun Sahlot"] }).then((response) => {
		let friends = response.data.friends;
		for (let friendObj of friends) {
			let segments = friendObj._key.path.segments;
			let friend = segments[segments.length - 1];
			chrome.runtime.sendMessage({ action: "getUser", payload: [friend] }).then((response) => {
				let user = response.data;
				if (user.video !== "") {
					if (!videos[user.video]) {
						videos[user.video] = [];
					}
					videos[user.video].push(user);
				}
				renderVideos(videos, contentWrapper);
			});
		}
	});

	searchContainer.appendChild(contentWrapper);
	pgmanager.appendChild(searchContainer);
}

function renderVideos(videos, container) {
	container.innerHTML = "";

	for (let [videoId, users] of Object.entries(videos)) {
		let videoCard = document.createElement("div");
		videoCard.className = "custom-video-card";
		videoCard.style = `
            display: flex;
            margin-bottom: 20px;
            background-color: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        `;

		let thumbnail = document.createElement("img");
		thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
		thumbnail.style = `
            width: 320px;
            height: 180px;
            object-fit: cover;
        `;

		let details = document.createElement("div");
		details.style = `
            padding: 10px 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        `;

		let title = document.createElement("a");
		title.href = `/watch?v=${videoId}`;
		title.textContent = videoId;
		title.style = `
            font-size: 18px;
            font-weight: bold;
            color: #065fd4;
            text-decoration: none;
            margin-bottom: 5px;
        `;

		let channelInfo = document.createElement("div");
		let userString = "";
		for (let user of users) {
			console.log(user);
			userString += user.name + ", ";
		}
		userString = userString.slice(0, -2);
		channelInfo.textContent = `Shared by: ${userString}`;
		channelInfo.style = `
            font-size: 14px;
            color: #606060;
        `;

		details.appendChild(title);
		details.appendChild(channelInfo);

		videoCard.appendChild(thumbnail);
		videoCard.appendChild(details);

		container.appendChild(videoCard);
	}
}
