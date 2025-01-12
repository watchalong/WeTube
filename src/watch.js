

let partyChatContainer = document.createElement('div');

// add style (text white) to x
partyChatContainer.style.color = 'white';


let chatFrame = document.createElement('div');
chatFrame.className = 'sidebar';

let chatTitleWrapper = document.createElement('div');
chatTitleWrapper.textContent = "{user}'s Watch Party Chat";
chatTitleWrapper.className = 'sidebar';
chatTitleWrapper.style = "box-shadow: none; border-radius: 10px 10px 0 0; padding: 15px; border: none; border-bottom: rgb(63, 63, 63) 1px solid; margin: 0;"
chatFrame.appendChild(chatTitleWrapper);

partyChatContainer.appendChild(chatFrame);

let chatMessagesWrapper = document.createElement('div');
chatMessagesWrapper.style = "height: 600px;";
chatFrame.appendChild(chatMessagesWrapper);

let chatInput = document.createElement('form');
chatInput.className = 'sidebar';
chatInput.style = "box-shadow: none; border-radius: 0 0 10px 10px; padding: 15px; border: none; border-top: rgb(63, 63, 63) 1px solid; margin: 0;";

let chatTextBox = document.createElement('input');
chatTextBox.type = 'text';
chatInput.appendChild(chatTextBox);

let chatSubmitButton = document.createElement('input');
chatSubmitButton.type = 'submit';
chatInput.appendChild(chatSubmitButton);

chatInput.onsubmit = function(e) {
    
    e.preventDefault();
    alert(chatTextBox.value);
    chatTextBox.value = '';
}

chatFrame.appendChild(chatInput);


initPartyChat();

async function initPartyChat() {
    let ytSecondarySection  = await waitForElement("#secondary-inner");

    let ytChatContainer = await waitForElement("#chat-container");

    ytSecondarySection.insertBefore(partyChatContainer, ytChatContainer);
}
// sleep(5000).then(() => { document.querySelector("#secondary-inner").insertBefore(x,document.querySelector("#chat-container")); });
