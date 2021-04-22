

class Thread {
  constructor(title, avatarLink, link="https://hypixel.net", author="") {
    this.title = title;
    this.avatarLink = avatarLink;
    this.author = author;
    this.link = link;
  }

  getHTML(rightSide) {
    let divEle = document.createElement("div");

    divEle.classList.add("news-thread");

    divEle.onclick = () => {
      alert("this isn't functional yet, but here's the thread. this will change in the future.");
      location.href = this.link;
    }

    let imageEle = document.createElement("img");

    //Change the image from a small to a large, or just use green cause they have no avatar.
    imageEle.src = (this.avatarLink != null) ? this.avatarLink.replace("/s/", "/l/") : greenImageSrc;

    imageEle.height = 200;
    imageEle.width = 200;

    let textEle = document.createElement("h4");

    textEle.textContent = this.title;

    divEle.appendChild(imageEle);
    divEle.appendChild(textEle);

    if (rightSide) {
      divEle.classList.add("news-thread-right-side");
    } else {
      divEle.classList.add("news-thread-left-side");
    }

    return divEle;
  }
}
