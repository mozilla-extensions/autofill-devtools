/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* global ExtensionAPI */

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  WebNavigationFrames: "resource://gre/modules/WebNavigationFrames.sys.mjs",
});

function getActorByTabId(tabId, tabManager) {
  const { browser } = tabManager.get(tabId);
  const windowGlobal = browser.browsingContext.currentWindowGlobal;
  return windowGlobal?.getActor("FormAutofill");
}

this.autofill = class extends ExtensionAPI {
  getAPI(context) {
    const { tabManager } = context.extension;

    return {
      experiments: {
        autofill: {
          /*
           * Implement 'captureTab' webextension API because manifest v3 doesn't
           * support it anymore.
           *
           * @param {integer} tabId
           *        The ID of the tab to take the screenshot
           * @param {integer} x
           *        The coordinate of the left side of the rectangle to capture.
           * @param {integer} y
           *        The coordinate of the top side of the rectangle to capture.
           * @param {integer} width
           *        The width of the rectangle to capture.
           * @param {integer} height
           *        The height of the rectangle to capture.
           */
          async captureTab(tabId, x, y, width, height) {
            // Copied from
            // https://searchfox.org/mozilla-central/rev/4e69784010d271c0fce0927442e4f8e66ffe645b/toolkit/components/extensions/parent/ext-tabs-base.js#112
            const { browser } = tabManager.get(tabId);

            const zoom = browser.browsingContext.fullZoom;
            const scale =
              browser.browsingContext.topChromeWindow.devicePixelRatio || 1;
            const rect = new context.xulBrowser.ownerGlobal.window.DOMRect(
              x,
              y,
              width,
              height,
            );

            const wgp = browser.browsingContext.currentWindowGlobal;
            const image = await wgp.drawSnapshot(rect, scale * zoom, "white");

            const canvas = new OffscreenCanvas(image.width, image.height);

            const ctx = canvas.getContext("bitmaprenderer", { alpha: false });
            ctx.transferFromImageBitmap(image);

            const blob = await canvas.convertToBlob({
              type: `image/png`,
            });

            const dataURL = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(blob);
            });
            return dataURL;
          },

          /*
           * Inspect the autofill fields of the target tab.
           *
           * @param {integer} tabId
           *        The ID of the tab to inspect.
           * @param {object} overwriteFields
           *        TODO: Explain it: The changes made by the inspector.
           * @return {Array<FieldDetail>}
           *        The array of FieldDetail object of all the inspected fields.
           */
          async inspect(tabId, overwriteFields) {
            const actor = getActorByTabId(tabId, tabManager);
            if (!actor) {
              return [];
            }

            const forms = await actor.inspectFields(overwriteFields);

            const fieldDetails = [];
            const bcs = actor.browsingContext.getAllBrowsingContextsInSubtree();
            for (const form of forms) {
              const formIndex = forms.indexOf(form);
              for (const section of form) {
                const sectionIndex = form.indexOf(section);
                section.fieldDetails.forEach(
                  (fd) => (fd.formIndex = formIndex),
                );
                section.fieldDetails.forEach(
                  (fd) => (fd.sectionIndex = sectionIndex),
                );

                for (const fieldDetail of section.fieldDetails) {
                  const bc = bcs.find(
                    (b) => b.id == fieldDetail.browsingContextId,
                  );
                  const host = bc.currentWindowGlobal.documentPrincipal.host;

                  fieldDetail.frameId = lazy.WebNavigationFrames.getFrameId(bc);

                  if (!bc || bc == bc.top) {
                    // main-frame
                    fieldDetail.frame = `(M) ${host}`;
                  } else if (
                    bc.currentWindowGlobal.documentPrincipal.equals(
                      bc.top.currentWindowGlobal.documentPrincipal,
                    )
                  ) {
                    // same-origin iframe
                    fieldDetail.frame = `(S) ${host}`;
                  } else {
                    // cross-origin iframe
                    fieldDetail.frame = `(C) ${host}`;
                  }
                }
                fieldDetails.push(...section.fieldDetails);
              }
            }

            return fieldDetails;
          },

          /*
           * Set test address and credit card reocrd for the specified tab.
           *
           * @param {integer} tabId
           *        The ID of the tab to use test records.
           * @param {Array<Object>} records
           *        An array of test address and/or credit card records
           */
          async setTemporaryRecordsForTab(tabId, records) {
            const actor = getActorByTabId(tabId, tabManager);
            if (!actor) {
              return;
            }

            await actor.setTemporaryRecordsForTab(records);
          },
        },
      },
    };
  }
};
