const FOUR_HOURS_MS = 14400000;

var dragging = false;
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    dragging = true;
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement(e) {
    e.stopPropagation();
    setTimeout(() => (dragging = false), 100);
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function addOverlayElement() {
  if (document.getElementById("overlay")) return;
  const div = document.createElement("div");
  div.innerHTML = `<div id="overlay" style="
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
">

  <h3 style="
    color: #fff;
    padding: 1rem;
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 2rem;
  ">I came here for a reason, and that reason is...</h3>

  <input type="text" style="
    width: 70%;
    max-width: 30rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 0.25rem;
    background-color: #f1f1f1;
    color: #333; /* Dark text color */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  " id="reasonInput"/>

  <button style="
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 0.25rem;
    background-color: #4caf50;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  " id="reasonSubmit">Continue</button>

</div>
`;
  //addOverlayElement
  document.body.append(div.firstChild);
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("reasonInput").focus();
  function submitReason(reason) {
    addBannerElement();
    document.getElementById("banner-message").textContent = reason;
    document.getElementById("overlay").style.display = "none";
    browser.storage.sync.set({
      [`v2-reason-${window.location.hostname}`]: {
        reasons: [reason],
        created_at_ms: Date.now(),
      },
    });
    document.getElementById("overlay").remove();
  }
  document
    .getElementById("reasonInput")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submitReason(event.target.value);
      }
    });
  document.getElementById("reasonSubmit").addEventListener("click", (event) => {
    event.preventDefault();
    submitReason(document.getElementById("reasonInput").value);
  });
}

function addBannerElement() {
  if (document.getElementById("banner")) return;
  const div = document.createElement("div");
  div.innerHTML = `<div id="banner" style="
  width: 100%;
  max-width: 100%;
  height: max-content;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 9999999;
  padding: 1rem;
  display: flex;
  justify-content: end;
">
  <div style="
    height: max-content;
    width: 100% - 2rem;
    max-width: max-content;
    background-color: #4caf50;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    cursor: grab;
    border-radius: 0.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
    color: #fff;
    margin-left: 2rem;
  ">
    <div id="banner-message" style="
      padding-left: 1.5rem;
      font-size: 1rem;
      white-space: break-spaces;
      margin-top: 1rem;
      margin-bottom: 1rem;
    "></div>

    <div id="banner-close" type="button" style="
      cursor: pointer;
      font-size: 0.75rem;
      text-decoration: underline;
      padding: 0.5rem;
      margin: 1rem;
      color: #fff;
      transition: background-color 0.3s ease;
    ">Mark complete</div>
  </div>
</div>
`;
  //addBannerElement
  document.body.insertBefore(div.firstChild, document.body.firstChild);
  dragging = false;
  document.getElementById("banner-close").addEventListener("click", (event) => {
    if (dragging) return;
    event.stopPropagation();
    browser.storage.sync
      .remove(`v2-reason-${window.location.hostname}`)
      .then(() => browser.storage.sync.get(["shouldUseHomepage", "homepage"]))
      .then((result) => {
        if (result.shouldUseHomepage && result.homepage) {
          window.location.assign(result.homepage);
        } else {
          addOverlayElement();
          document.getElementById("reasonInput").value = "";
          document.getElementById("overlay").style.display = "flex";
          document.getElementById("reasonInput").focus();
        }
      });
    document.getElementById("banner").remove();
  });
  dragElement(document.getElementById("banner"));
  document.getElementById("banner").addEventListener("touchmove", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var touchLocation = e.targetTouches[0];
    var banner = document.getElementById("banner");

    banner.style.left =
      touchLocation.pageX - window.scrollX - banner.offsetWidth / 2 + "px";
    banner.style.top =
      touchLocation.pageY - window.scrollY - banner.offsetHeight / 2 + "px";
  });

  document.getElementById("banner").addEventListener("touchend", function (e) {
    var x = parseInt(box.style.left);
    var y = parseInt(box.style.top);
  });
}

function escapeRegExpAndInterpretWildcards(string) {
  return string.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/[*]/g, ".$&"); // $& means the whole matched string
}

function main(results) {
  if (results.urlPatterns) {
    for (const pattern of results.urlPatterns) {
      if (
        new RegExp("^" + escapeRegExpAndInterpretWildcards(pattern), "i").test(
          window.location.href
        )
      ) {
        browser.storage.sync.get(`v2-reason-${window.location.hostname}`).then(
          (results) => {
            if (
              results[`v2-reason-${window.location.hostname}`] &&
              results[`v2-reason-${window.location.hostname}`].created_at_ms +
                FOUR_HOURS_MS >
                Date.now()
            ) {
              addBannerElement();
              document.getElementById("banner-message").textContent =
                results[`v2-reason-${window.location.hostname}`].reasons[0];
            } else {
              addOverlayElement();
              document.getElementById("overlay").style.display = "flex";
            }
          },
          (error) => console.log(`Error: ${error}`)
        );
      }
    }
  }
}
browser.storage.sync.get("urlPatterns").then(main, console.log);
