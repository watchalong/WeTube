let x = document.createElement("div");

// add style (text white) to x
x.style.color = "white";

let chatFrame = document.createElement("div");
chatFrame.className = "sidebar";
chatFrame.textContent = "{user}'s Watch Party Chat";
x.appendChild(chatFrame);

let button = document.createElement("button");
button.innerHTML = "Click Me";
button.onclick = function () {
	alert("Button was clicked!");
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

sleep(5000).then(() => {
	document.querySelector("#secondary-inner").insertBefore(x, document.querySelector("#chat-container"));
});
