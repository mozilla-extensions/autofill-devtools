/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

import freezeDry from "freeze-dry";

browser.runtime.onMessage.addListener(async (data) => {
  if (data.message == "content-freeze-page") {
    const html = await freezeDry(document, {});
    const msg = "content-freeze-complete";
    browser.runtime.sendMessage({ msg, html });
  }
});
