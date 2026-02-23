/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* global JSZip */

/**
 * Sends a progress notification message to the inspector panel.
 *
 * @param {number} tabId
 *        The ID of the inspected tab where progress is being notified.
 * @param {String} progress
 *        The current progress string.
 */
function notifyProgress(tabId, progress) {
  browser.runtime.sendMessage({
    msg: "notify-progress",
    tabId,
    progress,
  });
}

/**
 * Retrieves the hostname of a tab based on its ID.
 *
 * @param {number} tabId
 *        The ID of the tab to retrieve the hostname for.
 * @returns {Promise<string>}
 *          A promise that resolves to the hostname of the tab's URL.
 */
async function getHostNameByTabId(tabId) {
  const tab = await browser.tabs.get(tabId);
  const urlObj = new URL(tab.url);
  return urlObj.hostname;
}

/**
 * Loads a file from the extension's directory and parses it based on its type or extension.
 *
 * @param {string} filename
 *        The name or path of the file to load.
 * @param {string|null} [type=null]
 *        The expected return type ('blob', or inferred from file extension like 'json' or 'text').
 * @returns {Promise<string|Object|Blob>}
 *        A promise that resolves to the file content (text, JSON object, or Blob).
 */
async function loadFile(filename, type = null) {
  let data;
  try {
    const url = browser.runtime.getURL(filename);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const extension = url.split(".").pop().toLowerCase();
    if (type == "blob") {
      data = await response.blob();
    } else if (extension === "json") {
      data = await response.json();
    } else {
      data = await response.text();
    }
  } catch (error) {
    console.error("Failed to load JSON data:", error);
  }

  return data;
}

/**
 * Converts a data URL to a Blob object.
 *
 * @param {string} url
 *        The data URL to convert (e.g., "data:image/png;base64,...").
 * @returns {Blob}
 *        A Blob object representing the binary data.
 */
function dataURLToBlob(url) {
  const binary = atob(url.split(",", 2)[1]); // Decode base64 data
  let contentType = url.split(",", 1)[0]; // Extract the content type
  contentType = contentType.split(";", 1)[0].split(":", 2)[1];

  // Default to "image/png" if the content type is not supported
  if (contentType !== "image/png" && contentType !== "image/jpeg") {
    contentType = "image/png";
  }

  // Convert binary string to Uint8Array
  const data = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  // Create and return a Blob
  return new Blob([data], { type: contentType });
}

/**
 * Downloads a file using the browser's downloads API.
 *
 * @param {string} filename
 *        The name to save the downloaded file as.
 * @param {Blob} blob
 *        The Blob object representing the file content.
 * @param {boolean} [saveAs=true]
 *        Whether to prompt the "Save As" dialog.
 */
async function download(filename, blob, saveAs = true) {
  // Trigger download with a save-as dialog
  const url = URL.createObjectURL(blob);
  try {
    await browser.downloads.download({ url, filename, saveAs });
  } finally {
    // Clean up the Blob URL after download
    URL.revokeObjectURL(url);
  }
}

/**
 * Compresses a list of files into a ZIP archive and triggers a download.
 *
 * @param {Array<{ filename: string, blob: Blob }>} files
 *        Array of file objects to include in the ZIP archive.
 *        Each object must have a `filename` and a `blob` property.
 * @param {string} host
 *        The host name to include in the ZIP file's name.
 * @param {string} prefix
 *        A prefix to include in the ZIP file's name.
 */
