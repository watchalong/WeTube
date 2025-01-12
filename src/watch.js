// loop through all nonce scripts and find the one that contains the user's name
let username = "";
for (let script of document.scripts) {
  // console.log(script);
  if (script.nonce) {
    let matches = script.innerHTML.match(/"USER_ACCOUNT_NAME":"(.*?)"/);
    if (matches) {
      username = matches[1];
      console.log(username);
      break;
    }
  }
}

function getVideoID() {
  let url = window.location.href;
  let videoID = url.split("v=")[1];
  let ampersandPosition = videoID.indexOf("&");
  if (ampersandPosition != -1) {
    videoID = videoID.substring(0, ampersandPosition);
  }
  return videoID;
}

let currentVideo = getVideoID();

// check if user exists in firestore
chrome.runtime
  .sendMessage({
    action: "getUser",
    payload: [username],
  })
  .then((response) => {
    if (!response.data) {
      console.log("User does not exist");
      chrome.runtime
        .sendMessage({
          action: "setUser",
          payload: [username, {
            video: currentVideo,
            friends: [],
          }]
        });

      // update video's users
      chrome.runtime
        .sendMessage({
          action: "getVideo",
          payload: [currentVideo],
        })
        .then((response) => {
          if (!response.data) {
            console.log("Video does not exist");
            chrome.runtime
              .sendMessage({
                action: "setVideo",
                payload: [currentVideo, { users: [username], messages: [] }],
              });
          } else {
            let users = response.data.users || [];
            users.push(username);

            chrome.runtime
              .sendMessage({
                action: "setVideo",
                payload: [currentVideo, { users: users }],
              });
          }
        });
    } else {
      chrome.runtime
        .sendMessage({
          action: "setUser",
          payload: [username, { video: currentVideo }],
        });

      chrome.runtime
        .sendMessage({
          action: "getVideo",
          payload: [currentVideo],
        })
        .then((response) => {
          if (!response.data) {
            console.log("Video does not exist");
            chrome.runtime
              .sendMessage({
                action: "setVideo",
                payload: [currentVideo, { users: [username], messages: [] }],
              });
          } else {
            let users = response.data.users || [];
            users.push(username);

            chrome.runtime
              .sendMessage({
                action: "setVideo",
                payload: [currentVideo, { users: users }],
              });
          }
        });
    }
  });


setInterval(() => {
  let prevVideo = currentVideo;
  currentVideo = getVideoID();

  console.log(prevVideo, currentVideo);

  if (prevVideo !== currentVideo) {
    chrome.runtime
      .sendMessage({
        action: "setUser",
        payload: [username, { video: currentVideo }],
      });

    // remove user from previous video
    chrome.runtime
      .sendMessage({
        action: "getVideo",
        payload: [prevVideo],
      })
      .then((response) => {
        console.log(response);
        let users = response.data.users || [];
        console.log(users);
        users = users.filter((user) => user !== username);

        chrome.runtime
          .sendMessage({
            action: "setVideo",
            payload: [prevVideo, { users: users }],
          })
      });

    // get video's users
    chrome.runtime
      .sendMessage({
        action: "getVideo",
        payload: [currentVideo],
      })
      .then((response) => {
        if (!response.data) {
          console.log("Video does not exist");
          chrome.runtime
            .sendMessage({
              action: "setVideo",
              payload: [currentVideo, { users: [username], messages: []}],
            });
        } else {
          let users = response.data.users || [];
          users.push(username);

          chrome.runtime
            .sendMessage({
              action: "setVideo",
              payload: [currentVideo, { users: users }],
            });
        }
      });
  }
}, 1000);

let partyChatContainer = document.createElement("div");

// add style (text white) to x
partyChatContainer.style.color = "white";

let chatFrame = document.createElement("div");
chatFrame.className = "sidebar";

let chatTitleWrapper = document.createElement("div");
chatTitleWrapper.textContent = `${username}'s Watch Party Chat`;
chatTitleWrapper.className = "sidebar";
chatTitleWrapper.style = "box-shadow: none; border-radius: 10px 10px 0 0; padding: 15px; border: none; border-bottom: rgb(63, 63, 63) 1px solid; margin: 0; text-align: left;";

