import data from "./logos.json" assert { type: "json" };

const contentDiv = document.querySelector(".content");
const downloadButton = document.querySelector(".download button");
let pickSet = new Set();

function updateList(keyword) {
  contentDiv.innerHTML = "";
  const fragment = document.createDocumentFragment();
  downloadButton.style.display = "none";

  data
    .filter((item) => item.folder.toLowerCase().includes(keyword.toLowerCase()))
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const checkDiv = document.createElement("div");
      checkDiv.className = "check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = item.folder;
      checkbox.name = item.folder;
      checkbox.checked = pickSet.has(item.folder);
      if (checkbox.checked) {
        card.classList.toggle("checked");
      }
      checkbox.addEventListener("change", (e) => {
        card.classList.toggle("checked");
        if (e.target.checked) {
          pickSet.add(item.folder);
        } else {
          pickSet.remove(item.folder);
        }

        downloadButton.style.display = Array.from(
          contentDiv.querySelectorAll("div.card"),
        ).some((card) => card.classList.contains("checked"))
          ? "flex"
          : "none";
      });

      const label = document.createElement("label");
      label.htmlFor = item.folder;

      const checkboxDiv = document.createElement("div");
      checkboxDiv.className = "checkbox";

      const checkImg = document.createElement("img");
      checkImg.src = "./asset/check.svg";
      checkImg.alt = "check";

      checkboxDiv.appendChild(checkImg);
      label.appendChild(checkboxDiv);
      label.appendChild(document.createTextNode(item.folder));

      checkDiv.appendChild(checkbox);
      checkDiv.appendChild(label);

      const logoImg = document.createElement("img");
      logoImg.src = `https://github.com/SAWARATSUKI/ServiceLogos/blob/main/${item.urls[0]}?raw=true`;
      logoImg.alt = "React";

      card.appendChild(checkDiv);
      card.appendChild(logoImg);

      fragment.appendChild(card);
    });

  contentDiv.appendChild(fragment);
  downloadButton.style.display = Array.from(
    contentDiv.querySelectorAll("div.card"),
  ).some((card) => card.classList.contains("checked"))
    ? "flex"
    : "none";
}

updateList("");
document.getElementById("search").addEventListener("input", function () {
  updateList(this.value);
});