async function zipAndDownload(files, host, prefix) {
  const url = browser.runtime.getURL("/libs/jszip.js");

  // eslint-disable-next-line no-unsanitized/method
  await import(url);
  const zip = JSZip();
  for (const file of files) {
    zip.file(file.filename, file.blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  download(`${prefix}-${host}.zip`, blob);
}

class HighlightFeature {
  /**
   * Scrolls an element into view.
   *
   * @param {number} tabId
   *        The ID of the tab where the element is in.
   * @param {Object} fieldDetail
   *        The details of the field to scroll into view.
   */
  static scrollIntoView(tabId, fieldDetail) {
    const { inspectId, frameId } = fieldDetail;
    browser.scripting.executeScript({
      target: {
        tabId,
        frameIds: [frameId],
      },
      func: (aInspectId) => {
        const selector = `[data-moz-autofill-inspect-id="${aInspectId}"]`;
        const element = document.querySelector(selector);
        if (!element) {
          return;
        }
        const rect = element.getBoundingClientRect();
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth);

        if (!isInViewport) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      },
      args: [inspectId],
    });
  }

  /**
   * Adds highlight overlays to elements.
   *
   * @param {number} tabId
   *        The ID of the tab where the element is in.
   * @param {string} type
   *        The type of highlight. Either `select` or `hover`.
   * @param {Array<Object>} fieldDetails
   *        An array of field details of elements to highlight.
   */
  static async addHighlightOverlay(tabId, type, fieldDetails) {
    const frames = await browser.webNavigation.getAllFrames({ tabId });
    for (const frame of frames) {
      const inspectIds = fieldDetails
        .filter((fd) => fd.frameId == frame.frameId)
        .map((fd) => fd.inspectId);
      browser.scripting.executeScript({
        target: {
          tabId,
          frameIds: [frame.frameId],
        },
        func: (aType, aInspectIds) => {
          aInspectIds.forEach((inspectId) => {
            const color = aType == "select" ? "blue" : "red";
            const bgColor =
              aType == "select"
                ? "rgba(0, 0, 255, 0.2)"
                : "rgba(255, 0, 0, 0.2)";
            const zIndex = aType == "select" ? 9999 : 9998;

            const selector = `[data-moz-autofill-inspect-id="${inspectId}"]`;
            const element = document.querySelector(selector);
            if (!element) {
              return;
            }

            const id = `moz-${aType}-highlight-overlay-${inspectId}`;
            if (document.getElementById(id)) {
              // The overlay already exists
              return;
            }
            const highlightOverlay = document.createElement("div");
            highlightOverlay.classList.add("moz-autofill-overlay");
            highlightOverlay.id = id;
            document.body.appendChild(highlightOverlay);

            const BORDER = 2;
            Object.assign(highlightOverlay.style, {
              position: "absolute",
              backgroundColor: `${bgColor}`,
              border: `${BORDER}px solid ${color}`,
              zIndex,
              pointerEvents: "none",
            });

            const rect = element.getBoundingClientRect();
            highlightOverlay.style.top =
              rect.top + window.scrollY - BORDER + "px";
            highlightOverlay.style.left =
              rect.left + window.scrollX - BORDER + "px";
            highlightOverlay.style.width = rect.width + "px";
            highlightOverlay.style.height = rect.height + "px";
          });
        },
        args: [type, inspectIds],
      });
    }
  }

  /**
   * Removes all highlights in the given tab.
   *
   * @param {number} tabId
   *        The ID of the tab to remove highlight from.
   */
  static async removeAllHighlightOverlay(tabId) {
    const frames = await browser.webNavigation.getAllFrames({ tabId });
    browser.scripting.executeScript({
      target: {
        tabId,
        frameIds: [...frames.map((frame) => frame.frameId)],
      },
      func: () => {
        document
          .querySelectorAll("div.moz-autofill-overlay")
          .forEach((element) => element.remove());
      },
    });
  }

  /**
   * Removes highlight overlays from elements.
   *
   * @param {number} tabId
   *        The ID of the tab where the element is in.
   * @param {string} type
   *        The type of highlight. Either `select` or `hover`.
   * @param {Array<Object>} fieldDetails
   *        An array of field details of elements to highlight.
   */
  static async removeHighlightOverlay(tabId, type, fieldDetails) {
    const frames = await browser.webNavigation.getAllFrames({ tabId });
    for (const frame of frames) {
      const inspectIds = fieldDetails
        .filter((fd) => fd.frameId == frame.frameId)
        .map((fd) => fd.inspectId);
      browser.scripting.executeScript({
        target: {
          tabId,
          frameIds: [frame.frameId],
        },
        func: (aType, aInspectIds) => {
          aInspectIds.forEach((inspectId) => {
            const overlay = document.getElementById(
              `moz-${aType}-highlight-overlay-${inspectId}`,
            );
            overlay?.remove();
          });
        },
        args: [type, inspectIds],
      });
    }
  }
}

class DownloadPageFeature {
  /**
   * Remove attributes we have set for inspector before saving the page, which includes:
   * - data-moz-autofill-inspect-id
   * - data-moz-autofill-inspector-change
   *
   * We will save additional attribte - `data-moz-autofill-type` so we can use this
   * for ML training
   */
  static async #beforeFreeze(tabId, fieldDetails) {
    const frames = await browser.webNavigation.getAllFrames({ tabId });
    for (const frame of frames) {
      const inspectedFields = fieldDetails
        .filter((fd) => fd.frameId == frame.frameId)
        .map((fd) => [fd.inspectId, fd.fieldName]);
      if (!inspectedFields.length) {
        continue;
      }

      await browser.scripting.executeScript({
        target: {
          tabId,
          frameIds: [frame.frameId],
        },
        func: (aInspectedFields) => {
          for (const [inspectId, fieldName] of aInspectedFields) {
            const selector = `[data-moz-autofill-inspect-id="${inspectId}"]`;
            const element = document.querySelector(selector);
            if (fieldName && fieldName != "unknown") {
              element?.setAttribute("data-moz-autofill-type", fieldName);
            } else {
              element?.removeAttribute("data-moz-autofill-type");
            }
          }
        },
        args: [inspectedFields],
      });
    }
  }

  static async #runFreeze(tabId, frame) {
    const freezePromise = new Promise((resolve) => {
      function waitForFreeze(request) {
        if (request.msg === "content-freeze-complete") {
          resolve(request.html);
          browser.runtime.onMessage.removeListener(waitForFreeze);
        }
      }
      browser.runtime.onMessage.addListener(waitForFreeze);
    });

    browser.scripting
      .executeScript({
        target: { tabId, frameIds: [frame.frameId] },
        files: ["/content/content-script.js"],
      })
      .then(() => {
        browser.tabs.sendMessage(
          tabId,
          { message: "content-freeze-page" },
          { frameId: frame.frameId },
        );
      });

    return await freezePromise;
  }

  static #postProcessingMainFrameHTML(html, urlToPath) {
    for (let [url, path] of urlToPath) {
      url = url.replace(/&/g, "&amp;");
      // Replace iframe src=url to point to local file
      const regexURL = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // TODO: Need to update this regexp
      let regex = new RegExp(`<iframe\\s+[^>]*src=["'](${regexURL})["']`, "i");
      html = html.replace(regex, (match, capturedURL) => {
        return match.replace(capturedURL, path);
      });
    }

    // Add `self` to frame-src  Content Script PolicyEnsure to ensure we can load
    // iframe with local file
    html = html.replace(`frame-src`, `frame-src 'self'`);

    // Remove attributes that are used by inspector
    const regex = /data-moz-autofill-inspect-id="\{[^}]*\}"/g;
    html = html.replace(regex, "");
    return html;
  }

  static async freezePage(tabId, fieldDetails, includeIframe = true) {
    let frames = await browser.webNavigation.getAllFrames({ tabId });
    const mainFrame = frames.find((frame) => frame.parentFrameId == -1);
    const iframes = frames.filter(
      (frame) =>
        includeIframe &&
        frame.parentFrameId == mainFrame.frameId &&
        !frame.url.startsWith("about:"),
    );

    // Put the main-frame to the last one because we want to freeze the sub-frames first.
    frames = [...iframes, mainFrame];

    notifyProgress(tabId, "freezing page - setting data attributes");
    await DownloadPageFeature.#beforeFreeze(tabId, fieldDetails);

    const pages = [];
    const urlToPath = [];
    for (let idx = 0; idx < frames.length; idx++) {
      const frame = frames[idx];
      notifyProgress(
        tabId,
        `freezing frame (${idx + 1}/${frames.length}) - ${frame.url}`,
      );
      let html;
      try {
        html = await DownloadPageFeature.#runFreeze(tabId, frame);
      } catch (error) {
        notifyProgress(
          tabId,
          `Error freezing frame (${idx + 1}/${frames.length}) - ${frame.url} : ${error}`,
        );
      }

      let filename;
      if (idx != frames.length - 1) {
        filename = `${new URL(frame.url).host}/${idx}.html`;
        urlToPath.push([frame.url, filename]);
      } else {
        filename = `${new URL(frame.url).host}.html`;
        html = DownloadPageFeature.#postProcessingMainFrameHTML(
          html,
          urlToPath,
        );
      }
      pages.push({
        filename,
        blob: new Blob([html], { type: "text/html" }),
      });
    }

    return pages;
  }

  static async screenshot(tabId) {
    notifyProgress(tabId, "screenshoting page");

    const host = await getHostNameByTabId(tabId);

    const [{ result }] = await browser.scripting.executeScript({
      target: { tabId },
      func: () => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      }),
    });

    const dataUrl = await browser.experiments.autofill.captureTab(
      tabId,
      0,
      0,
      result.width,
      result.height,
    );
    return {
      filename: `screenshot-${host}.png`,
      blob: dataURLToBlob(dataUrl),
    };
  }

  static async exportInspect(tabId, panelDataUrl) {
    notifyProgress(tabId, "exporting inspect result");

    const host = await getHostNameByTabId(tabId);
    return {
      filename: `inspect-${host}.png`,
      blob: dataURLToBlob(panelDataUrl),
    };
  }
}

