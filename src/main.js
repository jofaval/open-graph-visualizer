/**
 * @param {String} url
 *
 * @returns {boolean}
 */
function validUrl(url) {
  return url.startsWith("http");
}

/**
 * @param {{
 *   title: string,
 *   description: string,
 *   type: string,
 *   image: string,
 *   url: string
 *   alt: string
 * }} details
 */
function display({ image, title, type, url, description, alt }) {
  const ogUrl = document.querySelector("#ogUrl");
  if (ogUrl) {
    ogUrl.href = url;
  }

  const ogImage = document.querySelector("#ogImage");
  if (ogImage) {
    ogImage.src = image;
    ogImage.alt = alt;
  }

  const ogTitle = document.querySelector("#ogTitle");
  if (ogTitle) {
    ogTitle.innerText = title;
  }

  const ogDescription = document.querySelector("#ogDescription");
  if (ogDescription) {
    ogDescription.innerText = description;
  }
}

/**
 * @param {String} url
 *
 * @returns {{ title: string, type: string, image: string, url: string }}
 */
async function scrape(url) {
  const html = await (
    await fetch(url, {
      //   headers: (() => {
      //     const headers = new Headers();
      //     headers.set(
      //       "Access-Control-Allow-Origin",
      //       "https://jofaval.github.io/open-graph-visualizer"
      //     );
      //     return headers;
      //   })(),
    })
  ).text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  console.log({ doc });

  const metadata = doc.querySelector("head").querySelectorAll("meta");
  const openGraphDetails = {};

  metadata.forEach((meta) => {
    // TODO: implement all the keys
    switch (meta.getAttribute("property")) {
      case "og:title":
        openGraphDetails.title = meta.content;
        break;
      case "og:type":
        openGraphDetails.type = meta.content;
        break;
      case "og:image":
        openGraphDetails.image = meta.content;
        break;
      case "og:url":
        openGraphDetails.url = meta.content;
        break;
      case "og:description":
        openGraphDetails.description = meta.content;
        break;
      case "og:image:alt":
        openGraphDetails.alt = meta.content;
        break;

      default:
        break;
    }
  });

  display(openGraphDetails);
}

/**
 * @param {Element|null} form
 *
 * @returns {{ success: boolean, message: string } | null}
 */
function handleSubmit(form) {
  const url = form.querySelector("#url").value;
  console.log({ url });

  if (!validUrl(url)) {
    return { message: "URL is not valid", success: false };
  }

  const openGraphDetails = scrape(url);
  console.log({ openGraphDetails });
}

/**
 * @param {{ success: boolean, message: string }} param0
 *
 * @returns {void}
 */
function notification({ message, success }) {
  console.log({ message, success });
}

(() => {
  const form = document.querySelector("#form");
  form.addEventListener("submit", function (evt) {
    evt.preventDefault();

    const message = handleSubmit(form);
    if (message) {
      notification(message);
    }

    return false;
  });
})();
