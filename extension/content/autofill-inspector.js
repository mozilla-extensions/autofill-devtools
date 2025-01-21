/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* global html2canvas */

const CREDIT_CARD_TYPES = [
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp-month",
  "cc-exp-year",
  "cc-exp",
  "cc-type",
  "cc-csc",
];

const ADDRESS_TYPES = [
  "name",
  "given-name",
  "additional-name",
  "family-name",
  "organization",
  "email",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level1",
  "address-level2",
  "address-level3",
  "address-streetname",
  "address-housenumber",
  "postal-code",
  "country",
  "country-name",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-local-prefix",
  "tel-local-suffix",
  "tel-extension",
];

/**
 * Finds the next index in an array that satisfies a given condition.
 *
 * @param {Array} array
 *        The array to search through.
 * @param {Integer} start
 *        The start index to start searching from.
 * @param {Integer} end
 *        The end of index to search
 * @param {compareFunc} condition
 *        A callback function to find the element.
 * @returns {Integer}
 *        The index of the next element that satisfies the condition, or the array length if none is found.
 */
function findNextIndex(array, start, end, compareFunc) {
  for (let i = start + 1; i < end; i++) {
    if (compareFunc(array[i])) {
      return i;
    }
  }
  return end;
}

/**
 * Finds a `td` element in the same row as a given `td`, identified by its ID.
 *
 * @param {HTMLTableCellElement} td
 *        The reference table cell element.
 * @param {string} id
 *        The ID of the target `td` element to find.
 * @returns {HTMLTableCellElement|null}
 *       The found `td` element, or `null` if not found.
 */
function findTdInSameRowById(td, id) {
  return td.closest("tr")?.querySelector(`td#${id}`);
}

/**
 * Retrieves all rows spanned by a given `td` element, based on its `rowSpan` attribute.
 *
 * @param {HTMLTableCellElement} td
 *        The reference table cell element.
 * @returns {HTMLTableRowElement[]}
 *        An array of rows spanned by the `td` element.
 */
function getSpannedRows(td) {
  const rowSpan = td.rowSpan;
  const currentRow = td.parentElement;
  const table = currentRow.parentElement;

  const rowIndex = Array.from(table.children).indexOf(currentRow);

  const spannedRows = [];
  for (let i = 0; i < rowSpan; i++) {
    const nextRow = table.children[rowIndex + i];
    if (nextRow) {
      spannedRows.push(nextRow);
    }
  }
  return spannedRows;
}

/**
 * Sends a message to the background script, including the current inspected tab's ID.
 *
 * @param {string} msg
 *        The message type or identifier.
 * @param {Object} request
 *        Additional data to send along with the message.
 */
function sendMessage(msg, request) {
  browser.runtime.sendMessage({
    msg,
    tabId: browser.devtools.inspectedWindow.tabId,
    ...request,
  });
}

class AutofillInspector {
  /**
   * Map that stores field names manually updated by their inspection IDs.
   * Key: inspection ID (string)
   * Value: updated field name (string)
   */
  #updateFieldDetailByInspectId = new Map();
  #originFieldNameByInspectId = new Map();
  #hasEverEdited = false;

  /**
   * Array contains the list of all inspected elements. This value
   * is set after calling `inspect` experiment API.
   */
  #inspectedFieldDetails = null;

  /**
   * Map that maintains a mapping between table row (`<tr>`) elements
   * and their corresponding field details.
   */
  #rowToFieldDetail = new Map();

