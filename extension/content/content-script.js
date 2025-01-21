/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

browser.runtime.onMessage.addListener((data) => {
  if (data.message == "content-freeze-page") {
    const url = browser.runtime.getURL("libs/freeze-dry.es.js");

    // eslint-disable-next-line no-unsanitized/method
    import(url).then(async (module) => {
      const html = await module.freezeDry(document, {});
      const msg = "content-freeze-complete";
      browser.runtime.sendMessage({ msg, html });
    });
  }
});
