console.log("Script is running");

// clear the page
document.body.innerHTML = "";

// add a title
let title = document.createElement("h1");
title.innerHTML = "Friends";
title.style.color = "white";
title.style.fontSize = "50px";
document.body.appendChild(title);

// put the title in the middle of the page
title.style.position = "absolute";
title.style.top = "5%";
title.style.left = "50%";
title.style.transform = "translate(-50%, 0%)";

let onlineList = document.createElement("ul");
onlineList.style.listStyleType = "none";  // no bullets
onlineList.textContent = "Online Friends";
onlineList.style.color = "white";
onlineList.style.fontSize = "20px";

let offlineList = document.createElement("ul");
offlineList.style.listStyleType = "none";  // no bullets
offlineList.textContent = "Offline Friends";
offlineList.style.color = "white";
offlineList.style.fontSize = "20px";

chrome.runtime.sendMessage({
  action: "getUser",
  payload: ["testUser1"],
}).then(response => {
  console.log(response);
  let friends = response.data.friends;
  friends.forEach(friendObj => {
    console.log(friendObj);
    let listItem = document.createElement("li");
    let segments = friendObj._key.path.segments;
    let friend = segments[segments.length - 1];
    chrome.runtime.sendMessage({
      action: "getUser",
      payload: friend
    }).then(response => {
      let friendName = response.data.name;
      listItem.innerHTML = friendName;
      if (response.data.video === "") {
        listItem.style.color = "grey";
        offlineList.appendChild(listItem);
      } else {
        onlineList.appendChild(listItem);
      }
    });
  });
});

title.appendChild(onlineList);
title.appendChild(offlineList);

// add padding to offlineList
offlineList.style.paddingTop = "50px";