class GenerateTestFeature {
  /**
   * Converts field details into a structured format for generating test results.
   *
   * @param {Array<Object>} fieldDetails
   *        Array of field detail objects.
   * @returns {Array<Object>}
   *          Array of sections with structured field data.
   */
  static #fieldDetailsToTestExpectedResult(fieldDetails) {
    let expectedSection;
    const sections = [];
    let formIndex;
    let sectionIndex;
    for (const fieldDetail of fieldDetails) {
      // Skip fields that are invisible or lack a field name
      if (
        !fieldDetail.fieldName ||
        (!fieldDetail.isVisible && fieldDetail.localName == "input")
      ) {
        continue;
      }

      if (
        fieldDetail.formIndex != formIndex ||
        fieldDetail.sectionIndex != sectionIndex
      ) {
        formIndex = fieldDetail.formIndex;
        sectionIndex = fieldDetail.sectionIndex;

        expectedSection = {
          fields: [],
        };
        sections.push(expectedSection);
      }
      let expectedField = {
        fieldName: fieldDetail.fieldName,
        reason: fieldDetail.reason,
        "data-moz-autofill-inspect-id": fieldDetail.inspectId,
      };
      if (fieldDetail.part) {
        expectedField.part = fieldDetail.part;
      }
      expectedSection.fields.push(expectedField);
    }
    return sections;
  }

  static async create(host, fieldDetails) {
    const inspectResult =
      GenerateTestFeature.#fieldDetailsToTestExpectedResult(fieldDetails);
    const filename = `${host}.json`;
    const text = JSON.stringify(inspectResult, null, 2);

    const scriptBlob = await loadFile("data/gen-test.py", "blob");
    return [
      { filename, blob: text },
      { filename: `gen-test.py`, blob: scriptBlob },
    ];
  }
}

