import data from "./logos.json" assert { type: "json" };

const logos = data.flatMap((row) => {
  return row.urls.map((url, _, arr) => {
    const item = {
      id: row.folder,
      title: row.folder,
      subTitle: null,
      url: url,
      checked: false,
    };
    if (arr.length > 1) {
      item.subTitle = decodeURIComponent(url)
        .split("/")[1]
        .split(".")[0]
        .replace(row.folder, "");
      if (item.subTitle.startsWith("_") || item.subTitle.startsWith(" ")) {
        item.subTitle = item.subTitle.substring(1);
      }
      item.id += `-${item.subTitle}`;
    }
    return item;
  });
});

const contentDiv = document.querySelector(".content");
const downloadButton = document.querySelector(".download button");
const searchInput = document.querySelector(".download button");

function updateList(keyword) {
  contentDiv.innerHTML = "";
  const fragment = document.createDocumentFragment();
  downloadButton.style.display = "none";

  logos
    .filter((item) => item.title.toLowerCase().includes(keyword.toLowerCase()))
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";

      const checkDiv = document.createElement("div");
      checkDiv.className = "check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = item.id;
      checkbox.name = item.id;
      checkbox.checked = item.checked;
      if (checkbox.checked) {
        card.classList.toggle("checked");
      }
      checkbox.addEventListener("change", (e) => {
        card.classList.toggle("checked");
        item.checked = e.target.checked;

        downloadButton.style.display = logos.some((logo) => logo.checked)
          ? "flex"
          : "none";
      });

      const label = document.createElement("label");
      label.htmlFor = item.id;

      const checkboxDiv = document.createElement("div");
      checkboxDiv.className = "checkbox";

      const checkImg = document.createElement("img");
      checkImg.src = "./asset/check.svg";
      checkImg.alt = "check";

      checkboxDiv.appendChild(checkImg);
      label.appendChild(checkboxDiv);

      const title = document.createElement("div");
      title.className = "title";
      title.appendChild(document.createTextNode(item.title));

      if (Boolean(item.subTitle)) {
        const subTitleSpan = document.createElement("span");
        subTitleSpan.textContent = `(${item.subTitle})`;
        if (item.subTitle.length > 10) {
          title.className = "titleCol";
        }
        title.appendChild(subTitleSpan);
      }
      label.appendChild(title);

      const a = document.createElement("a");
      a.className = "downloadLink";
      a.href = `../${item.url}`;
      a.download = item.url.split("/")[1];
      const downloadImg = document.createElement("img");
      downloadImg.src = "./asset/download.svg";
      downloadImg.alt = "download";
      a.appendChild(downloadImg);

      checkDiv.appendChild(checkbox);
      checkDiv.appendChild(label);
      checkDiv.appendChild(a);

      const logoImg = document.createElement("img");
      logoImg.className = "logo";
      logoImg.src = `../${item.url}?raw=true`;
      logoImg.alt = item.id;

      card.appendChild(checkDiv);
      card.appendChild(logoImg);

      fragment.appendChild(card);
    });

  contentDiv.appendChild(fragment);
  downloadButton.style.display = logos.some((logo) => logo.checked)
    ? "flex"
    : "none";
}

updateList("");
searchInput.addEventListener("input", function () {
  updateList(this.value);
});

searchInput.addEventListener("click", function () {
  console.log("xd");
});
