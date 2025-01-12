let partyChatContainer = document.createElement("div");

// add style (text white) to x
partyChatContainer.style.color = "white";

let chatFrame = document.createElement("div");
chatFrame.className = "sidebar";

let chatTitleWrapper = document.createElement("div");
chatTitleWrapper.textContent = "{user}'s Watch Party Chat";
chatTitleWrapper.className = "sidebar";
chatTitleWrapper.style =
	"box-shadow: none; border-radius: 10px 10px 0 0; padding: 15px; border: none; border-bottom: rgb(63, 63, 63) 1px solid; margin: 0;";
chatFrame.appendChild(chatTitleWrapper);

partyChatContainer.appendChild(chatFrame);

let chatMessagesWrapper = document.createElement("div");
chatMessagesWrapper.style = "height: 600px;";
chatFrame.appendChild(chatMessagesWrapper);

let chatInput = document.createElement("form");
chatInput.className = "sidebar";
chatInput.style =
	"box-shadow: none; border-radius: 0 0 10px 10px; padding: 10px 24px; border: none; border-top: rgb(63, 63, 63) 1px solid; margin: 0; align-elements: left; text-align: left;";

let chatTextBox = document.createElement("input");
chatTextBox.type = "text";
chatTextBox.placeholder = "Type a message...";
chatTextBox.className = "textbox";
chatInput.appendChild(chatTextBox);
let chatSubmitButton = document.createElement("button");
chatSubmitButton.type = "submit";
chatSubmitButton.className = "sendbutton";
chatSubmitButton.innerHTML =
	'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%; fill: white;"><path d="M5 12 3 3l19 9-19 9 2-9zm.82.93-1.4 6.29L19.66 12 4.42 4.78l1.4 6.29L17 12l-11.18.93z" fill-rule="evenodd"></path></svg>';

chatSubmitButton.style = "margin-left: 10px; vertical-align: middle;";

chatInput.appendChild(chatSubmitButton);

function sendMessage(party, user, content) {
	// send message to firestore
	// add a string "{user} {content}" to the messages array field of the party
	console.log(`${party}: ${user}: ${content}`);

	chrome.runtime.sendMessage(
		{
			action: "addData",
			payload: {
				doc: `parties/${party}`,
				field: "messages",
				type: "append",
				content: user + " " + content,
			},
		},
		(response) => {
			response.success ? console.log("Data added successfully!") : console.log("Data not added successfully!");
		}
	);
}

chatInput.onsubmit = function (e) {
	e.preventDefault();
	// alert(chatTextBox.value);
	sendMessage("testParty1", "testUser1", chatTextBox.value);
	chatTextBox.value = "";
};

chatFrame.appendChild(chatInput);

initPartyChat();

async function initPartyChat() {
	let ytSecondarySection = await waitForElement("#secondary-inner");

	let ytChatContainer = await waitForElement("#chat-container");

	ytSecondarySection.insertBefore(partyChatContainer, ytChatContainer);
}
// sleep(5000).then(() => { document.querySelector("#secondary-inner").insertBefore(x,document.querySelector("#chat-container")); });
