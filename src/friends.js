if (document.readyState !== "loading") {
	console.log("document is already ready");
	createFeed();
} else {
	document.addEventListener("DOMContentLoaded", function () {
		console.log("document was not ready");
		createFeed();
	});
}

async function createFeed() {
	let pgmanager = await waitForElement("#content > ytd-page-manager");
	pgmanager.innerHTML = "";

	let search = document.createElement("ytd-search");
	search.setAttribute("class", "style-scope ytd-page-manager");
	search.setAttribute("has-bigger-thumbs", "");
	search.setAttribute("role", "main");
	search.setAttribute("has-search-header", "");

	let container = document.createElement("div");
	container.setAttribute("id", "container");
	container.setAttribute("class", "style-scope ytd-search");

	let renderer = document.createElement("ytd-two-column-search-results-renderer");
	renderer.setAttribute("is-search", "true");
	renderer.setAttribute("class", "style-scope ytd-search");
	renderer.setAttribute("use-bigger-thumbs", "");
	renderer.setAttribute("bigger-thumbs-style", "BIG");
	renderer.setAttribute("guide-persistent-and-visible", "");

	let primary = document.createElement("div");
	primary.setAttribute("id", "primary");
	primary.setAttribute("class", "style-scope ytd-two-column-search-results-renderer");

	let sectionList = document.createElement("ytd-section-list-renderer");
	sectionList.setAttribute("class", "style-scope ytd-two-column-search-results-renderer");
	sectionList.setAttribute("hide-bottom-separator", "");
	console.log(primary);

	let contents = document.createElement("div");
	contents.setAttribute("id", "contents");
	contents.setAttribute("class", "style-scope ytd-section-list-renderer");

	let videos = {};

	chrome.runtime.sendMessage({ action: "getUser", payload: ["Arjun Sahlot"] }).then((response) => {
		console.log(response);
		let friends = response.data.friends;

		for (let friendObj of friends) {
			let segments = friendObj._key.path.segments;
			let friend = segments[segments.length - 1];
			chrome.runtime.sendMessage({ action: "getUser", payload: [friend] }).then((response) => {
				let user = response.data;
				if (user.video !== "") {
					if (videos.hasOwnProperty(user.video)) {
						videos[user.video].push(user);
					} else {
						videos[user.video] = [user];
					}
				}
			});
		}
	});

	console.log(videos);

	for ([video, users] of Object.entries(videos)) {
		let vrenderer = document.createElement("ytd-video-renderer");
		vrenderer.setAttribute("class", "style-scope ytd-item-section-renderer");
		vrenderer.setAttribute("biggest-thumbs-style", "BIG");
		vrenderer.setAttribute("lockup", "true");
		vrenderer.setAttribute("is-search", "");
		vrenderer.setAttribute("use-search-ui", "");
		vrenderer.setAttribute("use-bigger-thumbs", "");
		vrenderer.setAttribute("inline-title-icon", "");

		let dismissable = document.createElement("div");
		dismissable.setAttribute("id", "dismissable");
		dismissable.setAttribute("class", "style-scope ytd-video-renderer");

		let thumb = document.createElement("ytd-thumbnail");
		thumb.setAttribute("class", "style-scope ytd-video-renderer");

		let link = document.createElement("a");
		link.setAttribute("id", "thumbnail");
		link.setAttribute("class", "yt-simple-endpoint style-scope ytd-thumbnail inline-block");
		link.setAttribute("aria-hidden", "true");
		link.setAttribute("tabindex", "-1");
		link.setAttribute("href", "/watch?v=" + video);

		let image = document.createElement("yt-image");
		image.setAttribute("class", "style-scope ytd-thumbnail");
		image.setAttribute("alt", "");
		image.setAttribute("ft1-eligible", "");

		let img = document.createElement("img");
		img.setAttribute(
			"class",
			"yt-core-image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-aspect-fill yt-core-image--loaded"
		);
		img.setAttribute("src", "https://i.ytimg.com/vi/" + video + "/hqdefault.jpg");

		image.appendChild(img);
		link.appendChild(image);
		thumb.appendChild(link);

		let wrapper = document.createElement("div");
		wrapper.setAttribute("class", "text-wrapper style-scope ytd-video-renderer");

		let meta = document.createElement("div");
		meta.setAttribute("id", "meta");
		meta.setAttribute("class", "style-scope ytd-video-renderer");

		let titlewrapper = document.createElement("div");
		titlewrapper.setAttribute("id", "title-wrapper");
		titlewrapper.setAttribute("class", "style-scope ytd-video-renderer");

		let title = document.createElement("h3");
		title.setAttribute("class", "title-and-badge style-scope ytd-video-renderer");

		let titlelink = document.createElement("a");
		titlelink.setAttribute("id", "video-title");
		titlelink.setAttribute("class", "yt-simple-endpoint style-scope ytd-video-renderer");
		titlelink.setAttribute("title", "test");
		titlelink.setAttribute("href", "/watch?v=" + video);

		let string = document.createElement("yt-formatted-string");
		string.setAttribute("class", "style-scope ytd-video-renderer");
		string.textContent = video;

		titlelink.appendChild(string);
		title.appendChild(titlelink);

		let channelinfo = document.createElement("div");
		channelinfo.setAttribute("id", "channel-info");
		channelinfo.setAttribute("class", "style-scope ytd-video-renderer");

		let cthumb = document.createElement("a");
		cthumb.setAttribute("id", "channel-thumbnail");
		cthumb.setAttribute("class", "style-scope ytd-video-renderer");
		cthumb.setAttribute("href", "/@" + user.name);

		let imgshadow = document.createElement("yt-img-shadow");
		imgshadow.setAttribute("class", "style-scope ytd-video-renderer no-transition");

		img = document.createElement("img");
		img.setAttribute("id", "img");
		img.setAttribute("class", "style-scope yt-img-shadow");
		img.setAttribute("src", user.pfp);

		imgshadow.appendChild(img);
		cthumb.appendChild(imgshadow);

		let cname = document.createElement("ytd-channel-name");
		cname.setAttribute("id", "channel-name");
		cname.setAttribute("class", "long-byline style-scope ytd-video-renderer");
		cname.setAttribute("wrap-text", "true");

		let container = document.createElement("div");
		container.setAttribute("id", "container");
		container.setAttribute("class", "style-scope ytd-channel-name");

		let textcontainer = document.createElement("div");
		textcontainer.setAttribute("id", "text-container");
		textcontainer.setAttribute("class", "style-scope ytd-channel-name");

		let fstring = document.createElement("yt-formatted-string");
		fstring.setAttribute("id", "text");
		fstring.setAttribute("class", "style-scope ytd-channel-name");
		fstring.textContent = user.name;

		textcontainer.appendChild(fstring);
		container.appendChild(textcontainer);
		cname.appendChild(container);

		channelinfo.appendChild(cthumb);
		channelinfo.appendChild(cname);

		titlewrapper.appendChild(title);
		titlewrapper.appendChild(channelinfo);

		meta.appendChild(titlewrapper);

		wrapper.appendChild(meta);

		dismissable.appendChild(thumb);
		dismissable.appendChild(wrapper);

		vrenderer.appendChild(dismissable);
		contents.appendChild(vrenderer);
	}

	sectionList.appendChild(contents);
	primary.appendChild(sectionList);
	renderer.appendChild(primary);
	container.appendChild(renderer);
	search.appendChild(container);
	pgmanager.appendChild(search);
}
