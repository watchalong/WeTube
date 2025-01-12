

let partyChatContainer = document.createElement('div');

// add style (text white) to x
partyChatContainer.style.color = 'white';


let chatFrame = document.createElement('div');
chatFrame.className = 'sidebar';
chatFrame.textContent = "{user}'s Watch Party Chat";
partyChatContainer.appendChild(chatFrame);

let button = document.createElement('button');
button.innerHTML = "Click Me";
button.onclick = function() {
    alert("Button was clicked!");
};


initPartyChat();

async function initPartyChat() {
    let ytSecondarySection  = await waitForElement("#secondary-inner");

    let ytChatContainer = await waitForElement("#chat-container");

    ytSecondarySection.insertBefore(partyChatContainer, ytChatContainer);
}
// sleep(5000).then(() => { document.querySelector("#secondary-inner").insertBefore(x,document.querySelector("#chat-container")); });