class AutofillFeature {
  /**
   * Loads the test addresses from a JSON file.
   *
   * @returns {Promise<Object[]>}
   *          A promise that resolves to an array of test addresses.
   */
  static async #getTestAddresses() {
    return await loadFile("data/test-addresses.json");
  }

  /**
   * Loads the test credit cards from a JSON file.
   *
   * @returns {Promise<Object[]>}
   *           A promise that resolves to an array of test credit cards.
   */
  static async #getTestCreditCards() {
    return await loadFile("data/test-credit-cards.json");
  }

  static async #setInspectId(tabId) {
    const frames = await browser.webNavigation.getAllFrames({ tabId });
    await browser.scripting.executeScript({
      target: {
        tabId,
        frameIds: [...frames.map((frame) => frame.frameId)],
      },
      func: () => {
        document
          .querySelectorAll("input, select, iframe")
          .forEach((element) => {
            const INSPECT_ATTRIBUTE = "data-moz-autofill-inspect-id";
            let uuid = element.getAttribute(INSPECT_ATTRIBUTE);
            if (!uuid) {
              uuid = crypto.randomUUID();
              element.setAttribute(INSPECT_ATTRIBUTE, uuid);
            }
          });
      },
    });
  }

  /**
   * Executes an autofill inspection on a specific tab and sends the result via a message.
   *
   * @param {number} tabId
   *        The ID of the tab to inspect.
   * @param {Object} changes
   *        The changes to apply during inspection.
   */
  static async inspect(tabId, changes) {
    try {
      await AutofillFeature.#setInspectId(tabId);
      const result = await browser.experiments.autofill.inspect(tabId, changes);
      await browser.runtime.sendMessage({
        msg: "inspect-complete",
        tabId,
        data: result,
      });
    } catch (error) {
      console.warn("Failed to send inspect-complete message:", error);
    }
  }

  /**
   * Sets test records (addresses and/or credit cards) in a specific tab.
   *
   * @param {number} tabId
   *        The ID of the tab to set the test records in.
   * @param {boolean} address
   *        Whether to include test addresses.
   * @param {boolean} creditcard
   *        Whether to include test credit cards.
   */
  static async setTemporaryRecordsForTab(tabId, address, creditcard) {
    const records = [];

    if (address) {
      const addresses = await AutofillFeature.#getTestAddresses();
      records.push(...addresses);
    }

    if (creditcard) {
      const creditcards = await AutofillFeature.#getTestCreditCards();
      records.push(...creditcards);
    }

    try {
      await browser.experiments.autofill.setTemporaryRecordsForTab(
        tabId,
        records,
      );
    } catch (error) {
      console.error("Failed to set test records:", error);
    }
  }
}

