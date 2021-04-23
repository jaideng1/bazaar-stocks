
/** Class representing a thread from hypixel.net. */
class Thread {
  /**
    * Store the information.
    * @param {string} title
    * @param {string} avatarLink - Link to the avatar of the author.
    * @param {string} [link=https://hypixel.net] - Link to the thread.
    * @param {string} [author=] - Author's username.
  */
  constructor(title, avatarLink, link="https://hypixel.net", author="") {
    this.title = title;
    this.avatarLink = avatarLink;
    this.author = author;
    this.link = link;
  }

  /**
    * Creates a div element with all of the necessary information.
    * @param {boolean} rightSide - Whether the thread will be on the right side of the page.
    * @returns {Object}
  */
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