chatTitleWrapper.style.display = "flex";
chatTitleWrapper.style.alignItems = "center";
chatTitleWrapper.style.justifyContent = "space-between";
chatOnlineViewersCount = document.createElement("div");
chatOnlineViewersCount.innerHTML = '<span style="color: green; font-size: 30px; margin:0; vertical-align: middle;">•</span> {viewers} viewers';
chatOnlineViewersCount.className = "viewers-count";
chatTitleWrapper.style.alignItems = "center";
chatOnlineViewersCount.style.marginLeft = "auto";

chatTitleWrapper.appendChild(chatOnlineViewersCount);

chatFrame.appendChild(chatTitleWrapper);

partyChatContainer.appendChild(chatFrame);

let chatMessagesWrapper = document.createElement("div");
chatMessagesWrapper.className = "messages-wrapper";
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
// Set a max height for the messages wrapper

let observer = new MutationObserver(() => {
  chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
});

observer.observe(chatMessagesWrapper, { childList: true });
function sendMessage(content) {
  console.log(`${currentVideo}: ${username}: ${content}`);

  chrome.runtime
    .sendMessage({
      action: "getVideo",
      payload: [currentVideo],
    })
    .then((response) => {
      let messages = response.data.messages || [];
      messages.push(`${username},${content}`); // comma-separated

      chrome.runtime
        .sendMessage({
          action: "setVideo",
          payload: [currentVideo, { messages: messages }],
        });
    });
}
chatInput.onsubmit = function (e) {
  e.preventDefault(); // prevent form submission (no page refresh)
  if (chatTextBox.value !== "") {
    // prevent empty messages
    sendMessage(chatTextBox.value);
    chatTextBox.value = "";
    setTimeout(() => {
      chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
    }, 500);
  }
};

chatFrame.appendChild(chatInput);

initPartyChat();

// get messages from firestore every 1 second
let previousMessages = [];

function updateMessages() {
  chrome.runtime
    .sendMessage({
      action: "getVideo",
      payload: [currentVideo],
    })
    .then((response) => {
      let newMessages = response.data.messages || [];
      if (JSON.stringify(newMessages) !== JSON.stringify(previousMessages)) {
        let wasScrolledToBottom =
          chatMessagesWrapper.scrollHeight - chatMessagesWrapper.scrollTop ===
          chatMessagesWrapper.clientHeight;

        chatMessagesWrapper.innerHTML = "";
        newMessages.forEach((message) => {
          let messageElement = document.createElement("div");
          messageElement.className = "message";

          let firstSpaceIndex = message.indexOf(",");
          if (firstSpaceIndex !== -1) {
            let firstWord = message.substring(0, firstSpaceIndex);
            let restOfMessage = message.substring(firstSpaceIndex + 1);

            messageElement.innerHTML = `<strong style = "margin-right: 5px">${firstWord}</strong> ${restOfMessage}`;
          } else {
            messageElement.textContent = message;
          }
          chatMessagesWrapper.appendChild(messageElement);
        });

        if (wasScrolledToBottom) {
          chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
        }

        previousMessages = newMessages;
      }
    });
}

setInterval(updateMessages, 1000);
setInterval(() => {
  chrome.runtime
    .sendMessage({
      action: "getVideo",
      payload: [currentVideo],
    })
    .then((response) => {
      //   chatMessagesWrapper.scrollTop = chatMessagesWrapper.scrollHeight;
      // console.log(response);
      chatMessagesWrapper.innerHTML = "";
      response.data.messages.forEach((message) => {
        let messageElement = document.createElement("div");
        messageElement.className = "message";

        let firstCommaIndex = message.indexOf(",");
        if (firstCommaIndex !== -1) {
          let firstWord = message.substring(0, firstCommaIndex);
          let restOfMessage = message.substring(firstCommaIndex + 1);

          messageElement.innerHTML = `<strong style = "margin-right: 5px">${firstWord}</strong> ${restOfMessage}`;
        } else {
          messageElement.textContent = message;
        }
        chatMessagesWrapper.appendChild(messageElement);
      });
    });
}, 1000);

async function initPartyChat() {
  let ytSecondarySection = await waitForElement("#secondary-inner");

  let ytChatContainer = await waitForElement("#chat-container");

  ytSecondarySection.insertBefore(partyChatContainer, ytChatContainer);
}
