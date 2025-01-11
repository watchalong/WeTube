
let x = document.createElement('div');

// add style (text white) to x
x.style.color = 'white';


let t = document.createTextNode("Paragraph is created.");
x.appendChild(t);

// x.innerHTML = `
//   <div class="ytd-live-chat-frame yt-dropdown-menu sidebar rounded-container">
//     {user}'s Watch Party Chat
//   </div>
// `;
let chatFrame = document.createElement('div');
chatFrame.className = 'ytd-live-chat-frame yt-dropdown-menu sidebar rounded-container';
chatFrame.textContent = "{user}'s Watch Party Chat";
x.appendChild(chatFrame);

let button = document.createElement('button');
button.innerHTML = "Click Me";
button.onclick = function() {
    alert("Button was clicked!");
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(5000).then(() => { document.querySelector("#secondary-inner").insertBefore(x,document.querySelector("#chat-container")); });
