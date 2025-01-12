console.log("Script is running");

// clear the page
document.body.innerHTML = "";

// let friends = document.createElement('div');
// friends.style.width = "200px";
// friends.style.height = "200px";
// friends.style.zIndex = "9999";
// friends.style.backgroundColor = "black"; // Added background color
// friends.style.position = "fixed"; // Ensure it's positioned in the viewport
// friends.style.top = "10px"; // Position it within the viewport
// friends.style.left = "10px"; // Position it within the viewport

// let para = document.createElement('p');
// para.innerHTML = "Friends";
// para.style.color = "white";

// friends.appendChild(para);
// document.body.appendChild(friends);

// add a title
let title = document.createElement('h1');
title.innerHTML = "Friends";
title.style.color = "white";
title.style.fontSize = "50px";
document.body.appendChild(title);

// put the title in the middle of the page
title.style.position = "absolute";
title.style.top = "5%";
title.style.left = "50%";
title.style.transform = "translate(-50%, 0%)";

// add a list with no bullets
let list = document.createElement('ul');
list.style.listStyleType = "none";
list.style.color = "white";
list.style.fontSize = "20px";

// populate with fake friend names
let friends = ["Alice", "Bob", "Charlie", "Dave", "Eve"];
friends.forEach(friend => {
  let listItem = document.createElement('li');
  listItem.innerHTML = friend;
  list.appendChild(listItem);
});
document.body.appendChild(list);

// put the list in the middle of the page
list.style.position = "absolute";
list.style.top = "15%";
list.style.left = "30%";
list.style.transform = "translate(-50%, 0%)";