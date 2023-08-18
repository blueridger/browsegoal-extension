var saveMessageTimeout;

function disableOrEnableHompageInput() {
  if (document.getElementById("shouldUseHomepage").checked) {
    document.getElementById("homepage").disabled = false;
  } else {
    document.getElementById("homepage").disabled = true;
  }
}

function saveOptions() {
  const urlPatterns = document
    .getElementById("urlPatterns")
    .value.split("\n")
    .map((pattern) => pattern.trim())
    .filter((pattern) => pattern);
  let homepage = document.getElementById("homepage").value.trim();
  if (homepage && !homepage.startsWith("http")) homepage = "https://" + homepage;

  browser.storage.sync.set({
    urlPatterns,
    homepage,
    shouldUseHomepage: document.getElementById("shouldUseHomepage").checked,
  });
}

function handleInputEvent(event) {
  disableOrEnableHompageInput();
  saveOptions();
  const saveMessageId =
    event.target.id === "urlPatterns"
      ? "urlPatternsSaveMessage"
      : "homepageSaveMessage";
  const saveMessage = document.getElementById(saveMessageId);
  if (saveMessage) {
    saveMessage.innerHTML = "Changes saved!";
    clearTimeout(saveMessageTimeout);
    saveMessageTimeout = setTimeout(() => {
      Array.from(document.getElementsByClassName("save-message")).forEach(
        (saveMessage) => (saveMessage.innerHTML = "")
      );
    }, 2000);
  }
}

function restoreOptions() {
  browser.storage.sync
    .get(["urlPatterns", "homepage", "shouldUseHomepage"])
    .then((result) => {
      const urlPatterns = result.urlPatterns ?? [
        "https://*.facebook.com",
        "https://*.twitter.com",
        "https://*.instagram.com",
        "https://*.amazon.com",
      ];
      document.getElementById("urlPatterns").value = urlPatterns.join("\n");

      document.getElementById("homepage").value = result.homepage ?? "";
      document.getElementById("shouldUseHomepage").checked =
        result.shouldUseHomepage ?? false;
      disableOrEnableHompageInput();
      saveOptions();
    }, console.log);
}

document.addEventListener("DOMContentLoaded", restoreOptions);

const inputs = document.getElementsByTagName("input");
Array.from(inputs).forEach((input) => {
  input.addEventListener("input", handleInputEvent);
});

const textarea = document.getElementById("urlPatterns");
textarea.addEventListener("input", handleInputEvent);
