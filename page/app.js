import data from "./logos.json" assert { type: "json" };

function targetDownloadButton() {
  downloadButton.style.display = logos.some((logo) => logo.checked)
    ? "flex"
    : "none";

  const count = logos.filter((logo) => logo.checked).length;
  downloadButton.firstChild.nodeValue = `download (${count})`;
}

function genList() {
  contentDiv.innerHTML = "";
  downloadButton.style.display = "none";

  const cards = logos.map((item) => {
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

      targetDownloadButton();
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

    const title = document.createElement("p");
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
    a.download = decodeURIComponent(item.url).split("/")[1];
    const downloadImg = document.createElement("img");
    downloadImg.src = "./asset/download_.svg";
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

    return card;
  });

  contentDiv.append(...cards);
  targetDownloadButton();

  return cards;
}

async function urlToPromise(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch resource");
  }
  return response.blob();
}

function updateDisplay(keyword) {
  cards.forEach((card, i) => {
    const item = logos[i];
    if (item.title.toLowerCase().includes(keyword.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function genZip() {
  const zip = new JSZip();

  logos
    .filter((logo) => logo.checked)
    .forEach((logo) => {
      zip.file(
        decodeURIComponent(logo.url).split("/")[1],
        urlToPromise(`../${logo.url}`),
        {
          binary: true,
        },
      );
    });

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ServerLogos.zip";
    a.click();
  });
}

const contentDiv = document.querySelector(".content");
const downloadButton = document.querySelector(".download button");
const searchInput = document.querySelector("#search");

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

const cards = genList();
searchInput.addEventListener("input", function () {
  updateDisplay(this.value);
});

downloadButton.addEventListener("click", function () {
  genZip();
});