async function handleMessage(request) {
  const tabId = request.tabId;
  if (!tabId) {
    return;
  }

  switch (request.msg) {
    // Run autofill fields inspection
    case "inspect": {
      const { changes } = request;
      HighlightFeature.removeAllHighlightOverlay(tabId);
      AutofillFeature.inspect(tabId, changes);
      break;
    }
    case "set-test-records": {
      const { address, creditcard } = request;
      AutofillFeature.setTemporaryRecordsForTab(tabId, address, creditcard);
      break;
    }
    // Download the page markup
    case "download-page": {
      const { fieldDetails, includeIframe } = request;
      const host = await getHostNameByTabId(tabId);

      const pages = await DownloadPageFeature.freezePage(
        tabId,
        fieldDetails,
        includeIframe,
      );
      zipAndDownload(pages, host, "page");
      break;
    }
    // Generate a report with everything
    case "generate-report": {
      const { panelDataUrl, fieldDetails, includeIframe } = request;
      const host = await getHostNameByTabId(tabId);

      const screenshot = await DownloadPageFeature.screenshot(tabId);
      const inspect = await DownloadPageFeature.exportInspect(
        tabId,
        panelDataUrl,
      );
      const pages = await DownloadPageFeature.freezePage(
        tabId,
        fieldDetails,
        includeIframe,
      );
      pages.forEach((page) => (page.filename = `page/${page.filename}`));

      const tests = await GenerateTestFeature.create(host, fieldDetails);
      tests.forEach((test) => (test.filename = `test/${test.filename}`));

      zipAndDownload([screenshot, inspect, ...pages, ...tests], host, "report");
      break;
    }
    case "export-inspect": {
      const { panelDataUrl } = request;

      const files = await Promise.all([
        DownloadPageFeature.screenshot(tabId),
        DownloadPageFeature.exportInspect(tabId, panelDataUrl),
      ]);
      files.forEach((file) => download(file.filename, file.blob, false));
      break;
    }
    case "scroll-to": {
      const { fieldDetail } = request;
      HighlightFeature.scrollIntoView(tabId, fieldDetail);
      break;
    }
    case "highlight": {
      const { type, fieldDetails } = request;
      HighlightFeature.addHighlightOverlay(tabId, type, fieldDetails);
      break;
    }
    case "remove-highlight": {
      const { type, fieldDetails } = request;
      HighlightFeature.removeHighlightOverlay(tabId, type, fieldDetails);
      break;
    }
  }
}

/**
 * Listen for messages from our devtools panel.
 */
browser.runtime.onMessage.addListener(handleMessage);
