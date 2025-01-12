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
		chrome.runtime.sendMessage({ action: "getVideo", payload: [videoId] }).then((response) => {
			let videoTitle = response.data?.title || "Untitled Video";

			let videoCard = document.createElement("div");
			videoCard.className = "custom-video-card";
			videoCard.style = `
                display: flex;
                margin-bottom: 20px;
                background-color: #080808;
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
			title.textContent = videoTitle;
			title.style = `
                font-size: 18px;
                font-weight: bold;
                color: #065fd4;
                text-decoration: none;
                margin-bottom: 10px;
            `;

			let userInfoContainer = document.createElement("div");
			userInfoContainer.style = `
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 5px;
            `;

			users.forEach((user) => {
				let userWrapper = document.createElement("div");
				userWrapper.style = `
                    display: flex;
                    align-items: center;
                    background-color: #303030;
                    padding: 4px 8px;
                    border-radius: 20px;
                `;

				let userAvatar = document.createElement("img");
				userAvatar.src = user.pfp;
				userAvatar.style = `
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-right: 8px;
                `;

				let userName = document.createElement("span");
				userName.textContent = `${user.name} is watching`;
				userName.style = `
                    font-size: 12px;
                    color: #999;
                `;

				userWrapper.appendChild(userAvatar);
				userWrapper.appendChild(userName);
				userInfoContainer.appendChild(userWrapper);
			});

			details.appendChild(title);
			details.appendChild(userInfoContainer);

			videoCard.appendChild(thumbnail);
			videoCard.appendChild(details);

			container.appendChild(videoCard);
		});
	}
}