  #buttonClickHandlers = [
    ["autofill-inspect-start-button", () => this.inspect()],
    ["autofill-inspect-element-button", () => this.onInspectElement()],
    ["autofill-screenshot-button", () => this.onScreenshot()],
    ["autofill-download-button", () => this.onDownloadPage()],
    ["autofill-edit-field-button", (event) => this.onEditFields(event)],
    ["autofill-generate-test-button", () => this.onGenerateReport()],
  ];

  #checkboxChangeHandlers = [
    ["autofill-show-invisible-button", () => this.onFilterFields()],
    ["autofill-show-unknown-button", () => this.onFilterFields()],
    ["autofill-add-address-button", () => this.onAddOrRemoveTestRecord()],
    ["autofill-add-credit-card-button", () => this.onAddOrRemoveTestRecord()],
  ];

  /**
   * Array of <th> configuration of the header of inspect result table.
   */
  #tableHeaders = [
    { id: "col-form", text: "Form" },
    { id: "col-section", text: "Section" },
    { id: "col-frame", text: "Frame" },
    { id: "col-fieldName", text: "FieldName" },
    { id: "col-reason", text: "Reason" },
    { id: "col-identifier", text: "Id/Name" },
    { id: "col-isVisible", text: "Visible" },
    { id: "col-part", text: "Part" },
    { id: "col-confidence", text: "Confidence" },
  ];

  constructor() {
    document.addEventListener("DOMContentLoaded", () => this.init(), {
      once: true,
    });
    // Handle requests from background script.
    browser.runtime.onMessage.addListener((request) => this.onMessage(request));
  }

  init() {
    // Helper to attach event listeners
    const addEventListeners = (handlers, eventType) => {
      for (const [id, handler] of handlers) {
        const element = document.getElementById(id);
        element.addEventListener(eventType, (event) => handler(event));
      }
    };

    // Setup toolbar button and checkbox change handlers
    addEventListeners(this.#buttonClickHandlers, "click");
    addEventListeners(this.#checkboxChangeHandlers, "change");

    // Setup inspect result table
    const headerRow = document.getElementById("form-analysis-head-row");
    headerRow.append(
      ...this.#tableHeaders.map((header) => {
        const th = document.createElement("th");
        th.id = header.id;
        th.className = "field-list-column";

        // eslint-disable-next-line no-unsanitized/property
        th.innerHTML = `<div>${header.text}</div>`;
        return th;
      }),
    );
  }

  /**
   * Process message from the background script
   */
  onMessage(request) {
    if (request.tabId != browser.devtools.inspectedWindow.tabId) {
      return;
    }

    switch (request.msg) {
      case "inspect-complete": {
        // Clone the field detail array
        this.#inspectedFieldDetails = Array.from(request.data, (item) => ({
          ...item,
        }));

        if (this.#originFieldNameByInspectId.size == 0) {
          this.#inspectedFieldDetails.forEach((fd) =>
            this.#originFieldNameByInspectId.set(fd.inspectId, fd.fieldName),
          );
        }
        this.#updateFieldsInfo(this.#inspectedFieldDetails);

        // Unblock those waiting for inspect results
        this.onInspectCompleteResolver?.();
        this.onInspectCompleteResolver = null;
        break;
      }
      case "notify-progress": {
        this.#updateProgress(request.progress);
        break;
      }
    }
  }

  inspect(triggerManually = true) {
    this.#inspectedFieldDetails = null;

    if (triggerManually) {
      this.#updateFieldDetailByInspectId.clear();
      this.#originFieldNameByInspectId.clear();
    }
    sendMessage("inspect", {
      changes: Array.from(this.#updateFieldDetailByInspectId.values()),
    });
  }

  /**
   * Call devtools inspector API to inspect the selected element
   */
  onInspectElement() {
    // There might be multiple selected elements, we always inspect the first one.
    const row = document.querySelector("tr.selected");
    const fieldDetail = this.#rowToFieldDetail.get(row);
    const js = `
      (function() {
        const selector = '[data-moz-autofill-inspect-id="${fieldDetail.inspectId}"]'
        inspect(document.querySelector(selector));
      })();
    `;
    browser.devtools.inspectedWindow.eval(js).catch((e) => console.error(e));
  }

  async waitForInspect() {
    if (!this.#inspectedFieldDetails) {
      const waitForInspect = new Promise(
        (resolve) => (this.onInspectCompleteResolver = resolve),
      );
      this.inspect();
      await waitForInspect;
    }
  }

  async onScreenshot() {
    this.#updateProgress("exporting inspect result");
    await this.waitForInspect();

    const panelDataUrl = await this.#captureInspectorPanel();
    sendMessage("export-inspect", { panelDataUrl, saveAs: false });
  }

  async onDownloadPage() {
    this.#updateProgress("downloading page");
    await this.waitForInspect();

    sendMessage("download-page", { fieldDetails: this.#inspectedFieldDetails });
  }

  async onGenerateReport() {
    this.#updateProgress("generating report");
    await this.waitForInspect();

    const panelDataUrl = await this.#captureInspectorPanel();
    sendMessage("generate-report", {
      panelDataUrl,
      fieldDetails: this.#inspectedFieldDetails,
    });
  }

  // - Different button icon so we know we need to apply
  // - Do not change FieldName size in edit mode
  async onEditFields(event) {
    await this.waitForInspect();

    const isEditing = event.target.classList.contains("editing");

    document.querySelectorAll("td#col-fieldName").forEach((tdFieldName) => {
      const tdReason = findTdInSameRowById(tdFieldName, `col-reason`);
      const tr = tdFieldName.closest("tr");
      const fieldDetail = this.#rowToFieldDetail.get(tr);

      if (isEditing) {
        const selectFieldName = tdFieldName.querySelector("select");
        const selectReason = tdReason.querySelector("select");

        // Apply the <select> value to <td>
        if (selectFieldName) {
          tdFieldName.textContent = selectFieldName.value;
          selectFieldName.remove();
        }
        if (selectReason) {
          tdReason.textContent = selectReason.value;
          selectReason.remove();
        }

        if (this.#hasEverEdited) {
          this.#hasEverEdited = false;
          this.inspect(false);
        }
      } else {
        // Clear the <td> state
        tdFieldName.classList.remove("changed");

        const select = this.#createSelectAndOptions(
          [...ADDRESS_TYPES, ...CREDIT_CARD_TYPES],
          tdFieldName.textContent,
        );

        this.#updateFieldNameSelect(select, fieldDetail);
        select.addEventListener("change", () => {
          this.#hasEverEdited = true;
          this.#updateFieldNameSelect(select, fieldDetail);
        });

        tdFieldName.innerHTML = "";
        tdFieldName.appendChild(select);
      }
    });

    event.target.classList.toggle("editing");
  }

  onFilterFields() {
    this.#updateFieldsInfo(this.#inspectedFieldDetails);
  }

  onAddOrRemoveTestRecord() {
    sendMessage("set-test-records", {
      address: document.getElementById("autofill-add-address-button").checked,
      creditcard: document.getElementById("autofill-add-credit-card-button")
        .checked,
    });
  }

  /**
   * Private Functions
   */
  async #captureInspectorPanel() {
    // TODO: Can we move this to the background script?
    // Use html2Canvas to screenshot
    const element = document.querySelector(".autofill-panel");
    const width = element.scrollWidth;
    const height =
      document.querySelector(".devtools-toolbar").scrollHeight +
      document.querySelector(".field-list-scroll").scrollHeight;

    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
      x: 0,
      y: 0,
      width,
      height,
      windowHeight: height,
    });

    return canvas.toDataURL("image/png");
  }

  #updateProgress(progressText) {
    const element = document.querySelector(".autofill-progress-status");
    element.textContent = progressText;
  }

  #fieldDetailToColumnValue(columnId, fieldDetail) {
    const regex = /^col-(.*)$/;
    const fieldName = columnId.match(regex)[1];
    return fieldDetail[fieldName];
  }

  #scrollIntoView(fieldDetail) {
    sendMessage("scroll-to", { fieldDetail });
  }

  #addHighlightOverlay(type, fieldDetails) {
    sendMessage("highlight", { type, fieldDetails });
  }

  // Type should be either `select` or `hover`
  #removeHighlightOverlay(type, fieldDetails) {
    sendMessage("remove-highlight", { type, fieldDetails });
  }

  #createRowFromFieldDetail(fieldDetail) {
    const tr = document.createElement("tr");
    tr.classList.add("field-list-item");
    if (!fieldDetail.isVisible) {
      tr.classList.add("invisible");
    }
    if (!fieldDetail.fieldName) {
      tr.classList.add("unknown");
    }

    // Setup the mouse over handler for this row
    this.#rowToFieldDetail.set(tr, fieldDetail);
    this.#setupRowMouseOver(tr, fieldDetail);
    return tr;
  }

  #setupRowMouseOver(tr, fieldDetail) {
    tr.addEventListener("mouseover", (event) => {
      event.preventDefault();
      let rows;
      if (event.target.hasAttribute("rowspan")) {
        tr.classList.add("className", "autofill-hide-highlight");
        rows = getSpannedRows(event.target);
      } else {
        rows = [tr];
      }

      this.#scrollIntoView(fieldDetail);
      this.#addHighlightOverlay(
        "hover",
        rows.map((r) => this.#rowToFieldDetail.get(r)),
      );
    });

    tr.addEventListener("mouseout", (event) => {
      event.preventDefault();
      let rows;
      if (event.target.hasAttribute("rowspan")) {
        tr.classList.remove("className", "autofill-hide-highlight");
        rows = getSpannedRows(event.target);
      } else {
        rows = [tr];
      }

      this.#removeHighlightOverlay(
        "hover",
        rows.map((r) => this.#rowToFieldDetail.get(r)),
      );
    });
  }

  #getDisplayedFields(fieldDetails) {
    const showInvisible = document.getElementById(
      "autofill-show-invisible-button",
    ).checked;
    const showUnknown = document.getElementById(
      "autofill-show-unknown-button",
    ).checked;
    return fieldDetails.filter((fieldDetail) => {
      if (!fieldDetail.isVisible && !showInvisible) {
        return false;
      }
      if (!fieldDetail.fieldName && !showUnknown) {
        return false;
      }
      return true;
    });
  }

  /**
   * Update the inpsected result table
   *
   * @param <Array> fieldDetails
   *        The inspected result
   */
  #updateFieldsInfo(fieldDetails) {
    // Clear the previous result before updating.
    this.#rowToFieldDetail.clear();
    const tbody = document.getElementById("form-analysis-table-body");
    while (tbody.firstChild) {
      tbody.firstChild.remove();
    }

    const columns = document.getElementById(
      "form-analysis-head-row",
    ).childNodes;

    // Use row span for fields that belong to the same form, section, or frame
    // We need to calculate the span count for each case.
    let formSpanBoundary;
    let sectionSpanBoundary;
    let frameSpanBoundary;

    let nthSection = -1;

    fieldDetails = this.#getDisplayedFields(fieldDetails);
    fieldDetails.forEach((fieldDetail, index) => {
      const tr = this.#createRowFromFieldDetail(fieldDetail);

      for (const column of columns) {
        if (!column.id) {
          continue;
        }
        const td = document.createElement("td");
        td.id = column.id;
        td.className = "field-list-column";

        // Handle Columns that might span rows.
        if (column.id == "col-form") {
          if (formSpanBoundary && index < formSpanBoundary) {
            continue;
          }
          formSpanBoundary = findNextIndex(
            fieldDetails,
            index,
            fieldDetails.length,
            (compare) => fieldDetail.formIndex != compare.formIndex,
          );
          td.rowSpan = formSpanBoundary - index;
        } else if (column.id == "col-section") {
          if (sectionSpanBoundary && index < sectionSpanBoundary) {
            continue;
          }
          sectionSpanBoundary = findNextIndex(
            fieldDetails,
            index,
            formSpanBoundary,
            (compare) => fieldDetail.sectionIndex != compare.sectionIndex,
          );
          td.rowSpan = sectionSpanBoundary - index;
          nthSection++;
        } else if (column.id == "col-frame") {
          if (frameSpanBoundary && index < frameSpanBoundary) {
            continue;
          }
          frameSpanBoundary = findNextIndex(
            fieldDetails,
            index,
            sectionSpanBoundary,
            (compare) =>
              fieldDetail.browsingContextId != compare.browsingContextId,
          );
          td.rowSpan = frameSpanBoundary - index;
        } else {
          // For non-spanned rows, changes its style when the field is invisible
          if (!fieldDetail.isVisible) {
            td.classList.add("autofill-invisible-field");
          }
          if (nthSection % 2) {
            tr.classList.add("autofill-section-even");
          }
        }

        // Set Style.
        if (column.id == "col-section") {
          fieldDetail.fieldName.startsWith("cc-")
            ? td.classList.add("field-credit-card-icon")
            : td.classList.add("field-address-icon");
        } else if (column.id == "col-fieldName") {
          // Show different style for fields that we have edited its field name manually.
          this.#originFieldNameByInspectId.get(fieldDetail.inspectId) !=
          fieldDetail.fieldName
            ? td.classList.add("changed")
            : td.classList.remove("changed");
        }

        // Set Text for non-icon fields.
        if (!["col-form", "col-section"].includes(column.id)) {
          const text = this.#fieldDetailToColumnValue(column.id, fieldDetail);
          td.appendChild(document.createTextNode(text));
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".field-list-table tr").forEach((tr) => {
      tr.addEventListener("click", (event) => {
        const rows = event.target.hasAttribute("rowspan")
          ? getSpannedRows(event.target)
          : [tr];

        let remove = [];
        let add = [];
        for (const row of rows) {
          row.classList.contains("selected")
            ? remove.push(this.#rowToFieldDetail.get(row))
            : add.push(this.#rowToFieldDetail.get(row));
          row.classList.toggle("selected");
        }
        this.#removeHighlightOverlay("select", remove);
        this.#addHighlightOverlay("select", add);
      });
    });
  }

  #createSelectAndOptions(options, defaultValue) {
    const select = document.createElement("select");
    select.addEventListener("click", (event) => event.stopPropagation());

    options.forEach((option) => {
      const element = document.createElement("option");
      element.value = option;
      element.textContent = option;
      if (defaultValue === option) {
        // Move the matched <select> to the first one
        select.insertBefore(element, select.firstChild);
        element.selected = true;
      } else {
        select.appendChild(element);
      }
    });
    return select;
  }

  #updateFieldNameSelect(element, fieldDetail) {
    const originFieldName = this.#originFieldNameByInspectId.get(
      fieldDetail.inspectId,
    );

    if (element.value != originFieldName) {
      this.#updateFieldDetailByInspectId.set(fieldDetail.inspectId, {
        inspectId: fieldDetail.inspectId,
        fieldName: element.value,
      });
      element.classList.add("changed");
    } else {
      this.#updateFieldDetailByInspectId.delete(fieldDetail.inspectId);
      element.classList.remove("changed");
    }
  }
}

new AutofillInspector();
