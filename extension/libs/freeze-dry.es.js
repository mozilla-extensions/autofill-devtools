var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function doctypeToString(doctype) {
  if (doctype === null) {
    return "";
  }
  if (!doctype || doctype.nodeType !== doctype.DOCUMENT_TYPE_NODE || typeof doctype.name !== "string" || typeof doctype.publicId !== "string" || typeof doctype.systemId !== "string") {
    throw new TypeError("Expected a DocumentType");
  }
  const doctypeString = `<!DOCTYPE ${doctype.name}` + (doctype.publicId ? ` PUBLIC "${doctype.publicId}"` : "") + (doctype.systemId ? (doctype.publicId ? `` : ` SYSTEM`) + ` "${doctype.systemId}"` : ``) + `>`;
  return doctypeString;
}
function documentOuterHTML(document2) {
  if (!document2 || document2.nodeType === void 0 || document2.nodeType !== document2.DOCUMENT_NODE) {
    throw new TypeError("Expected a Document");
  }
  const html = [...document2.childNodes].map((node) => nodeToString(node)).join("\n");
  return html;
}
function nodeToString(node) {
  switch (node.nodeType) {
    case node.ELEMENT_NODE:
      return node.outerHTML;
    case node.TEXT_NODE:
      return node.textContent;
    case node.COMMENT_NODE:
      return `<!--${node.textContent}-->`;
    case node.DOCUMENT_TYPE_NODE:
      return doctypeToString(node);
    default:
      throw new TypeError(`Unexpected node type: ${node.nodeType}`);
  }
}
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var a = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var domnodeAtPath = nodeAt;
function nodeAt(path, rootNode) {
  if (!rootNode)
    return;
  if (path.length == 0) {
    return rootNode;
  }
  var firstIndex = path[0];
  var curNode = rootNode.childNodes[firstIndex];
  return nodeAt(path.slice(1), curNode);
}
var lib$1 = { exports: {} };
(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  exports.default = flatOptions2;
  function flatOptions2(options, defaults) {
    var result2 = Object.assign({}, defaults);
    if (options && (typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
      Object.keys(options).forEach(function(key) {
        return validateOption(key, defaults) && copyOption(key, options, result2);
      });
    }
    return result2;
  }
  function copyOption(key, from, to) {
    if (from[key] !== void 0) {
      to[key] = from[key];
    }
  }
  function validateOption(key, defaults) {
    if (defaults && !Object.hasOwnProperty.call(defaults, key)) {
      throw new Error("Unknown option: " + key);
    }
    return true;
  }
  module.exports = exports["default"];
})(lib$1, lib$1.exports);
var flatOptions = /* @__PURE__ */ getDefaultExportFromCjs(lib$1.exports);
var safeIsNaN = Number.isNaN || function ponyfill(value2) {
  return typeof value2 === "number" && value2 !== value2;
};
function isEqual(first, second) {
  if (first === second) {
    return true;
  }
  if (safeIsNaN(first) && safeIsNaN(second)) {
    return true;
  }
  return false;
}
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (var i = 0; i < newInputs.length; i++) {
    if (!isEqual(newInputs[i], lastInputs[i])) {
      return false;
    }
  }
  return true;
}
function memoizeOne(resultFn, isEqual2) {
  if (isEqual2 === void 0) {
    isEqual2 = areInputsEqual;
  }
  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;
  function memoized() {
    var newArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }
    if (calledOnce && lastThis === this && isEqual2(newArgs, lastArgs)) {
      return lastResult;
    }
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }
  return memoized;
}
function isPrimitive(value2) {
  return typeof value2 !== "object" && typeof value2 !== "function" || value2 === null;
}
function MapTree() {
  this.childBranches = /* @__PURE__ */ new WeakMap();
  this.primitiveKeys = /* @__PURE__ */ new Map();
  this.hasValue = false;
  this.value = void 0;
}
MapTree.prototype.has = function has(key) {
  var keyObject = isPrimitive(key) ? this.primitiveKeys.get(key) : key;
  return keyObject ? this.childBranches.has(keyObject) : false;
};
MapTree.prototype.get = function get(key) {
  var keyObject = isPrimitive(key) ? this.primitiveKeys.get(key) : key;
  return keyObject ? this.childBranches.get(keyObject) : void 0;
};
MapTree.prototype.resolveBranch = function resolveBranch(key) {
  if (this.has(key)) {
    return this.get(key);
  }
  var newBranch = new MapTree();
  var keyObject = this.createKey(key);
  this.childBranches.set(keyObject, newBranch);
  return newBranch;
};
MapTree.prototype.setValue = function setValue(value2) {
  this.hasValue = true;
  return this.value = value2;
};
MapTree.prototype.createKey = function createKey(key) {
  if (isPrimitive(key)) {
    var keyObject = {};
    this.primitiveKeys.set(key, keyObject);
    return keyObject;
  }
  return key;
};
MapTree.prototype.clear = function clear() {
  if (arguments.length === 0) {
    this.childBranches = /* @__PURE__ */ new WeakMap();
    this.primitiveKeys.clear();
    this.hasValue = false;
    this.value = void 0;
  } else if (arguments.length === 1) {
    var key = arguments[0];
    if (isPrimitive(key)) {
      var keyObject = this.primitiveKeys.get(key);
      if (keyObject) {
        this.childBranches.delete(keyObject);
        this.primitiveKeys.delete(key);
      }
    } else {
      this.childBranches.delete(key);
    }
  } else {
    var childKey = arguments[0];
    if (this.has(childKey)) {
      var childBranch = this.get(childKey);
      childBranch.clear.apply(childBranch, Array.prototype.slice.call(arguments, 1));
    }
  }
};
var memoize = function memoize2(fn) {
  var argsTree = new MapTree();
  function memoized() {
    var args = Array.prototype.slice.call(arguments);
    var argNode = args.reduce(function getBranch(parentBranch, arg) {
      return parentBranch.resolveBranch(arg);
    }, argsTree);
    if (argNode.hasValue) {
      return argNode.value;
    }
    var value2 = fn.apply(null, args);
    return argNode.setValue(value2);
  }
  memoized.clear = argsTree.clear.bind(argsTree);
  return memoized;
};
var memoizeWeak = memoize;
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var build = function mutableProxyFactory(defaultTarget) {
  var mutableHandler = void 0;
  var mutableTarget = void 0;
  function setTarget(target) {
    if (!(target instanceof Object)) {
      throw new Error('Target "' + target + '" is not an object');
    }
    mutableTarget = target;
  }
  function setHandler(handler2) {
    Object.keys(handler2).forEach(function(key) {
      var value2 = handler2[key];
      if (typeof value2 !== "function") {
        throw new Error('Trap "' + key + ": " + value2 + '" is not a function');
      }
      if (!Reflect[key]) {
        throw new Error('Trap "' + key + ": " + value2 + '" is not a valid trap');
      }
    });
    mutableHandler = handler2;
  }
  setTarget(function() {
  });
  if (defaultTarget) {
    setTarget(defaultTarget);
  }
  setHandler(Reflect);
  var handler = new Proxy({}, {
    get: function get2(target, property) {
      return function() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return mutableHandler[property].apply(null, [mutableTarget].concat(_toConsumableArray(args.slice(1))));
      };
    }
  });
  return {
    setTarget,
    setHandler,
    getTarget: function getTarget() {
      return mutableTarget;
    },
    getHandler: function getHandler() {
      return mutableHandler;
    },
    proxy: new Proxy(mutableTarget, handler)
  };
};
var pathToDomnode = function pathTo(node, root2) {
  if (!root2)
    throw new Error("No root node specified.");
  if (node === root2)
    return [];
  if (!root2.contains(node)) {
    throw new Error("Cannot determine path. Node is not a descendant of root node.");
  }
  var myIndex = 0, n = node;
  while (n.previousSibling) {
    n = n.previousSibling;
    myIndex++;
  }
  var parentPath = pathTo(node.parentNode, root2);
  parentPath.push(myIndex);
  return parentPath;
};
var picocolors_browser = { exports: {} };
var x = String;
var create = function() {
  return { isColorSupported: false, reset: x, bold: x, dim: x, italic: x, underline: x, inverse: x, hidden: x, strikethrough: x, black: x, red: x, green: x, yellow: x, blue: x, magenta: x, cyan: x, white: x, gray: x, bgBlack: x, bgRed: x, bgGreen: x, bgYellow: x, bgBlue: x, bgMagenta: x, bgCyan: x, bgWhite: x };
};
picocolors_browser.exports = create();
picocolors_browser.exports.createColors = create;
var __viteBrowserExternal = {};
var __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
let pico = picocolors_browser.exports;
let terminalHighlight$1 = require$$0;
class CssSyntaxError$3 extends Error {
  constructor(message, line, column, source, file, plugin2) {
    super(message);
    this.name = "CssSyntaxError";
    this.reason = message;
    if (file) {
      this.file = file;
    }
    if (source) {
      this.source = source;
    }
    if (plugin2) {
      this.plugin = plugin2;
    }
    if (typeof line !== "undefined" && typeof column !== "undefined") {
      if (typeof line === "number") {
        this.line = line;
        this.column = column;
      } else {
        this.line = line.line;
        this.column = line.column;
        this.endLine = column.line;
        this.endColumn = column.column;
      }
    }
    this.setMessage();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError$3);
    }
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "";
    this.message += this.file ? this.file : "<css input>";
    if (typeof this.line !== "undefined") {
      this.message += ":" + this.line + ":" + this.column;
    }
    this.message += ": " + this.reason;
  }
  showSourceCode(color) {
    if (!this.source)
      return "";
    let css = this.source;
    if (color == null)
      color = pico.isColorSupported;
    if (terminalHighlight$1) {
      if (color)
        css = terminalHighlight$1(css);
    }
    let lines = css.split(/\r?\n/);
    let start = Math.max(this.line - 3, 0);
    let end = Math.min(this.line + 2, lines.length);
    let maxWidth = String(end).length;
    let mark, aside;
    if (color) {
      let { bold, red, gray } = pico.createColors(true);
      mark = (text) => bold(red(text));
      aside = (text) => gray(text);
    } else {
      mark = aside = (str) => str;
    }
    return lines.slice(start, end).map((line, index) => {
      let number2 = start + 1 + index;
      let gutter = " " + (" " + number2).slice(-maxWidth) + " | ";
      if (number2 === this.line) {
        let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
        return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
      }
      return " " + aside(gutter) + line;
    }).join("\n");
  }
  toString() {
    let code = this.showSourceCode();
    if (code) {
      code = "\n\n" + code + "\n";
    }
    return this.name + ": " + this.message + code;
  }
}
var cssSyntaxError = CssSyntaxError$3;
CssSyntaxError$3.default = CssSyntaxError$3;
var symbols = {};
symbols.isClean = Symbol("isClean");
symbols.my = Symbol("my");
const DEFAULT_RAW = {
  colon: ": ",
  indent: "    ",
  beforeDecl: "\n",
  beforeRule: "\n",
  beforeOpen: " ",
  beforeClose: "\n",
  beforeComment: "\n",
  after: "\n",
  emptyBody: "",
  commentLeft: " ",
  commentRight: " ",
  semicolon: false
};
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
class Stringifier$2 {
  constructor(builder) {
    this.builder = builder;
  }
  stringify(node, semicolon) {
    if (!this[node.type]) {
      throw new Error("Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier.");
    }
    this[node.type](node, semicolon);
  }
  document(node) {
    this.body(node);
  }
  root(node) {
    this.body(node);
    if (node.raws.after)
      this.builder(node.raws.after);
  }
  comment(node) {
    let left = this.raw(node, "left", "commentLeft");
    let right = this.raw(node, "right", "commentRight");
    this.builder("/*" + left + node.text + right + "*/", node);
  }
  decl(node, semicolon) {
    let between = this.raw(node, "between", "colon");
    let string2 = node.prop + between + this.rawValue(node, "value");
    if (node.important) {
      string2 += node.raws.important || " !important";
    }
    if (semicolon)
      string2 += ";";
    this.builder(string2, node);
  }
  rule(node) {
    this.block(node, this.rawValue(node, "selector"));
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, "end");
    }
  }
  atrule(node, semicolon) {
    let name = "@" + node.name;
    let params = node.params ? this.rawValue(node, "params") : "";
    if (typeof node.raws.afterName !== "undefined") {
      name += node.raws.afterName;
    } else if (params) {
      name += " ";
    }
    if (node.nodes) {
      this.block(node, name + params);
    } else {
      let end = (node.raws.between || "") + (semicolon ? ";" : "");
      this.builder(name + params + end, node);
    }
  }
  body(node) {
    let last = node.nodes.length - 1;
    while (last > 0) {
      if (node.nodes[last].type !== "comment")
        break;
      last -= 1;
    }
    let semicolon = this.raw(node, "semicolon");
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];
      let before = this.raw(child, "before");
      if (before)
        this.builder(before);
      this.stringify(child, last !== i || semicolon);
    }
  }
  block(node, start) {
    let between = this.raw(node, "between", "beforeOpen");
    this.builder(start + between + "{", node, "start");
    let after;
    if (node.nodes && node.nodes.length) {
      this.body(node);
      after = this.raw(node, "after");
    } else {
      after = this.raw(node, "after", "emptyBody");
    }
    if (after)
      this.builder(after);
    this.builder("}", node, "end");
  }
  raw(node, own, detect) {
    let value2;
    if (!detect)
      detect = own;
    if (own) {
      value2 = node.raws[own];
      if (typeof value2 !== "undefined")
        return value2;
    }
    let parent = node.parent;
    if (detect === "before") {
      if (!parent || parent.type === "root" && parent.first === node) {
        return "";
      }
      if (parent && parent.type === "document") {
        return "";
      }
    }
    if (!parent)
      return DEFAULT_RAW[detect];
    let root2 = node.root();
    if (!root2.rawCache)
      root2.rawCache = {};
    if (typeof root2.rawCache[detect] !== "undefined") {
      return root2.rawCache[detect];
    }
    if (detect === "before" || detect === "after") {
      return this.beforeAfter(node, detect);
    } else {
      let method = "raw" + capitalize(detect);
      if (this[method]) {
        value2 = this[method](root2, node);
      } else {
        root2.walk((i) => {
          value2 = i.raws[own];
          if (typeof value2 !== "undefined")
            return false;
        });
      }
    }
    if (typeof value2 === "undefined")
      value2 = DEFAULT_RAW[detect];
    root2.rawCache[detect] = value2;
    return value2;
  }
  rawSemicolon(root2) {
    let value2;
    root2.walk((i) => {
      if (i.nodes && i.nodes.length && i.last.type === "decl") {
        value2 = i.raws.semicolon;
        if (typeof value2 !== "undefined")
          return false;
      }
    });
    return value2;
  }
  rawEmptyBody(root2) {
    let value2;
    root2.walk((i) => {
      if (i.nodes && i.nodes.length === 0) {
        value2 = i.raws.after;
        if (typeof value2 !== "undefined")
          return false;
      }
    });
    return value2;
  }
  rawIndent(root2) {
    if (root2.raws.indent)
      return root2.raws.indent;
    let value2;
    root2.walk((i) => {
      let p = i.parent;
      if (p && p !== root2 && p.parent && p.parent === root2) {
        if (typeof i.raws.before !== "undefined") {
          let parts = i.raws.before.split("\n");
          value2 = parts[parts.length - 1];
          value2 = value2.replace(/\S/g, "");
          return false;
        }
      }
    });
    return value2;
  }
  rawBeforeComment(root2, node) {
    let value2;
    root2.walkComments((i) => {
      if (typeof i.raws.before !== "undefined") {
        value2 = i.raws.before;
        if (value2.includes("\n")) {
          value2 = value2.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value2 === "undefined") {
      value2 = this.raw(node, null, "beforeDecl");
    } else if (value2) {
      value2 = value2.replace(/\S/g, "");
    }
    return value2;
  }
  rawBeforeDecl(root2, node) {
    let value2;
    root2.walkDecls((i) => {
      if (typeof i.raws.before !== "undefined") {
        value2 = i.raws.before;
        if (value2.includes("\n")) {
          value2 = value2.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value2 === "undefined") {
      value2 = this.raw(node, null, "beforeRule");
    } else if (value2) {
      value2 = value2.replace(/\S/g, "");
    }
    return value2;
  }
  rawBeforeRule(root2) {
    let value2;
    root2.walk((i) => {
      if (i.nodes && (i.parent !== root2 || root2.first !== i)) {
        if (typeof i.raws.before !== "undefined") {
          value2 = i.raws.before;
          if (value2.includes("\n")) {
            value2 = value2.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value2)
      value2 = value2.replace(/\S/g, "");
    return value2;
  }
  rawBeforeClose(root2) {
    let value2;
    root2.walk((i) => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== "undefined") {
          value2 = i.raws.after;
          if (value2.includes("\n")) {
            value2 = value2.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value2)
      value2 = value2.replace(/\S/g, "");
    return value2;
  }
  rawBeforeOpen(root2) {
    let value2;
    root2.walk((i) => {
      if (i.type !== "decl") {
        value2 = i.raws.between;
        if (typeof value2 !== "undefined")
          return false;
      }
    });
    return value2;
  }
  rawColon(root2) {
    let value2;
    root2.walkDecls((i) => {
      if (typeof i.raws.between !== "undefined") {
        value2 = i.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value2;
  }
  beforeAfter(node, detect) {
    let value2;
    if (node.type === "decl") {
      value2 = this.raw(node, null, "beforeDecl");
    } else if (node.type === "comment") {
      value2 = this.raw(node, null, "beforeComment");
    } else if (detect === "before") {
      value2 = this.raw(node, null, "beforeRule");
    } else {
      value2 = this.raw(node, null, "beforeClose");
    }
    let buf = node.parent;
    let depth = 0;
    while (buf && buf.type !== "root") {
      depth += 1;
      buf = buf.parent;
    }
    if (value2.includes("\n")) {
      let indent = this.raw(node, null, "indent");
      if (indent.length) {
        for (let step = 0; step < depth; step++)
          value2 += indent;
      }
    }
    return value2;
  }
  rawValue(node, prop) {
    let value2 = node[prop];
    let raw = node.raws[prop];
    if (raw && raw.value === value2) {
      return raw.raw;
    }
    return value2;
  }
}
var stringifier = Stringifier$2;
Stringifier$2.default = Stringifier$2;
let Stringifier$1 = stringifier;
function stringify$4(node, builder) {
  let str = new Stringifier$1(builder);
  str.stringify(node);
}
var stringify_1 = stringify$4;
stringify$4.default = stringify$4;
let { isClean: isClean$2, my: my$2 } = symbols;
let CssSyntaxError$2 = cssSyntaxError;
let Stringifier = stringifier;
let stringify$3 = stringify_1;
function cloneNode$1(obj, parent) {
  let cloned = new obj.constructor();
  for (let i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      continue;
    }
    if (i === "proxyCache")
      continue;
    let value2 = obj[i];
    let type = typeof value2;
    if (i === "parent" && type === "object") {
      if (parent)
        cloned[i] = parent;
    } else if (i === "source") {
      cloned[i] = value2;
    } else if (Array.isArray(value2)) {
      cloned[i] = value2.map((j) => cloneNode$1(j, cloned));
    } else {
      if (type === "object" && value2 !== null)
        value2 = cloneNode$1(value2);
      cloned[i] = value2;
    }
  }
  return cloned;
}
class Node$e {
  constructor(defaults = {}) {
    this.raws = {};
    this[isClean$2] = false;
    this[my$2] = true;
    for (let name in defaults) {
      if (name === "nodes") {
        this.nodes = [];
        for (let node of defaults[name]) {
          if (typeof node.clone === "function") {
            this.append(node.clone());
          } else {
            this.append(node);
          }
        }
      } else {
        this[name] = defaults[name];
      }
    }
  }
  error(message, opts = {}) {
    if (this.source) {
      let { start, end } = this.rangeBy(opts);
      return this.source.input.error(message, { line: start.line, column: start.column }, { line: end.line, column: end.column }, opts);
    }
    return new CssSyntaxError$2(message);
  }
  warn(result2, text, opts) {
    let data = { node: this };
    for (let i in opts)
      data[i] = opts[i];
    return result2.warn(text, data);
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  toString(stringifier2 = stringify$3) {
    if (stringifier2.stringify)
      stringifier2 = stringifier2.stringify;
    let result2 = "";
    stringifier2(this, (i) => {
      result2 += i;
    });
    return result2;
  }
  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name];
    }
    return this;
  }
  clone(overrides = {}) {
    let cloned = cloneNode$1(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  }
  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  }
  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this;
      let foundSelf = false;
      for (let node of nodes) {
        if (node === this) {
          foundSelf = true;
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node);
          bookmark = node;
        } else {
          this.parent.insertBefore(bookmark, node);
        }
      }
      if (!foundSelf) {
        this.remove();
      }
    }
    return this;
  }
  next() {
    if (!this.parent)
      return void 0;
    let index = this.parent.index(this);
    return this.parent.nodes[index + 1];
  }
  prev() {
    if (!this.parent)
      return void 0;
    let index = this.parent.index(this);
    return this.parent.nodes[index - 1];
  }
  before(add) {
    this.parent.insertBefore(this, add);
    return this;
  }
  after(add) {
    this.parent.insertAfter(this, add);
    return this;
  }
  root() {
    let result2 = this;
    while (result2.parent && result2.parent.type !== "document") {
      result2 = result2.parent;
    }
    return result2;
  }
  raw(prop, defaultType) {
    let str = new Stringifier();
    return str.raw(this, prop, defaultType);
  }
  cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween)
      delete this.raws.between;
  }
  toJSON(_, inputs) {
    let fixed = {};
    let emitInputs = inputs == null;
    inputs = inputs || /* @__PURE__ */ new Map();
    let inputsNextIndex = 0;
    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        continue;
      }
      if (name === "parent" || name === "proxyCache")
        continue;
      let value2 = this[name];
      if (Array.isArray(value2)) {
        fixed[name] = value2.map((i) => {
          if (typeof i === "object" && i.toJSON) {
            return i.toJSON(null, inputs);
          } else {
            return i;
          }
        });
      } else if (typeof value2 === "object" && value2.toJSON) {
        fixed[name] = value2.toJSON(null, inputs);
      } else if (name === "source") {
        let inputId = inputs.get(value2.input);
        if (inputId == null) {
          inputId = inputsNextIndex;
          inputs.set(value2.input, inputsNextIndex);
          inputsNextIndex++;
        }
        fixed[name] = {
          inputId,
          start: value2.start,
          end: value2.end
        };
      } else {
        fixed[name] = value2;
      }
    }
    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map((input2) => input2.toJSON());
    }
    return fixed;
  }
  positionInside(index) {
    let string2 = this.toString();
    let column = this.source.start.column;
    let line = this.source.start.line;
    for (let i = 0; i < index; i++) {
      if (string2[i] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return { line, column };
  }
  positionBy(opts) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      let index = this.toString().indexOf(opts.word);
      if (index !== -1)
        pos = this.positionInside(index);
    }
    return pos;
  }
  rangeBy(opts) {
    let start = {
      line: this.source.start.line,
      column: this.source.start.column
    };
    let end = this.source.end ? {
      line: this.source.end.line,
      column: this.source.end.column + 1
    } : {
      line: start.line,
      column: start.column + 1
    };
    if (opts.word) {
      let index = this.toString().indexOf(opts.word);
      if (index !== -1) {
        start = this.positionInside(index);
        end = this.positionInside(index + opts.word.length);
      }
    } else {
      if (opts.start) {
        start = {
          line: opts.start.line,
          column: opts.start.column
        };
      } else if (opts.index) {
        start = this.positionInside(opts.index);
      }
      if (opts.end) {
        end = {
          line: opts.end.line,
          column: opts.end.column
        };
      } else if (opts.endIndex) {
        end = this.positionInside(opts.endIndex);
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1);
      }
    }
    if (end.line < start.line || end.line === start.line && end.column <= start.column) {
      end = { line: start.line, column: start.column + 1 };
    }
    return { start, end };
  }
  getProxyProcessor() {
    return {
      set(node, prop, value2) {
        if (node[prop] === value2)
          return true;
        node[prop] = value2;
        if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || prop === "text") {
          node.markDirty();
        }
        return true;
      },
      get(node, prop) {
        if (prop === "proxyOf") {
          return node;
        } else if (prop === "root") {
          return () => node.root().toProxy();
        } else {
          return node[prop];
        }
      }
    };
  }
  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor());
    }
    return this.proxyCache;
  }
  addToError(error) {
    error.postcssNode = this;
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s = this.source;
      error.stack = error.stack.replace(/\n\s{4}at /, `$&${s.input.from}:${s.start.line}:${s.start.column}$&`);
    }
    return error;
  }
  markDirty() {
    if (this[isClean$2]) {
      this[isClean$2] = false;
      let next = this;
      while (next = next.parent) {
        next[isClean$2] = false;
      }
    }
  }
  get proxyOf() {
    return this;
  }
}
var node_1$1 = Node$e;
Node$e.default = Node$e;
let Node$d = node_1$1;
class Declaration$4 extends Node$d {
  constructor(defaults) {
    if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
      defaults = __spreadProps(__spreadValues({}, defaults), { value: String(defaults.value) });
    }
    super(defaults);
    this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
}
var declaration = Declaration$4;
Declaration$4.default = Declaration$4;
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = "";
    let i = size;
    while (i--) {
      id += alphabet[Math.random() * alphabet.length | 0];
    }
    return id;
  };
};
let nanoid$1 = (size = 21) => {
  let id = "";
  let i = size;
  while (i--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
};
var nonSecure = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  nanoid: nanoid$1,
  customAlphabet
}, Symbol.toStringTag, { value: "Module" }));
var require$$3 = /* @__PURE__ */ getAugmentedNamespace(nonSecure);
let { SourceMapConsumer: SourceMapConsumer$2, SourceMapGenerator: SourceMapGenerator$2 } = require$$0;
let { existsSync, readFileSync } = require$$0;
let { dirname: dirname$1, join } = require$$0;
function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, "base64").toString();
  } else {
    return window.atob(str);
  }
}
class PreviousMap$2 {
  constructor(css, opts) {
    if (opts.map === false)
      return;
    this.loadAnnotation(css);
    this.inline = this.startWith(this.annotation, "data:");
    let prev = opts.map ? opts.map.prev : void 0;
    let text = this.loadMap(opts.from, prev);
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from;
    }
    if (this.mapFile)
      this.root = dirname$1(this.mapFile);
    if (text)
      this.text = text;
  }
  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer$2(this.text);
    }
    return this.consumerCache;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
  startWith(string2, start) {
    if (!string2)
      return false;
    return string2.substr(0, start.length) === start;
  }
  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  loadAnnotation(css) {
    let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
    if (!comments)
      return;
    let start = css.lastIndexOf(comments.pop());
    let end = css.indexOf("*/", start);
    if (start > -1 && end > -1) {
      this.annotation = this.getAnnotationURL(css.substring(start, end));
    }
  }
  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
    let baseUri = /^data:application\/json;base64,/;
    let charsetUri = /^data:application\/json;charset=utf-?8,/;
    let uri = /^data:application\/json,/;
    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length));
    }
    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length));
    }
    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + encoding);
  }
  loadFile(path) {
    this.root = dirname$1(path);
    if (existsSync(path)) {
      this.mapFile = path;
      return readFileSync(path, "utf-8").toString().trim();
    }
  }
  loadMap(file, prev) {
    if (prev === false)
      return false;
    if (prev) {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "function") {
        let prevPath = prev(file);
        if (prevPath) {
          let map = this.loadFile(prevPath);
          if (!map) {
            throw new Error("Unable to load previous source map: " + prevPath.toString());
          }
          return map;
        }
      } else if (prev instanceof SourceMapConsumer$2) {
        return SourceMapGenerator$2.fromSourceMap(prev).toString();
      } else if (prev instanceof SourceMapGenerator$2) {
        return prev.toString();
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev);
      } else {
        throw new Error("Unsupported previous source map format: " + prev.toString());
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation);
    } else if (this.annotation) {
      let map = this.annotation;
      if (file)
        map = join(dirname$1(file), map);
      return this.loadFile(map);
    }
  }
  isMap(map) {
    if (typeof map !== "object")
      return false;
    return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
  }
}
var previousMap = PreviousMap$2;
PreviousMap$2.default = PreviousMap$2;
let { SourceMapConsumer: SourceMapConsumer$1, SourceMapGenerator: SourceMapGenerator$1 } = require$$0;
let { fileURLToPath, pathToFileURL: pathToFileURL$1 } = require$$0;
let { resolve: resolve$2, isAbsolute } = require$$0;
let { nanoid } = require$$3;
let terminalHighlight = require$$0;
let CssSyntaxError$1 = cssSyntaxError;
let PreviousMap$1 = previousMap;
let fromOffsetCache = Symbol("fromOffsetCache");
let sourceMapAvailable$1 = Boolean(SourceMapConsumer$1 && SourceMapGenerator$1);
let pathAvailable$1 = Boolean(resolve$2 && isAbsolute);
class Input$4 {
  constructor(css, opts = {}) {
    if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
      throw new Error(`PostCSS received ${css} instead of CSS string`);
    }
    this.css = css.toString();
    if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
      this.hasBOM = true;
      this.css = this.css.slice(1);
    } else {
      this.hasBOM = false;
    }
    if (opts.from) {
      if (!pathAvailable$1 || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
        this.file = opts.from;
      } else {
        this.file = resolve$2(opts.from);
      }
    }
    if (pathAvailable$1 && sourceMapAvailable$1) {
      let map = new PreviousMap$1(this.css, opts);
      if (map.text) {
        this.map = map;
        let file = map.consumer().file;
        if (!this.file && file)
          this.file = this.mapResolve(file);
      }
    }
    if (!this.file) {
      this.id = "<input css " + nanoid(6) + ">";
    }
    if (this.map)
      this.map.file = this.from;
  }
  fromOffset(offset) {
    let lastLine, lineToIndex;
    if (!this[fromOffsetCache]) {
      let lines = this.css.split("\n");
      lineToIndex = new Array(lines.length);
      let prevIndex = 0;
      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex;
        prevIndex += lines[i].length + 1;
      }
      this[fromOffsetCache] = lineToIndex;
    } else {
      lineToIndex = this[fromOffsetCache];
    }
    lastLine = lineToIndex[lineToIndex.length - 1];
    let min = 0;
    if (offset >= lastLine) {
      min = lineToIndex.length - 1;
    } else {
      let max = lineToIndex.length - 2;
      let mid;
      while (min < max) {
        mid = min + (max - min >> 1);
        if (offset < lineToIndex[mid]) {
          max = mid - 1;
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1;
        } else {
          min = mid;
          break;
        }
      }
    }
    return {
      line: min + 1,
      col: offset - lineToIndex[min] + 1
    };
  }
  error(message, line, column, opts = {}) {
    let result2, endLine, endColumn;
    if (line && typeof line === "object") {
      let start = line;
      let end = column;
      if (typeof line.offset === "number") {
        let pos = this.fromOffset(start.offset);
        line = pos.line;
        column = pos.col;
      } else {
        line = start.line;
        column = start.column;
      }
      if (typeof end.offset === "number") {
        let pos = this.fromOffset(end.offset);
        endLine = pos.line;
        endColumn = pos.col;
      } else {
        endLine = end.line;
        endColumn = end.column;
      }
    } else if (!column) {
      let pos = this.fromOffset(line);
      line = pos.line;
      column = pos.col;
    }
    let origin = this.origin(line, column, endLine, endColumn);
    if (origin) {
      result2 = new CssSyntaxError$1(message, origin.endLine === void 0 ? origin.line : { line: origin.line, column: origin.column }, origin.endLine === void 0 ? origin.column : { line: origin.endLine, column: origin.endColumn }, origin.source, origin.file, opts.plugin);
    } else {
      result2 = new CssSyntaxError$1(message, endLine === void 0 ? line : { line, column }, endLine === void 0 ? column : { line: endLine, column: endColumn }, this.css, this.file, opts.plugin);
    }
    result2.input = { line, column, endLine, endColumn, source: this.css };
    if (this.file) {
      if (pathToFileURL$1) {
        result2.input.url = pathToFileURL$1(this.file).toString();
      }
      result2.input.file = this.file;
    }
    return result2;
  }
  origin(line, column, endLine, endColumn) {
    if (!this.map)
      return false;
    let consumer = this.map.consumer();
    let from = consumer.originalPositionFor({ line, column });
    if (!from.source)
      return false;
    let to;
    if (typeof endLine === "number") {
      to = consumer.originalPositionFor({ line: endLine, column: endColumn });
    }
    let fromUrl;
    if (isAbsolute(from.source)) {
      fromUrl = pathToFileURL$1(from.source);
    } else {
      fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL$1(this.map.mapFile));
    }
    let result2 = {
      url: fromUrl.toString(),
      line: from.line,
      column: from.column,
      endLine: to && to.line,
      endColumn: to && to.column
    };
    if (fromUrl.protocol === "file:") {
      if (fileURLToPath) {
        result2.file = fileURLToPath(fromUrl);
      } else {
        throw new Error(`file: protocol is not available in this PostCSS build`);
      }
    }
    let source = consumer.sourceContentFor(from.source);
    if (source)
      result2.source = source;
    return result2;
  }
  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file;
    }
    return resolve$2(this.map.consumer().sourceRoot || this.map.root || ".", file);
  }
  get from() {
    return this.file || this.id;
  }
  toJSON() {
    let json = {};
    for (let name of ["hasBOM", "css", "file", "id"]) {
      if (this[name] != null) {
        json[name] = this[name];
      }
    }
    if (this.map) {
      json.map = __spreadValues({}, this.map);
      if (json.map.consumerCache) {
        json.map.consumerCache = void 0;
      }
    }
    return json;
  }
}
var input = Input$4;
Input$4.default = Input$4;
if (terminalHighlight && terminalHighlight.registerInput) {
  terminalHighlight.registerInput(Input$4);
}
let { SourceMapConsumer, SourceMapGenerator } = require$$0;
let { dirname, resolve: resolve$1, relative, sep } = require$$0;
let { pathToFileURL } = require$$0;
let Input$3 = input;
let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
let pathAvailable = Boolean(dirname && resolve$1 && relative && sep);
class MapGenerator$2 {
  constructor(stringify2, root2, opts, cssString) {
    this.stringify = stringify2;
    this.mapOpts = opts.map || {};
    this.root = root2;
    this.opts = opts;
    this.css = cssString;
  }
  isMap() {
    if (typeof this.opts.map !== "undefined") {
      return !!this.opts.map;
    }
    return this.previous().length > 0;
  }
  previous() {
    if (!this.previousMaps) {
      this.previousMaps = [];
      if (this.root) {
        this.root.walk((node) => {
          if (node.source && node.source.input.map) {
            let map = node.source.input.map;
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map);
            }
          }
        });
      } else {
        let input2 = new Input$3(this.css, this.opts);
        if (input2.map)
          this.previousMaps.push(input2.map);
      }
    }
    return this.previousMaps;
  }
  isInline() {
    if (typeof this.mapOpts.inline !== "undefined") {
      return this.mapOpts.inline;
    }
    let annotation = this.mapOpts.annotation;
    if (typeof annotation !== "undefined" && annotation !== true) {
      return false;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.inline);
    }
    return true;
  }
  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== "undefined") {
      return this.mapOpts.sourcesContent;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.withContent());
    }
    return true;
  }
  clearAnnotation() {
    if (this.mapOpts.annotation === false)
      return;
    if (this.root) {
      let node;
      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
        node = this.root.nodes[i];
        if (node.type !== "comment")
          continue;
        if (node.text.indexOf("# sourceMappingURL=") === 0) {
          this.root.removeChild(i);
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, "");
    }
  }
  setSourcesContent() {
    let already = {};
    if (this.root) {
      this.root.walk((node) => {
        if (node.source) {
          let from = node.source.input.from;
          if (from && !already[from]) {
            already[from] = true;
            this.map.setSourceContent(this.toUrl(this.path(from)), node.source.input.css);
          }
        }
      });
    } else if (this.css) {
      let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
      this.map.setSourceContent(from, this.css);
    }
  }
  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file));
      let root2 = prev.root || dirname(prev.file);
      let map;
      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer(prev.text);
        if (map.sourcesContent) {
          map.sourcesContent = map.sourcesContent.map(() => null);
        }
      } else {
        map = prev.consumer();
      }
      this.map.applySourceMap(map, from, this.toUrl(this.path(root2)));
    }
  }
  isAnnotation() {
    if (this.isInline()) {
      return true;
    }
    if (typeof this.mapOpts.annotation !== "undefined") {
      return this.mapOpts.annotation;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.annotation);
    }
    return true;
  }
  toBase64(str) {
    if (Buffer) {
      return Buffer.from(str).toString("base64");
    } else {
      return window.btoa(unescape(encodeURIComponent(str)));
    }
  }
  addAnnotation() {
    let content;
    if (this.isInline()) {
      content = "data:application/json;base64," + this.toBase64(this.map.toString());
    } else if (typeof this.mapOpts.annotation === "string") {
      content = this.mapOpts.annotation;
    } else if (typeof this.mapOpts.annotation === "function") {
      content = this.mapOpts.annotation(this.opts.to, this.root);
    } else {
      content = this.outputFile() + ".map";
    }
    let eol = "\n";
    if (this.css.includes("\r\n"))
      eol = "\r\n";
    this.css += eol + "/*# sourceMappingURL=" + content + " */";
  }
  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to);
    } else if (this.opts.from) {
      return this.path(this.opts.from);
    } else {
      return "to.css";
    }
  }
  generateMap() {
    if (this.root) {
      this.generateString();
    } else if (this.previous().length === 1) {
      let prev = this.previous()[0].consumer();
      prev.file = this.outputFile();
      this.map = SourceMapGenerator.fromSourceMap(prev);
    } else {
      this.map = new SourceMapGenerator({ file: this.outputFile() });
      this.map.addMapping({
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>",
        generated: { line: 1, column: 0 },
        original: { line: 1, column: 0 }
      });
    }
    if (this.isSourcesContent())
      this.setSourcesContent();
    if (this.root && this.previous().length > 0)
      this.applyPrevMaps();
    if (this.isAnnotation())
      this.addAnnotation();
    if (this.isInline()) {
      return [this.css];
    } else {
      return [this.css, this.map];
    }
  }
  path(file) {
    if (file.indexOf("<") === 0)
      return file;
    if (/^\w+:\/\//.test(file))
      return file;
    if (this.mapOpts.absolute)
      return file;
    let from = this.opts.to ? dirname(this.opts.to) : ".";
    if (typeof this.mapOpts.annotation === "string") {
      from = dirname(resolve$1(from, this.mapOpts.annotation));
    }
    file = relative(from, file);
    return file;
  }
  toUrl(path) {
    if (sep === "\\") {
      path = path.replace(/\\/g, "/");
    }
    return encodeURI(path).replace(/[#?]/g, encodeURIComponent);
  }
  sourcePath(node) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from);
    } else if (this.mapOpts.absolute) {
      if (pathToFileURL) {
        return pathToFileURL(node.source.input.from).toString();
      } else {
        throw new Error("`map.absolute` option is not available in this PostCSS build");
      }
    } else {
      return this.toUrl(this.path(node.source.input.from));
    }
  }
  generateString() {
    this.css = "";
    this.map = new SourceMapGenerator({ file: this.outputFile() });
    let line = 1;
    let column = 1;
    let noSource = "<no source>";
    let mapping = {
      source: "",
      generated: { line: 0, column: 0 },
      original: { line: 0, column: 0 }
    };
    let lines, last;
    this.stringify(this.root, (str, node, type) => {
      this.css += str;
      if (node && type !== "end") {
        mapping.generated.line = line;
        mapping.generated.column = column - 1;
        if (node.source && node.source.start) {
          mapping.source = this.sourcePath(node);
          mapping.original.line = node.source.start.line;
          mapping.original.column = node.source.start.column - 1;
          this.map.addMapping(mapping);
        } else {
          mapping.source = noSource;
          mapping.original.line = 1;
          mapping.original.column = 0;
          this.map.addMapping(mapping);
        }
      }
      lines = str.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str.lastIndexOf("\n");
        column = str.length - last;
      } else {
        column += str.length;
      }
      if (node && type !== "start") {
        let p = node.parent || { raws: {} };
        if (node.type !== "decl" || node !== p.last || p.raws.semicolon) {
          if (node.source && node.source.end) {
            mapping.source = this.sourcePath(node);
            mapping.original.line = node.source.end.line;
            mapping.original.column = node.source.end.column - 1;
            mapping.generated.line = line;
            mapping.generated.column = column - 2;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            this.map.addMapping(mapping);
          }
        }
      }
    });
  }
  generate() {
    this.clearAnnotation();
    if (pathAvailable && sourceMapAvailable && this.isMap()) {
      return this.generateMap();
    } else {
      let result2 = "";
      this.stringify(this.root, (i) => {
        result2 += i;
      });
      return [result2];
    }
  }
}
var mapGenerator = MapGenerator$2;
let Node$c = node_1$1;
class Comment$7 extends Node$c {
  constructor(defaults) {
    super(defaults);
    this.type = "comment";
  }
}
var comment$1 = Comment$7;
Comment$7.default = Comment$7;
let { isClean: isClean$1, my: my$1 } = symbols;
let Declaration$3 = declaration;
let Comment$6 = comment$1;
let Node$b = node_1$1;
let parse$4, Rule$4, AtRule$4;
function cleanSource(nodes) {
  return nodes.map((i) => {
    if (i.nodes)
      i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i;
  });
}
function markDirtyUp(node) {
  node[isClean$1] = false;
  if (node.proxyOf.nodes) {
    for (let i of node.proxyOf.nodes) {
      markDirtyUp(i);
    }
  }
}
class Container$l extends Node$b {
  push(child) {
    child.parent = this;
    this.proxyOf.nodes.push(child);
    return this;
  }
  each(callback) {
    if (!this.proxyOf.nodes)
      return void 0;
    let iterator = this.getIterator();
    let index, result2;
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index = this.indexes[iterator];
      result2 = callback(this.proxyOf.nodes[index], index);
      if (result2 === false)
        break;
      this.indexes[iterator] += 1;
    }
    delete this.indexes[iterator];
    return result2;
  }
  walk(callback) {
    return this.each((child, i) => {
      let result2;
      try {
        result2 = callback(child, i);
      } catch (e) {
        throw child.addToError(e);
      }
      if (result2 !== false && child.walk) {
        result2 = child.walk(callback);
      }
      return result2;
    });
  }
  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop;
      return this.walk((child, i) => {
        if (child.type === "decl") {
          return callback(child, i);
        }
      });
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "decl" && prop.test(child.prop)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "decl" && child.prop === prop) {
        return callback(child, i);
      }
    });
  }
  walkRules(selector, callback) {
    if (!callback) {
      callback = selector;
      return this.walk((child, i) => {
        if (child.type === "rule") {
          return callback(child, i);
        }
      });
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "rule" && selector.test(child.selector)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "rule" && child.selector === selector) {
        return callback(child, i);
      }
    });
  }
  walkAtRules(name, callback) {
    if (!callback) {
      callback = name;
      return this.walk((child, i) => {
        if (child.type === "atrule") {
          return callback(child, i);
        }
      });
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "atrule" && name.test(child.name)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "atrule" && child.name === name) {
        return callback(child, i);
      }
    });
  }
  walkComments(callback) {
    return this.walk((child, i) => {
      if (child.type === "comment") {
        return callback(child, i);
      }
    });
  }
  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last);
      for (let node of nodes)
        this.proxyOf.nodes.push(node);
    }
    this.markDirty();
    return this;
  }
  prepend(...children) {
    children = children.reverse();
    for (let child of children) {
      let nodes = this.normalize(child, this.first, "prepend").reverse();
      for (let node of nodes)
        this.proxyOf.nodes.unshift(node);
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (let node of this.nodes)
        node.cleanRaws(keepBetween);
    }
  }
  insertBefore(exist, add) {
    exist = this.index(exist);
    let type = exist === 0 ? "prepend" : false;
    let nodes = this.normalize(add, this.proxyOf.nodes[exist], type).reverse();
    for (let node of nodes)
      this.proxyOf.nodes.splice(exist, 0, node);
    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (exist <= index) {
        this.indexes[id] = index + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  insertAfter(exist, add) {
    exist = this.index(exist);
    let nodes = this.normalize(add, this.proxyOf.nodes[exist]).reverse();
    for (let node of nodes)
      this.proxyOf.nodes.splice(exist + 1, 0, node);
    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (exist < index) {
        this.indexes[id] = index + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.proxyOf.nodes[child].parent = void 0;
    this.proxyOf.nodes.splice(child, 1);
    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (index >= child) {
        this.indexes[id] = index - 1;
      }
    }
    this.markDirty();
    return this;
  }
  removeAll() {
    for (let node of this.proxyOf.nodes)
      node.parent = void 0;
    this.proxyOf.nodes = [];
    this.markDirty();
    return this;
  }
  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = {};
    }
    this.walkDecls((decl) => {
      if (opts.props && !opts.props.includes(decl.prop))
        return;
      if (opts.fast && !decl.value.includes(opts.fast))
        return;
      decl.value = decl.value.replace(pattern, callback);
    });
    this.markDirty();
    return this;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  some(condition) {
    return this.nodes.some(condition);
  }
  index(child) {
    if (typeof child === "number")
      return child;
    if (child.proxyOf)
      child = child.proxyOf;
    return this.proxyOf.nodes.indexOf(child);
  }
  get first() {
    if (!this.proxyOf.nodes)
      return void 0;
    return this.proxyOf.nodes[0];
  }
  get last() {
    if (!this.proxyOf.nodes)
      return void 0;
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
  normalize(nodes, sample) {
    if (typeof nodes === "string") {
      nodes = cleanSource(parse$4(nodes).nodes);
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0);
      for (let i of nodes) {
        if (i.parent)
          i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type === "root" && this.type !== "document") {
      nodes = nodes.nodes.slice(0);
      for (let i of nodes) {
        if (i.parent)
          i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type) {
      nodes = [nodes];
    } else if (nodes.prop) {
      if (typeof nodes.value === "undefined") {
        throw new Error("Value field is missed in node creation");
      } else if (typeof nodes.value !== "string") {
        nodes.value = String(nodes.value);
      }
      nodes = [new Declaration$3(nodes)];
    } else if (nodes.selector) {
      nodes = [new Rule$4(nodes)];
    } else if (nodes.name) {
      nodes = [new AtRule$4(nodes)];
    } else if (nodes.text) {
      nodes = [new Comment$6(nodes)];
    } else {
      throw new Error("Unknown node type in node creation");
    }
    let processed = nodes.map((i) => {
      if (!i[my$1])
        Container$l.rebuild(i);
      i = i.proxyOf;
      if (i.parent)
        i.parent.removeChild(i);
      if (i[isClean$1])
        markDirtyUp(i);
      if (typeof i.raws.before === "undefined") {
        if (sample && typeof sample.raws.before !== "undefined") {
          i.raws.before = sample.raws.before.replace(/\S/g, "");
        }
      }
      i.parent = this.proxyOf;
      return i;
    });
    return processed;
  }
  getProxyProcessor() {
    return {
      set(node, prop, value2) {
        if (node[prop] === value2)
          return true;
        node[prop] = value2;
        if (prop === "name" || prop === "params" || prop === "selector") {
          node.markDirty();
        }
        return true;
      },
      get(node, prop) {
        if (prop === "proxyOf") {
          return node;
        } else if (!node[prop]) {
          return node[prop];
        } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
          return (...args) => {
            return node[prop](...args.map((i) => {
              if (typeof i === "function") {
                return (child, index) => i(child.toProxy(), index);
              } else {
                return i;
              }
            }));
          };
        } else if (prop === "every" || prop === "some") {
          return (cb) => {
            return node[prop]((child, ...other) => cb(child.toProxy(), ...other));
          };
        } else if (prop === "root") {
          return () => node.root().toProxy();
        } else if (prop === "nodes") {
          return node.nodes.map((i) => i.toProxy());
        } else if (prop === "first" || prop === "last") {
          return node[prop].toProxy();
        } else {
          return node[prop];
        }
      }
    };
  }
  getIterator() {
    if (!this.lastEach)
      this.lastEach = 0;
    if (!this.indexes)
      this.indexes = {};
    this.lastEach += 1;
    let iterator = this.lastEach;
    this.indexes[iterator] = 0;
    return iterator;
  }
}
Container$l.registerParse = (dependant) => {
  parse$4 = dependant;
};
Container$l.registerRule = (dependant) => {
  Rule$4 = dependant;
};
Container$l.registerAtRule = (dependant) => {
  AtRule$4 = dependant;
};
var container$1 = Container$l;
Container$l.default = Container$l;
Container$l.rebuild = (node) => {
  if (node.type === "atrule") {
    Object.setPrototypeOf(node, AtRule$4.prototype);
  } else if (node.type === "rule") {
    Object.setPrototypeOf(node, Rule$4.prototype);
  } else if (node.type === "decl") {
    Object.setPrototypeOf(node, Declaration$3.prototype);
  } else if (node.type === "comment") {
    Object.setPrototypeOf(node, Comment$6.prototype);
  }
  node[my$1] = true;
  if (node.nodes) {
    node.nodes.forEach((child) => {
      Container$l.rebuild(child);
    });
  }
};
let Container$k = container$1;
let LazyResult$4, Processor$3;
class Document$3 extends Container$k {
  constructor(defaults) {
    super(__spreadValues({ type: "document" }, defaults));
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$4(new Processor$3(), this, opts);
    return lazy.stringify();
  }
}
Document$3.registerLazyResult = (dependant) => {
  LazyResult$4 = dependant;
};
Document$3.registerProcessor = (dependant) => {
  Processor$3 = dependant;
};
var document = Document$3;
Document$3.default = Document$3;
class Warning$2 {
  constructor(text, opts = {}) {
    this.type = "warning";
    this.text = text;
    if (opts.node && opts.node.source) {
      let range = opts.node.rangeBy(opts);
      this.line = range.start.line;
      this.column = range.start.column;
      this.endLine = range.end.line;
      this.endColumn = range.end.column;
    }
    for (let opt in opts)
      this[opt] = opts[opt];
  }
  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        plugin: this.plugin,
        index: this.index,
        word: this.word
      }).message;
    }
    if (this.plugin) {
      return this.plugin + ": " + this.text;
    }
    return this.text;
  }
}
var warning = Warning$2;
Warning$2.default = Warning$2;
let Warning$1 = warning;
class Result$3 {
  constructor(processor2, root2, opts) {
    this.processor = processor2;
    this.messages = [];
    this.root = root2;
    this.opts = opts;
    this.css = void 0;
    this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }
    let warning2 = new Warning$1(text, opts);
    this.messages.push(warning2);
    return warning2;
  }
  warnings() {
    return this.messages.filter((i) => i.type === "warning");
  }
  get content() {
    return this.css;
  }
}
var result = Result$3;
Result$3.default = Result$3;
const SINGLE_QUOTE = "'".charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = "\\".charCodeAt(0);
const SLASH = "/".charCodeAt(0);
const NEWLINE = "\n".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const FEED = "\f".charCodeAt(0);
const TAB = "	".charCodeAt(0);
const CR = "\r".charCodeAt(0);
const OPEN_SQUARE = "[".charCodeAt(0);
const CLOSE_SQUARE = "]".charCodeAt(0);
const OPEN_PARENTHESES = "(".charCodeAt(0);
const CLOSE_PARENTHESES = ")".charCodeAt(0);
const OPEN_CURLY = "{".charCodeAt(0);
const CLOSE_CURLY = "}".charCodeAt(0);
const SEMICOLON = ";".charCodeAt(0);
const ASTERISK = "*".charCodeAt(0);
const COLON = ":".charCodeAt(0);
const AT = "@".charCodeAt(0);
const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
const RE_BAD_BRACKET = /.[\n"'(/\\]/;
const RE_HEX_ESCAPE = /[\da-f]/i;
var tokenize$2 = function tokenizer(input2, options = {}) {
  let css = input2.css.valueOf();
  let ignore = options.ignoreErrors;
  let code, next, quote, content, escape;
  let escaped, escapePos, prev, n, currentToken;
  let length = css.length;
  let pos = 0;
  let buffer = [];
  let returned = [];
  function position() {
    return pos;
  }
  function unclosed(what) {
    throw input2.error("Unclosed " + what, pos);
  }
  function endOfFile() {
    return returned.length === 0 && pos >= length;
  }
  function nextToken(opts) {
    if (returned.length)
      return returned.pop();
    if (pos >= length)
      return;
    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
    code = css.charCodeAt(pos);
    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
        currentToken = ["space", css.slice(pos, next)];
        pos = next - 1;
        break;
      }
      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        let controlChar = String.fromCharCode(code);
        currentToken = [controlChar, controlChar, pos];
        break;
      }
      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : "";
        n = css.charCodeAt(pos + 1);
        if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(")", next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos;
                break;
              } else {
                unclosed("bracket");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          next = css.indexOf(")", pos + 1);
          content = css.slice(pos, next + 1);
          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ["(", "(", pos];
          } else {
            currentToken = ["brackets", content, pos, next];
            pos = next;
          }
        }
        break;
      }
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1;
              break;
            } else {
              unclosed("string");
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        currentToken = ["string", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case AT: {
        RE_AT_END.lastIndex = pos + 1;
        RE_AT_END.test(css);
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END.lastIndex - 2;
        }
        currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case BACKSLASH: {
        next = pos;
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
          next += 1;
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1;
            }
          }
        }
        currentToken = ["word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf("*/", pos + 2) + 1;
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length;
            } else {
              unclosed("comment");
            }
          }
          currentToken = ["comment", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          RE_WORD_END.lastIndex = pos + 1;
          RE_WORD_END.test(css);
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END.lastIndex - 2;
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          buffer.push(currentToken);
          pos = next;
        }
        break;
      }
    }
    pos++;
    return currentToken;
  }
  function back(token) {
    returned.push(token);
  }
  return {
    back,
    nextToken,
    endOfFile,
    position
  };
};
let Container$j = container$1;
class AtRule$3 extends Container$j {
  constructor(defaults) {
    super(defaults);
    this.type = "atrule";
  }
  append(...children) {
    if (!this.proxyOf.nodes)
      this.nodes = [];
    return super.append(...children);
  }
  prepend(...children) {
    if (!this.proxyOf.nodes)
      this.nodes = [];
    return super.prepend(...children);
  }
}
var atRule = AtRule$3;
AtRule$3.default = AtRule$3;
Container$j.registerAtRule(AtRule$3);
let Container$i = container$1;
let LazyResult$3, Processor$2;
class Root$6 extends Container$i {
  constructor(defaults) {
    super(defaults);
    this.type = "root";
    if (!this.nodes)
      this.nodes = [];
  }
  removeChild(child, ignore) {
    let index = this.index(child);
    if (!ignore && index === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index].raws.before;
    }
    return super.removeChild(child);
  }
  normalize(child, sample, type) {
    let nodes = super.normalize(child);
    if (sample) {
      if (type === "prepend") {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        for (let node of nodes) {
          node.raws.before = sample.raws.before;
        }
      }
    }
    return nodes;
  }
  toResult(opts = {}) {
    let lazy = new LazyResult$3(new Processor$2(), this, opts);
    return lazy.stringify();
  }
}
Root$6.registerLazyResult = (dependant) => {
  LazyResult$3 = dependant;
};
Root$6.registerProcessor = (dependant) => {
  Processor$2 = dependant;
};
var root$1 = Root$6;
Root$6.default = Root$6;
let list$2 = {
  split(string2, separators, last) {
    let array = [];
    let current = "";
    let split = false;
    let func = 0;
    let quote = false;
    let escape = false;
    for (let letter of string2) {
      if (escape) {
        escape = false;
      } else if (letter === "\\") {
        escape = true;
      } else if (quote) {
        if (letter === quote) {
          quote = false;
        }
      } else if (letter === '"' || letter === "'") {
        quote = letter;
      } else if (letter === "(") {
        func += 1;
      } else if (letter === ")") {
        if (func > 0)
          func -= 1;
      } else if (func === 0) {
        if (separators.includes(letter))
          split = true;
      }
      if (split) {
        if (current !== "")
          array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }
    if (last || current !== "")
      array.push(current.trim());
    return array;
  },
  space(string2) {
    let spaces = [" ", "\n", "	"];
    return list$2.split(string2, spaces);
  },
  comma(string2) {
    return list$2.split(string2, [","], true);
  }
};
var list_1 = list$2;
list$2.default = list$2;
let Container$h = container$1;
let list$1 = list_1;
class Rule$3 extends Container$h {
  constructor(defaults) {
    super(defaults);
    this.type = "rule";
    if (!this.nodes)
      this.nodes = [];
  }
  get selectors() {
    return list$1.comma(this.selector);
  }
  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null;
    let sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
    this.selector = values.join(sep2);
  }
}
var rule = Rule$3;
Rule$3.default = Rule$3;
Container$h.registerRule(Rule$3);
let Declaration$2 = declaration;
let tokenizer2 = tokenize$2;
let Comment$5 = comment$1;
let AtRule$2 = atRule;
let Root$5 = root$1;
let Rule$2 = rule;
const SAFE_COMMENT_NEIGHBOR = {
  empty: true,
  space: true
};
function findLastWithPosition(tokens) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    let token = tokens[i];
    let pos = token[3] || token[2];
    if (pos)
      return pos;
  }
}
class Parser$2 {
  constructor(input2) {
    this.input = input2;
    this.root = new Root$5();
    this.current = this.root;
    this.spaces = "";
    this.semicolon = false;
    this.customProperty = false;
    this.createTokenizer();
    this.root.source = { input: input2, start: { offset: 0, line: 1, column: 1 } };
  }
  createTokenizer() {
    this.tokenizer = tokenizer2(this.input);
  }
  parse() {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      switch (token[0]) {
        case "space":
          this.spaces += token[1];
          break;
        case ";":
          this.freeSemicolon(token);
          break;
        case "}":
          this.end(token);
          break;
        case "comment":
          this.comment(token);
          break;
        case "at-word":
          this.atrule(token);
          break;
        case "{":
          this.emptyRule(token);
          break;
        default:
          this.other(token);
          break;
      }
    }
    this.endFile();
  }
  comment(token) {
    let node = new Comment$5();
    this.init(node, token[2]);
    node.source.end = this.getPosition(token[3] || token[2]);
    let text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node.text = "";
      node.raws.left = text;
      node.raws.right = "";
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
      node.text = match[2];
      node.raws.left = match[1];
      node.raws.right = match[3];
    }
  }
  emptyRule(token) {
    let node = new Rule$2();
    this.init(node, token[2]);
    node.selector = "";
    node.raws.between = "";
    this.current = node;
  }
  other(start) {
    let end = false;
    let type = null;
    let colon2 = false;
    let bracket = null;
    let brackets = [];
    let customProperty = start[1].startsWith("--");
    let tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);
      if (type === "(" || type === "[") {
        if (!bracket)
          bracket = token;
        brackets.push(type === "(" ? ")" : "]");
      } else if (customProperty && colon2 && type === "{") {
        if (!bracket)
          bracket = token;
        brackets.push("}");
      } else if (brackets.length === 0) {
        if (type === ";") {
          if (colon2) {
            this.decl(tokens, customProperty);
            return;
          } else {
            break;
          }
        } else if (type === "{") {
          this.rule(tokens);
          return;
        } else if (type === "}") {
          this.tokenizer.back(tokens.pop());
          end = true;
          break;
        } else if (type === ":") {
          colon2 = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0)
          bracket = null;
      }
      token = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile())
      end = true;
    if (brackets.length > 0)
      this.unclosedBracket(bracket);
    if (end && colon2) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0];
          if (token !== "space" && token !== "comment")
            break;
          this.tokenizer.back(tokens.pop());
        }
      }
      this.decl(tokens, customProperty);
    } else {
      this.unknownWord(tokens);
    }
  }
  rule(tokens) {
    tokens.pop();
    let node = new Rule$2();
    this.init(node, tokens[0][2]);
    node.raws.between = this.spacesAndCommentsFromEnd(tokens);
    this.raw(node, "selector", tokens);
    this.current = node;
  }
  decl(tokens, customProperty) {
    let node = new Declaration$2();
    this.init(node, tokens[0][2]);
    let last = tokens[tokens.length - 1];
    if (last[0] === ";") {
      this.semicolon = true;
      tokens.pop();
    }
    node.source.end = this.getPosition(last[3] || last[2] || findLastWithPosition(tokens));
    while (tokens[0][0] !== "word") {
      if (tokens.length === 1)
        this.unknownWord(tokens);
      node.raws.before += tokens.shift()[1];
    }
    node.source.start = this.getPosition(tokens[0][2]);
    node.prop = "";
    while (tokens.length) {
      let type = tokens[0][0];
      if (type === ":" || type === "space" || type === "comment") {
        break;
      }
      node.prop += tokens.shift()[1];
    }
    node.raws.between = "";
    let token;
    while (tokens.length) {
      token = tokens.shift();
      if (token[0] === ":") {
        node.raws.between += token[1];
        break;
      } else {
        if (token[0] === "word" && /\w/.test(token[1])) {
          this.unknownWord([token]);
        }
        node.raws.between += token[1];
      }
    }
    if (node.prop[0] === "_" || node.prop[0] === "*") {
      node.raws.before += node.prop[0];
      node.prop = node.prop.slice(1);
    }
    let firstSpaces = [];
    let next;
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment")
        break;
      firstSpaces.push(tokens.shift());
    }
    this.precheckMissedSemicolon(tokens);
    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];
      if (token[1].toLowerCase() === "!important") {
        node.important = true;
        let string2 = this.stringFrom(tokens, i);
        string2 = this.spacesFromEnd(tokens) + string2;
        if (string2 !== " !important")
          node.raws.important = string2;
        break;
      } else if (token[1].toLowerCase() === "important") {
        let cache = tokens.slice(0);
        let str = "";
        for (let j = i; j > 0; j--) {
          let type = cache[j][0];
          if (str.trim().indexOf("!") === 0 && type !== "space") {
            break;
          }
          str = cache.pop()[1] + str;
        }
        if (str.trim().indexOf("!") === 0) {
          node.important = true;
          node.raws.important = str;
          tokens = cache;
        }
      }
      if (token[0] !== "space" && token[0] !== "comment") {
        break;
      }
    }
    let hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
    if (hasWord) {
      node.raws.between += firstSpaces.map((i) => i[1]).join("");
      firstSpaces = [];
    }
    this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
    if (node.value.includes(":") && !customProperty) {
      this.checkMissedSemicolon(tokens);
    }
  }
  atrule(token) {
    let node = new AtRule$2();
    node.name = token[1].slice(1);
    if (node.name === "") {
      this.unnamedAtrule(node, token);
    }
    this.init(node, token[2]);
    let type;
    let prev;
    let shift;
    let last = false;
    let open = false;
    let params = [];
    let brackets = [];
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      type = token[0];
      if (type === "(" || type === "[") {
        brackets.push(type === "(" ? ")" : "]");
      } else if (type === "{" && brackets.length > 0) {
        brackets.push("}");
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
      }
      if (brackets.length === 0) {
        if (type === ";") {
          node.source.end = this.getPosition(token[2]);
          this.semicolon = true;
          break;
        } else if (type === "{") {
          open = true;
          break;
        } else if (type === "}") {
          if (params.length > 0) {
            shift = params.length - 1;
            prev = params[shift];
            while (prev && prev[0] === "space") {
              prev = params[--shift];
            }
            if (prev) {
              node.source.end = this.getPosition(prev[3] || prev[2]);
            }
          }
          this.end(token);
          break;
        } else {
          params.push(token);
        }
      } else {
        params.push(token);
      }
      if (this.tokenizer.endOfFile()) {
        last = true;
        break;
      }
    }
    node.raws.between = this.spacesAndCommentsFromEnd(params);
    if (params.length) {
      node.raws.afterName = this.spacesAndCommentsFromStart(params);
      this.raw(node, "params", params);
      if (last) {
        token = params[params.length - 1];
        node.source.end = this.getPosition(token[3] || token[2]);
        this.spaces = node.raws.between;
        node.raws.between = "";
      }
    } else {
      node.raws.afterName = "";
      node.params = "";
    }
    if (open) {
      node.nodes = [];
      this.current = node;
    }
  }
  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.spaces = "";
    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2]);
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  }
  endFile() {
    if (this.current.parent)
      this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
  }
  freeSemicolon(token) {
    this.spaces += token[1];
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1];
      if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces;
        this.spaces = "";
      }
    }
  }
  getPosition(offset) {
    let pos = this.input.fromOffset(offset);
    return {
      offset,
      line: pos.line,
      column: pos.col
    };
  }
  init(node, offset) {
    this.current.push(node);
    node.source = {
      start: this.getPosition(offset),
      input: this.input
    };
    node.raws.before = this.spaces;
    this.spaces = "";
    if (node.type !== "comment")
      this.semicolon = false;
  }
  raw(node, prop, tokens, customProperty) {
    let token, type;
    let length = tokens.length;
    let value2 = "";
    let clean = true;
    let next, prev;
    for (let i = 0; i < length; i += 1) {
      token = tokens[i];
      type = token[0];
      if (type === "space" && i === length - 1 && !customProperty) {
        clean = false;
      } else if (type === "comment") {
        prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
        next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
          if (value2.slice(-1) === ",") {
            clean = false;
          } else {
            value2 += token[1];
          }
        } else {
          clean = false;
        }
      } else {
        value2 += token[1];
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], "");
      node.raws[prop] = { value: value2, raw };
    }
    node[prop] = value2;
  }
  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space" && lastTokenType !== "comment")
        break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  spacesAndCommentsFromStart(tokens) {
    let next;
    let spaces = "";
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment")
        break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  }
  spacesFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space")
        break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  stringFrom(tokens, from) {
    let result2 = "";
    for (let i = from; i < tokens.length; i++) {
      result2 += tokens[i][1];
    }
    tokens.splice(from, tokens.length - from);
    return result2;
  }
  colon(tokens) {
    let brackets = 0;
    let token, type, prev;
    for (let [i, element] of tokens.entries()) {
      token = element;
      type = token[0];
      if (type === "(") {
        brackets += 1;
      }
      if (type === ")") {
        brackets -= 1;
      }
      if (brackets === 0 && type === ":") {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === "word" && prev[1] === "progid") {
          continue;
        } else {
          return i;
        }
      }
      prev = token;
    }
    return false;
  }
  unclosedBracket(bracket) {
    throw this.input.error("Unclosed bracket", { offset: bracket[2] }, { offset: bracket[2] + 1 });
  }
  unknownWord(tokens) {
    throw this.input.error("Unknown word", { offset: tokens[0][2] }, { offset: tokens[0][2] + tokens[0][1].length });
  }
  unexpectedClose(token) {
    throw this.input.error("Unexpected }", { offset: token[2] }, { offset: token[2] + 1 });
  }
  unclosedBlock() {
    let pos = this.current.source.start;
    throw this.input.error("Unclosed block", pos.line, pos.column);
  }
  doubleColon(token) {
    throw this.input.error("Double colon", { offset: token[2] }, { offset: token[2] + token[1].length });
  }
  unnamedAtrule(node, token) {
    throw this.input.error("At-rule without name", { offset: token[2] }, { offset: token[2] + token[1].length });
  }
  precheckMissedSemicolon() {
  }
  checkMissedSemicolon(tokens) {
    let colon2 = this.colon(tokens);
    if (colon2 === false)
      return;
    let founded = 0;
    let token;
    for (let j = colon2 - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== "space") {
        founded += 1;
        if (founded === 2)
          break;
      }
    }
    throw this.input.error("Missed semicolon", token[0] === "word" ? token[3] + 1 : token[2]);
  }
}
var parser$2 = Parser$2;
let Container$g = container$1;
let Parser$1 = parser$2;
let Input$2 = input;
function parse$3(css, opts) {
  let input2 = new Input$2(css, opts);
  let parser2 = new Parser$1(input2);
  try {
    parser2.parse();
  } catch (e) {
    throw e;
  }
  return parser2.root;
}
var parse_1 = parse$3;
parse$3.default = parse$3;
Container$g.registerParse(parse$3);
let { isClean, my } = symbols;
let MapGenerator$1 = mapGenerator;
let stringify$2 = stringify_1;
let Container$f = container$1;
let Document$2 = document;
let Result$2 = result;
let parse$2 = parse_1;
let Root$4 = root$1;
const TYPE_TO_CLASS_NAME = {
  document: "Document",
  root: "Root",
  atrule: "AtRule",
  rule: "Rule",
  decl: "Declaration",
  comment: "Comment"
};
const PLUGIN_PROPS = {
  postcssPlugin: true,
  prepare: true,
  Once: true,
  Document: true,
  Root: true,
  Declaration: true,
  Rule: true,
  AtRule: true,
  Comment: true,
  DeclarationExit: true,
  RuleExit: true,
  AtRuleExit: true,
  CommentExit: true,
  RootExit: true,
  DocumentExit: true,
  OnceExit: true
};
const NOT_VISITORS = {
  postcssPlugin: true,
  prepare: true,
  Once: true
};
const CHILDREN = 0;
function isPromise(obj) {
  return typeof obj === "object" && typeof obj.then === "function";
}
function getEvents(node) {
  let key = false;
  let type = TYPE_TO_CLASS_NAME[node.type];
  if (node.type === "decl") {
    key = node.prop.toLowerCase();
  } else if (node.type === "atrule") {
    key = node.name.toLowerCase();
  }
  if (key && node.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node.append) {
    return [type, CHILDREN, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
function toStack(node) {
  let events;
  if (node.type === "document") {
    events = ["Document", CHILDREN, "DocumentExit"];
  } else if (node.type === "root") {
    events = ["Root", CHILDREN, "RootExit"];
  } else {
    events = getEvents(node);
  }
  return {
    node,
    events,
    eventIndex: 0,
    visitors: [],
    visitorIndex: 0,
    iterator: 0
  };
}
function cleanMarks(node) {
  node[isClean] = false;
  if (node.nodes)
    node.nodes.forEach((i) => cleanMarks(i));
  return node;
}
let postcss$1 = {};
class LazyResult$2 {
  constructor(processor2, css, opts) {
    this.stringified = false;
    this.processed = false;
    let root2;
    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
      root2 = cleanMarks(css);
    } else if (css instanceof LazyResult$2 || css instanceof Result$2) {
      root2 = cleanMarks(css.root);
      if (css.map) {
        if (typeof opts.map === "undefined")
          opts.map = {};
        if (!opts.map.inline)
          opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser2 = parse$2;
      if (opts.syntax)
        parser2 = opts.syntax.parse;
      if (opts.parser)
        parser2 = opts.parser;
      if (parser2.parse)
        parser2 = parser2.parse;
      try {
        root2 = parser2(css, opts);
      } catch (error) {
        this.processed = true;
        this.error = error;
      }
      if (root2 && !root2[my]) {
        Container$f.rebuild(root2);
      }
    }
    this.result = new Result$2(processor2, root2, opts);
    this.helpers = __spreadProps(__spreadValues({}, postcss$1), { result: this.result, postcss: postcss$1 });
    this.plugins = this.processor.plugins.map((plugin2) => {
      if (typeof plugin2 === "object" && plugin2.prepare) {
        return __spreadValues(__spreadValues({}, plugin2), plugin2.prepare(this.result));
      } else {
        return plugin2;
      }
    });
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
  get processor() {
    return this.result.processor;
  }
  get opts() {
    return this.result.opts;
  }
  get css() {
    return this.stringify().css;
  }
  get content() {
    return this.stringify().content;
  }
  get map() {
    return this.stringify().map;
  }
  get root() {
    return this.sync().root;
  }
  get messages() {
    return this.sync().messages;
  }
  warnings() {
    return this.sync().warnings();
  }
  toString() {
    return this.css;
  }
  then(onFulfilled, onRejected) {
    return this.async().then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  async() {
    if (this.error)
      return Promise.reject(this.error);
    if (this.processed)
      return Promise.resolve(this.result);
    if (!this.processing) {
      this.processing = this.runAsync();
    }
    return this.processing;
  }
  sync() {
    if (this.error)
      throw this.error;
    if (this.processed)
      return this.result;
    this.processed = true;
    if (this.processing) {
      throw this.getAsyncError();
    }
    for (let plugin2 of this.plugins) {
      let promise = this.runOnRoot(plugin2);
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root2 = this.result.root;
      while (!root2[isClean]) {
        root2[isClean] = true;
        this.walkSync(root2);
      }
      if (this.listeners.OnceExit) {
        if (root2.type === "document") {
          for (let subRoot of root2.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot);
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root2);
        }
      }
    }
    return this.result;
  }
  stringify() {
    if (this.error)
      throw this.error;
    if (this.stringified)
      return this.result;
    this.stringified = true;
    this.sync();
    let opts = this.result.opts;
    let str = stringify$2;
    if (opts.syntax)
      str = opts.syntax.stringify;
    if (opts.stringifier)
      str = opts.stringifier;
    if (str.stringify)
      str = str.stringify;
    let map = new MapGenerator$1(str, this.result.root, this.result.opts);
    let data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];
    return this.result;
  }
  walkSync(node) {
    node[isClean] = true;
    let events = getEvents(node);
    for (let event of events) {
      if (event === CHILDREN) {
        if (node.nodes) {
          node.each((child) => {
            if (!child[isClean])
              this.walkSync(child);
          });
        }
      } else {
        let visitors = this.listeners[event];
        if (visitors) {
          if (this.visitSync(visitors, node.toProxy()))
            return;
        }
      }
    }
  }
  visitSync(visitors, node) {
    for (let [plugin2, visitor] of visitors) {
      this.result.lastPlugin = plugin2;
      let promise;
      try {
        promise = visitor(node, this.helpers);
      } catch (e) {
        throw this.handleError(e, node.proxyOf);
      }
      if (node.type !== "root" && node.type !== "document" && !node.parent) {
        return true;
      }
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
  }
  runOnRoot(plugin2) {
    this.result.lastPlugin = plugin2;
    try {
      if (typeof plugin2 === "object" && plugin2.Once) {
        if (this.result.root.type === "document") {
          let roots = this.result.root.nodes.map((root2) => plugin2.Once(root2, this.helpers));
          if (isPromise(roots[0])) {
            return Promise.all(roots);
          }
          return roots;
        }
        return plugin2.Once(this.result.root, this.helpers);
      } else if (typeof plugin2 === "function") {
        return plugin2(this.result.root, this.result);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(error, node) {
    let plugin2 = this.result.lastPlugin;
    try {
      if (node)
        node.addToError(error);
      this.error = error;
      if (error.name === "CssSyntaxError" && !error.plugin) {
        error.plugin = plugin2.postcssPlugin;
        error.setMessage();
      } else if (plugin2.postcssVersion) {
        if (false)
          ;
      }
    } catch (err) {
      if (console && console.error)
        console.error(err);
    }
    return error;
  }
  async runAsync() {
    this.plugin = 0;
    for (let i = 0; i < this.plugins.length; i++) {
      let plugin2 = this.plugins[i];
      let promise = this.runOnRoot(plugin2);
      if (isPromise(promise)) {
        try {
          await promise;
        } catch (error) {
          throw this.handleError(error);
        }
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      let root2 = this.result.root;
      while (!root2[isClean]) {
        root2[isClean] = true;
        let stack = [toStack(root2)];
        while (stack.length > 0) {
          let promise = this.visitTick(stack);
          if (isPromise(promise)) {
            try {
              await promise;
            } catch (e) {
              let node = stack[stack.length - 1].node;
              throw this.handleError(e, node);
            }
          }
        }
      }
      if (this.listeners.OnceExit) {
        for (let [plugin2, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin2;
          try {
            if (root2.type === "document") {
              let roots = root2.nodes.map((subRoot) => visitor(subRoot, this.helpers));
              await Promise.all(roots);
            } else {
              await visitor(root2, this.helpers);
            }
          } catch (e) {
            throw this.handleError(e);
          }
        }
      }
    }
    this.processed = true;
    return this.stringify();
  }
  prepareVisitors() {
    this.listeners = {};
    let add = (plugin2, type, cb) => {
      if (!this.listeners[type])
        this.listeners[type] = [];
      this.listeners[type].push([plugin2, cb]);
    };
    for (let plugin2 of this.plugins) {
      if (typeof plugin2 === "object") {
        for (let event in plugin2) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(`Unknown event ${event} in ${plugin2.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin2[event] === "object") {
              for (let filter in plugin2[event]) {
                if (filter === "*") {
                  add(plugin2, event, plugin2[event][filter]);
                } else {
                  add(plugin2, event + "-" + filter.toLowerCase(), plugin2[event][filter]);
                }
              }
            } else if (typeof plugin2[event] === "function") {
              add(plugin2, event, plugin2[event]);
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  visitTick(stack) {
    let visit = stack[stack.length - 1];
    let { node, visitors } = visit;
    if (node.type !== "root" && node.type !== "document" && !node.parent) {
      stack.pop();
      return;
    }
    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
      let [plugin2, visitor] = visitors[visit.visitorIndex];
      visit.visitorIndex += 1;
      if (visit.visitorIndex === visitors.length) {
        visit.visitors = [];
        visit.visitorIndex = 0;
      }
      this.result.lastPlugin = plugin2;
      try {
        return visitor(node.toProxy(), this.helpers);
      } catch (e) {
        throw this.handleError(e, node);
      }
    }
    if (visit.iterator !== 0) {
      let iterator = visit.iterator;
      let child;
      while (child = node.nodes[node.indexes[iterator]]) {
        node.indexes[iterator] += 1;
        if (!child[isClean]) {
          child[isClean] = true;
          stack.push(toStack(child));
          return;
        }
      }
      visit.iterator = 0;
      delete node.indexes[iterator];
    }
    let events = visit.events;
    while (visit.eventIndex < events.length) {
      let event = events[visit.eventIndex];
      visit.eventIndex += 1;
      if (event === CHILDREN) {
        if (node.nodes && node.nodes.length) {
          node[isClean] = true;
          visit.iterator = node.getIterator();
        }
        return;
      } else if (this.listeners[event]) {
        visit.visitors = this.listeners[event];
        return;
      }
    }
    stack.pop();
  }
}
LazyResult$2.registerPostcss = (dependant) => {
  postcss$1 = dependant;
};
var lazyResult = LazyResult$2;
LazyResult$2.default = LazyResult$2;
Root$4.registerLazyResult(LazyResult$2);
Document$2.registerLazyResult(LazyResult$2);
let MapGenerator = mapGenerator;
let stringify$1 = stringify_1;
let parse$1 = parse_1;
const Result$1 = result;
class NoWorkResult$1 {
  constructor(processor2, css, opts) {
    css = css.toString();
    this.stringified = false;
    this._processor = processor2;
    this._css = css;
    this._opts = opts;
    this._map = void 0;
    let root2;
    let str = stringify$1;
    this.result = new Result$1(this._processor, root2, this._opts);
    this.result.css = css;
    let self = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return self.root;
      }
    });
    let map = new MapGenerator(str, root2, this._opts, css);
    if (map.isMap()) {
      let [generatedCSS, generatedMap] = map.generate();
      if (generatedCSS) {
        this.result.css = generatedCSS;
      }
      if (generatedMap) {
        this.result.map = generatedMap;
      }
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
  get processor() {
    return this.result.processor;
  }
  get opts() {
    return this.result.opts;
  }
  get css() {
    return this.result.css;
  }
  get content() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get root() {
    if (this._root) {
      return this._root;
    }
    let root2;
    let parser2 = parse$1;
    try {
      root2 = parser2(this._css, this._opts);
    } catch (error) {
      this.error = error;
    }
    if (this.error) {
      throw this.error;
    } else {
      this._root = root2;
      return root2;
    }
  }
  get messages() {
    return [];
  }
  warnings() {
    return [];
  }
  toString() {
    return this._css;
  }
  then(onFulfilled, onRejected) {
    return this.async().then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  async() {
    if (this.error)
      return Promise.reject(this.error);
    return Promise.resolve(this.result);
  }
  sync() {
    if (this.error)
      throw this.error;
    return this.result;
  }
}
var noWorkResult = NoWorkResult$1;
NoWorkResult$1.default = NoWorkResult$1;
let NoWorkResult = noWorkResult;
let LazyResult$1 = lazyResult;
let Document$1 = document;
let Root$3 = root$1;
class Processor$1 {
  constructor(plugins = []) {
    this.version = "8.4.13";
    this.plugins = this.normalize(plugins);
  }
  use(plugin2) {
    this.plugins = this.plugins.concat(this.normalize([plugin2]));
    return this;
  }
  process(css, opts = {}) {
    if (this.plugins.length === 0 && typeof opts.parser === "undefined" && typeof opts.stringifier === "undefined" && typeof opts.syntax === "undefined") {
      return new NoWorkResult(this, css, opts);
    } else {
      return new LazyResult$1(this, css, opts);
    }
  }
  normalize(plugins) {
    let normalized = [];
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i();
      } else if (i.postcss) {
        i = i.postcss;
      }
      if (typeof i === "object" && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === "object" && i.postcssPlugin) {
        normalized.push(i);
      } else if (typeof i === "function") {
        normalized.push(i);
      } else if (typeof i === "object" && (i.parse || i.stringify))
        ;
      else {
        throw new Error(i + " is not a PostCSS plugin");
      }
    }
    return normalized;
  }
}
var processor = Processor$1;
Processor$1.default = Processor$1;
Root$3.registerProcessor(Processor$1);
Document$1.registerProcessor(Processor$1);
let Declaration$1 = declaration;
let PreviousMap = previousMap;
let Comment$4 = comment$1;
let AtRule$1 = atRule;
let Input$1 = input;
let Root$2 = root$1;
let Rule$1 = rule;
function fromJSON$1(json, inputs) {
  if (Array.isArray(json))
    return json.map((n) => fromJSON$1(n));
  let _a = json, { inputs: ownInputs } = _a, defaults = __objRest(_a, ["inputs"]);
  if (ownInputs) {
    inputs = [];
    for (let input2 of ownInputs) {
      let inputHydrated = __spreadProps(__spreadValues({}, input2), { __proto__: Input$1.prototype });
      if (inputHydrated.map) {
        inputHydrated.map = __spreadProps(__spreadValues({}, inputHydrated.map), {
          __proto__: PreviousMap.prototype
        });
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map((n) => fromJSON$1(n, inputs));
  }
  if (defaults.source) {
    let _b = defaults.source, { inputId } = _b, source = __objRest(_b, ["inputId"]);
    defaults.source = source;
    if (inputId != null) {
      defaults.source.input = inputs[inputId];
    }
  }
  if (defaults.type === "root") {
    return new Root$2(defaults);
  } else if (defaults.type === "decl") {
    return new Declaration$1(defaults);
  } else if (defaults.type === "rule") {
    return new Rule$1(defaults);
  } else if (defaults.type === "comment") {
    return new Comment$4(defaults);
  } else if (defaults.type === "atrule") {
    return new AtRule$1(defaults);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
var fromJSON_1 = fromJSON$1;
fromJSON$1.default = fromJSON$1;
let CssSyntaxError = cssSyntaxError;
let Declaration = declaration;
let LazyResult = lazyResult;
let Container$e = container$1;
let Processor = processor;
let stringify = stringify_1;
let fromJSON = fromJSON_1;
let Document = document;
let Warning = warning;
let Comment$3 = comment$1;
let AtRule = atRule;
let Result = result;
let Input = input;
let parse = parse_1;
let list = list_1;
let Rule = rule;
let Root$1 = root$1;
let Node$a = node_1$1;
function postcss(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor(plugins);
}
postcss.plugin = function plugin(name, initializer) {
  if (console && console.warn) {
    console.warn(name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration");
    if ({}.LANG && {}.LANG.startsWith("cn")) {
      console.warn(name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226");
    }
  }
  function creator(...args) {
    let transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new Processor().version;
    return transformer;
  }
  let cache;
  Object.defineProperty(creator, "postcss", {
    get() {
      if (!cache)
        cache = creator();
      return cache;
    }
  });
  creator.process = function(css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts);
  };
  return creator;
};
postcss.stringify = stringify;
postcss.parse = parse;
postcss.fromJSON = fromJSON;
postcss.list = list;
postcss.comment = (defaults) => new Comment$3(defaults);
postcss.atRule = (defaults) => new AtRule(defaults);
postcss.decl = (defaults) => new Declaration(defaults);
postcss.rule = (defaults) => new Rule(defaults);
postcss.root = (defaults) => new Root$1(defaults);
postcss.document = (defaults) => new Document(defaults);
postcss.CssSyntaxError = CssSyntaxError;
postcss.Declaration = Declaration;
postcss.Container = Container$e;
postcss.Processor = Processor;
postcss.Document = Document;
postcss.Comment = Comment$3;
postcss.Warning = Warning;
postcss.AtRule = AtRule;
postcss.Result = Result;
postcss.Input = Input;
postcss.Rule = Rule;
postcss.Root = Root$1;
postcss.Node = Node$a;
LazyResult.registerPostcss(postcss);
var postcss_1 = postcss;
postcss.default = postcss;
postcss_1.stringify;
postcss_1.fromJSON;
postcss_1.plugin;
postcss_1.parse;
postcss_1.list;
postcss_1.document;
postcss_1.comment;
postcss_1.atRule;
postcss_1.rule;
postcss_1.decl;
postcss_1.root;
postcss_1.CssSyntaxError;
postcss_1.Declaration;
postcss_1.Container;
postcss_1.Processor;
postcss_1.Document;
postcss_1.Comment;
postcss_1.Warning;
postcss_1.AtRule;
postcss_1.Result;
postcss_1.Input;
postcss_1.Rule;
postcss_1.Root;
postcss_1.Node;
let cloneNode = function(obj, parent) {
  let cloned = new obj.constructor();
  for (let i in obj) {
    if (!obj.hasOwnProperty(i))
      continue;
    let value2 = obj[i], type = typeof value2;
    if (i === "parent" && type === "object") {
      if (parent)
        cloned[i] = parent;
    } else if (i === "source") {
      cloned[i] = value2;
    } else if (value2 instanceof Array) {
      cloned[i] = value2.map((j) => cloneNode(j, cloned));
    } else if (i !== "before" && i !== "after" && i !== "between" && i !== "semicolon") {
      if (type === "object" && value2 !== null)
        value2 = cloneNode(value2);
      cloned[i] = value2;
    }
  }
  return cloned;
};
var node_1 = class Node {
  constructor(defaults) {
    defaults = defaults || {};
    this.raws = { before: "", after: "" };
    for (let name in defaults) {
      this[name] = defaults[name];
    }
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  toString() {
    return [
      this.raws.before,
      String(this.value),
      this.raws.after
    ].join("");
  }
  clone(overrides) {
    overrides = overrides || {};
    let cloned = cloneNode(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  cloneBefore(overrides) {
    overrides = overrides || {};
    let cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  }
  cloneAfter(overrides) {
    overrides = overrides || {};
    let cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  }
  replaceWith() {
    let nodes = Array.prototype.slice.call(arguments);
    if (this.parent) {
      for (let node of nodes) {
        this.parent.insertBefore(this, node);
      }
      this.remove();
    }
    return this;
  }
  moveTo(container2) {
    this.cleanRaws(this.root() === container2.root());
    this.remove();
    container2.append(this);
    return this;
  }
  moveBefore(node) {
    this.cleanRaws(this.root() === node.root());
    this.remove();
    node.parent.insertBefore(node, this);
    return this;
  }
  moveAfter(node) {
    this.cleanRaws(this.root() === node.root());
    this.remove();
    node.parent.insertAfter(node, this);
    return this;
  }
  next() {
    let index = this.parent.index(this);
    return this.parent.nodes[index + 1];
  }
  prev() {
    let index = this.parent.index(this);
    return this.parent.nodes[index - 1];
  }
  toJSON() {
    let fixed = {};
    for (let name in this) {
      if (!this.hasOwnProperty(name))
        continue;
      if (name === "parent")
        continue;
      let value2 = this[name];
      if (value2 instanceof Array) {
        fixed[name] = value2.map((i) => {
          if (typeof i === "object" && i.toJSON) {
            return i.toJSON();
          } else {
            return i;
          }
        });
      } else if (typeof value2 === "object" && value2.toJSON) {
        fixed[name] = value2.toJSON();
      } else {
        fixed[name] = value2;
      }
    }
    return fixed;
  }
  root() {
    let result2 = this;
    while (result2.parent)
      result2 = result2.parent;
    return result2;
  }
  cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween)
      delete this.raws.between;
  }
  positionInside(index) {
    let string2 = this.toString(), column = this.source.start.column, line = this.source.start.line;
    for (let i = 0; i < index; i++) {
      if (string2[i] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return { line, column };
  }
  positionBy(opts) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      let index = this.toString().indexOf(opts.word);
      if (index !== -1)
        pos = this.positionInside(index);
    }
    return pos;
  }
};
const Node$9 = node_1;
class Container$d extends Node$9 {
  constructor(opts) {
    super(opts);
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  push(child) {
    child.parent = this;
    this.nodes.push(child);
    return this;
  }
  each(callback) {
    if (!this.lastEach)
      this.lastEach = 0;
    if (!this.indexes)
      this.indexes = {};
    this.lastEach += 1;
    let id = this.lastEach, index, result2;
    this.indexes[id] = 0;
    if (!this.nodes)
      return void 0;
    while (this.indexes[id] < this.nodes.length) {
      index = this.indexes[id];
      result2 = callback(this.nodes[index], index);
      if (result2 === false)
        break;
      this.indexes[id] += 1;
    }
    delete this.indexes[id];
    return result2;
  }
  walk(callback) {
    return this.each((child, i) => {
      let result2 = callback(child, i);
      if (result2 !== false && child.walk) {
        result2 = child.walk(callback);
      }
      return result2;
    });
  }
  walkType(type, callback) {
    if (!type || !callback) {
      throw new Error("Parameters {type} and {callback} are required.");
    }
    type = type.name && type.prototype ? type.name : type;
    return this.walk((node, index) => {
      if (node.type === type) {
        return callback.call(this, node, index);
      }
    });
  }
  append(node) {
    node.parent = this;
    this.nodes.push(node);
    return this;
  }
  prepend(node) {
    node.parent = this;
    this.nodes.unshift(node);
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (let node of this.nodes)
        node.cleanRaws(keepBetween);
    }
  }
  insertAfter(oldNode, newNode) {
    let oldIndex = this.index(oldNode), index;
    this.nodes.splice(oldIndex + 1, 0, newNode);
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (oldIndex <= index) {
        this.indexes[id] = index + this.nodes.length;
      }
    }
    return this;
  }
  insertBefore(oldNode, newNode) {
    let oldIndex = this.index(oldNode), index;
    this.nodes.splice(oldIndex, 0, newNode);
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (oldIndex <= index) {
        this.indexes[id] = index + this.nodes.length;
      }
    }
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.nodes[child].parent = void 0;
    this.nodes.splice(child, 1);
    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (index >= child) {
        this.indexes[id] = index - 1;
      }
    }
    return this;
  }
  removeAll() {
    for (let node of this.nodes)
      node.parent = void 0;
    this.nodes = [];
    return this;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  some(condition) {
    return this.nodes.some(condition);
  }
  index(child) {
    if (typeof child === "number") {
      return child;
    } else {
      return this.nodes.indexOf(child);
    }
  }
  get first() {
    if (!this.nodes)
      return void 0;
    return this.nodes[0];
  }
  get last() {
    if (!this.nodes)
      return void 0;
    return this.nodes[this.nodes.length - 1];
  }
  toString() {
    let result2 = this.nodes.map(String).join("");
    if (this.value) {
      result2 = this.value + result2;
    }
    if (this.raws.before) {
      result2 = this.raws.before + result2;
    }
    if (this.raws.after) {
      result2 += this.raws.after;
    }
    return result2;
  }
}
Container$d.registerWalker = (constructor) => {
  let walkerName = "walk" + constructor.name;
  if (walkerName.lastIndexOf("s") !== walkerName.length - 1) {
    walkerName += "s";
  }
  if (Container$d.prototype[walkerName]) {
    return;
  }
  Container$d.prototype[walkerName] = function(callback) {
    return this.walkType(constructor, callback);
  };
};
var container = Container$d;
const Container$c = container;
var root = class Root extends Container$c {
  constructor(opts) {
    super(opts);
    this.type = "root";
  }
};
const Container$b = container;
var value = class Value extends Container$b {
  constructor(opts) {
    super(opts);
    this.type = "value";
    this.unbalanced = 0;
  }
};
const Container$a = container;
class AtWord$2 extends Container$a {
  constructor(opts) {
    super(opts);
    this.type = "atword";
  }
  toString() {
    this.quoted ? this.raws.quote : "";
    return [
      this.raws.before,
      "@",
      String.prototype.toString.call(this.value),
      this.raws.after
    ].join("");
  }
}
Container$a.registerWalker(AtWord$2);
var atword = AtWord$2;
const Container$9 = container;
const Node$8 = node_1;
class Colon$2 extends Node$8 {
  constructor(opts) {
    super(opts);
    this.type = "colon";
  }
}
Container$9.registerWalker(Colon$2);
var colon$1 = Colon$2;
const Container$8 = container;
const Node$7 = node_1;
class Comma$2 extends Node$7 {
  constructor(opts) {
    super(opts);
    this.type = "comma";
  }
}
Container$8.registerWalker(Comma$2);
var comma$1 = Comma$2;
const Container$7 = container;
const Node$6 = node_1;
class Comment$2 extends Node$6 {
  constructor(opts) {
    super(opts);
    this.type = "comment";
    this.inline = opts.inline || false;
  }
  toString() {
    return [
      this.raws.before,
      this.inline ? "//" : "/*",
      String(this.value),
      this.inline ? "" : "*/",
      this.raws.after
    ].join("");
  }
}
Container$7.registerWalker(Comment$2);
var comment = Comment$2;
const Container$6 = container;
class FunctionNode extends Container$6 {
  constructor(opts) {
    super(opts);
    this.type = "func";
    this.unbalanced = -1;
  }
}
Container$6.registerWalker(FunctionNode);
var _function = FunctionNode;
const Container$5 = container;
const Node$5 = node_1;
class NumberNode extends Node$5 {
  constructor(opts) {
    super(opts);
    this.type = "number";
    this.unit = opts.unit || "";
  }
  toString() {
    return [
      this.raws.before,
      String(this.value),
      this.unit,
      this.raws.after
    ].join("");
  }
}
Container$5.registerWalker(NumberNode);
var number = NumberNode;
const Container$4 = container;
const Node$4 = node_1;
class Operator$2 extends Node$4 {
  constructor(opts) {
    super(opts);
    this.type = "operator";
  }
}
Container$4.registerWalker(Operator$2);
var operator = Operator$2;
const Container$3 = container;
const Node$3 = node_1;
class Parenthesis extends Node$3 {
  constructor(opts) {
    super(opts);
    this.type = "paren";
    this.parenType = "";
  }
}
Container$3.registerWalker(Parenthesis);
var paren = Parenthesis;
const Container$2 = container;
const Node$2 = node_1;
class StringNode extends Node$2 {
  constructor(opts) {
    super(opts);
    this.type = "string";
  }
  toString() {
    let quote = this.quoted ? this.raws.quote : "";
    return [
      this.raws.before,
      quote,
      this.value + "",
      quote,
      this.raws.after
    ].join("");
  }
}
Container$2.registerWalker(StringNode);
var string = StringNode;
const Container$1 = container;
const Node$1 = node_1;
class Word$2 extends Node$1 {
  constructor(opts) {
    super(opts);
    this.type = "word";
  }
}
Container$1.registerWalker(Word$2);
var word = Word$2;
const Container = container;
const Node2 = node_1;
class UnicodeRange$2 extends Node2 {
  constructor(opts) {
    super(opts);
    this.type = "unicode-range";
  }
}
Container.registerWalker(UnicodeRange$2);
var unicodeRange$1 = UnicodeRange$2;
class TokenizeError$1 extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || "An error ocurred while tokzenizing.";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
var TokenizeError_1 = TokenizeError$1;
const openBracket = "{".charCodeAt(0);
const closeBracket = "}".charCodeAt(0);
const openParen = "(".charCodeAt(0);
const closeParen = ")".charCodeAt(0);
const singleQuote = "'".charCodeAt(0);
const doubleQuote = '"'.charCodeAt(0);
const backslash = "\\".charCodeAt(0);
const slash = "/".charCodeAt(0);
const period = ".".charCodeAt(0);
const comma = ",".charCodeAt(0);
const colon = ":".charCodeAt(0);
const asterisk = "*".charCodeAt(0);
const minus = "-".charCodeAt(0);
const plus = "+".charCodeAt(0);
const pound = "#".charCodeAt(0);
const newline = "\n".charCodeAt(0);
const space = " ".charCodeAt(0);
const feed = "\f".charCodeAt(0);
const tab = "	".charCodeAt(0);
const cr = "\r".charCodeAt(0);
const at = "@".charCodeAt(0);
const lowerE = "e".charCodeAt(0);
const upperE = "E".charCodeAt(0);
const digit0 = "0".charCodeAt(0);
const digit9 = "9".charCodeAt(0);
const lowerU = "u".charCodeAt(0);
const upperU = "U".charCodeAt(0);
const atEnd = /[ \n\t\r\{\(\)'"\\;,/]/g;
const wordEnd = /[ \n\t\r\(\)\{\}\*:;@!&'"\+\|~>,\[\]\\]|\/(?=\*)/g;
const wordEndNum = /[ \n\t\r\(\)\{\}\*:;@!&'"\-\+\|~>,\[\]\\]|\//g;
const alphaNum = /^[a-z0-9]/i;
const unicodeRange = /^[a-f0-9?\-]/i;
const util = require$$0;
const TokenizeError = TokenizeError_1;
var tokenize$1 = function tokenize(input2, options) {
  options = options || {};
  let tokens = [], css = input2.valueOf(), length = css.length, offset = -1, line = 1, pos = 0, parentCount = 0, isURLArg = null, code, next, quote, lines, last, content, nextLine, nextOffset, escaped, escapePos, nextChar;
  function unclosed(what) {
    let message = util.format("Unclosed %s at line: %d, column: %d, token: %d", what, line, pos - offset, pos);
    throw new TokenizeError(message);
  }
  while (pos < length) {
    code = css.charCodeAt(pos);
    if (code === newline) {
      offset = pos;
      line += 1;
    }
    switch (code) {
      case newline:
      case space:
      case tab:
      case cr:
      case feed:
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code === newline) {
            offset = next;
            line += 1;
          }
        } while (code === space || code === newline || code === tab || code === cr || code === feed);
        tokens.push([
          "space",
          css.slice(pos, next),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next - 1;
        break;
      case colon:
        next = pos + 1;
        tokens.push([
          "colon",
          css.slice(pos, next),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next - 1;
        break;
      case comma:
        next = pos + 1;
        tokens.push([
          "comma",
          css.slice(pos, next),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next - 1;
        break;
      case openBracket:
        tokens.push([
          "{",
          "{",
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        break;
      case closeBracket:
        tokens.push([
          "}",
          "}",
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        break;
      case openParen:
        parentCount++;
        isURLArg = !isURLArg && parentCount === 1 && tokens.length > 0 && tokens[tokens.length - 1][0] === "word" && tokens[tokens.length - 1][1] === "url";
        tokens.push([
          "(",
          "(",
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        break;
      case closeParen:
        parentCount--;
        isURLArg = !isURLArg && parentCount === 1;
        tokens.push([
          ")",
          ")",
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        break;
      case singleQuote:
      case doubleQuote:
        quote = code === singleQuote ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            unclosed("quote");
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === backslash) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        tokens.push([
          "string",
          css.slice(pos, next + 1),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next;
        break;
      case at:
        atEnd.lastIndex = pos + 1;
        atEnd.test(css);
        if (atEnd.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = atEnd.lastIndex - 2;
        }
        tokens.push([
          "atword",
          css.slice(pos, next + 1),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next;
        break;
      case backslash:
        next = pos;
        code = css.charCodeAt(next + 1);
        tokens.push([
          "word",
          css.slice(pos, next + 1),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next;
        break;
      case plus:
      case minus:
      case asterisk:
        next = pos + 1;
        nextChar = css.slice(pos + 1, next + 1);
        css.slice(pos - 1, pos);
        if (code === minus && nextChar.charCodeAt(0) === minus) {
          next++;
          tokens.push([
            "word",
            css.slice(pos, next),
            line,
            pos - offset,
            line,
            next - offset,
            pos
          ]);
          pos = next - 1;
          break;
        }
        tokens.push([
          "operator",
          css.slice(pos, next),
          line,
          pos - offset,
          line,
          next - offset,
          pos
        ]);
        pos = next - 1;
        break;
      default:
        if (code === slash && (css.charCodeAt(pos + 1) === asterisk || options.loose && !isURLArg && css.charCodeAt(pos + 1) === slash)) {
          const isStandardComment = css.charCodeAt(pos + 1) === asterisk;
          if (isStandardComment) {
            next = css.indexOf("*/", pos + 2) + 1;
            if (next === 0) {
              unclosed("comment");
            }
          } else {
            const newlinePos = css.indexOf("\n", pos + 2);
            next = newlinePos !== -1 ? newlinePos - 1 : length;
          }
          content = css.slice(pos, next + 1);
          lines = content.split("\n");
          last = lines.length - 1;
          if (last > 0) {
            nextLine = line + last;
            nextOffset = next - lines[last].length;
          } else {
            nextLine = line;
            nextOffset = offset;
          }
          tokens.push([
            "comment",
            content,
            line,
            pos - offset,
            nextLine,
            next - nextOffset,
            pos
          ]);
          offset = nextOffset;
          line = nextLine;
          pos = next;
        } else if (code === pound && !alphaNum.test(css.slice(pos + 1, pos + 2))) {
          next = pos + 1;
          tokens.push([
            "#",
            css.slice(pos, next),
            line,
            pos - offset,
            line,
            next - offset,
            pos
          ]);
          pos = next - 1;
        } else if ((code === lowerU || code === upperU) && css.charCodeAt(pos + 1) === plus) {
          next = pos + 2;
          do {
            next += 1;
            code = css.charCodeAt(next);
          } while (next < length && unicodeRange.test(css.slice(next, next + 1)));
          tokens.push([
            "unicoderange",
            css.slice(pos, next),
            line,
            pos - offset,
            line,
            next - offset,
            pos
          ]);
          pos = next - 1;
        } else if (code === slash) {
          next = pos + 1;
          tokens.push([
            "operator",
            css.slice(pos, next),
            line,
            pos - offset,
            line,
            next - offset,
            pos
          ]);
          pos = next - 1;
        } else {
          let regex = wordEnd;
          if (code >= digit0 && code <= digit9) {
            regex = wordEndNum;
          }
          regex.lastIndex = pos + 1;
          regex.test(css);
          if (regex.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = regex.lastIndex - 2;
          }
          if (regex === wordEndNum || code === period) {
            let ncode = css.charCodeAt(next), ncode1 = css.charCodeAt(next + 1), ncode2 = css.charCodeAt(next + 2);
            if ((ncode === lowerE || ncode === upperE) && (ncode1 === minus || ncode1 === plus) && (ncode2 >= digit0 && ncode2 <= digit9)) {
              wordEndNum.lastIndex = next + 2;
              wordEndNum.test(css);
              if (wordEndNum.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = wordEndNum.lastIndex - 2;
              }
            }
          }
          tokens.push([
            "word",
            css.slice(pos, next + 1),
            line,
            pos - offset,
            line,
            next - offset,
            pos
          ]);
          pos = next;
        }
        break;
    }
    pos++;
  }
  return tokens;
};
var flatten$1 = function flatten(list2, depth) {
  depth = typeof depth == "number" ? depth : Infinity;
  if (!depth) {
    if (Array.isArray(list2)) {
      return list2.map(function(i) {
        return i;
      });
    }
    return list2;
  }
  return _flatten(list2, 1);
  function _flatten(list3, d) {
    return list3.reduce(function(acc, item) {
      if (Array.isArray(item) && d < depth) {
        return acc.concat(_flatten(item, d + 1));
      } else {
        return acc.concat(item);
      }
    }, []);
  }
};
var indexesOf$1 = function(ary, item) {
  var i = -1, indexes = [];
  while ((i = ary.indexOf(item, i + 1)) !== -1)
    indexes.push(i);
  return indexes;
};
function unique_pred(list2, compare) {
  var ptr = 1, len = list2.length, a = list2[0], b = list2[0];
  for (var i = 1; i < len; ++i) {
    b = a;
    a = list2[i];
    if (compare(a, b)) {
      if (i === ptr) {
        ptr++;
        continue;
      }
      list2[ptr++] = a;
    }
  }
  list2.length = ptr;
  return list2;
}
function unique_eq(list2) {
  var ptr = 1, len = list2.length, a = list2[0], b = list2[0];
  for (var i = 1; i < len; ++i, b = a) {
    b = a;
    a = list2[i];
    if (a !== b) {
      if (i === ptr) {
        ptr++;
        continue;
      }
      list2[ptr++] = a;
    }
  }
  list2.length = ptr;
  return list2;
}
function unique(list2, compare, sorted) {
  if (list2.length === 0) {
    return list2;
  }
  if (compare) {
    if (!sorted) {
      list2.sort(compare);
    }
    return unique_pred(list2, compare);
  }
  if (!sorted) {
    list2.sort();
  }
  return unique_eq(list2);
}
var uniq$2 = unique;
class ParserError$1 extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || "An error ocurred while parsing.";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
var ParserError_1 = ParserError$1;
const Root2 = root;
const Value$1 = value;
const AtWord$1 = atword;
const Colon$1 = colon$1;
const Comma$1 = comma$1;
const Comment$1 = comment;
const Func$1 = _function;
const Numbr = number;
const Operator$1 = operator;
const Paren$1 = paren;
const Str$1 = string;
const Word$1 = word;
const UnicodeRange$1 = unicodeRange$1;
const tokenize2 = tokenize$1;
const flatten2 = flatten$1;
const indexesOf = indexesOf$1;
const uniq$1 = uniq$2;
const ParserError = ParserError_1;
function sortAscending(list2) {
  return list2.sort((a, b) => a - b);
}
var parser$1 = class Parser {
  constructor(input2, options) {
    const defaults = { loose: false };
    this.cache = [];
    this.input = input2;
    this.options = Object.assign({}, defaults, options);
    this.position = 0;
    this.unbalanced = 0;
    this.root = new Root2();
    let value2 = new Value$1();
    this.root.append(value2);
    this.current = value2;
    this.tokens = tokenize2(input2, this.options);
  }
  parse() {
    return this.loop();
  }
  colon() {
    let token = this.currToken;
    this.newNode(new Colon$1({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));
    this.position++;
  }
  comma() {
    let token = this.currToken;
    this.newNode(new Comma$1({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));
    this.position++;
  }
  comment() {
    let inline = false, value2 = this.currToken[1].replace(/\/\*|\*\//g, ""), node;
    if (this.options.loose && value2.startsWith("//")) {
      value2 = value2.substring(2);
      inline = true;
    }
    node = new Comment$1({
      value: value2,
      inline,
      source: {
        start: {
          line: this.currToken[2],
          column: this.currToken[3]
        },
        end: {
          line: this.currToken[4],
          column: this.currToken[5]
        }
      },
      sourceIndex: this.currToken[6]
    });
    this.newNode(node);
    this.position++;
  }
  error(message, token) {
    throw new ParserError(message + ` at line: ${token[2]}, column ${token[3]}`);
  }
  loop() {
    while (this.position < this.tokens.length) {
      this.parseTokens();
    }
    if (!this.current.last && this.spaces) {
      this.current.raws.before += this.spaces;
    } else if (this.spaces) {
      this.current.last.raws.after += this.spaces;
    }
    this.spaces = "";
    return this.root;
  }
  operator() {
    let char = this.currToken[1], node;
    if (char === "+" || char === "-") {
      if (!this.options.loose) {
        if (this.position > 0) {
          if (this.current.type === "func" && this.current.value === "calc") {
            if (this.prevToken[0] !== "space" && this.prevToken[0] !== "(") {
              this.error("Syntax Error", this.currToken);
            } else if (this.nextToken[0] !== "space" && this.nextToken[0] !== "word") {
              this.error("Syntax Error", this.currToken);
            } else if (this.nextToken[0] === "word" && this.current.last.type !== "operator" && this.current.last.value !== "(") {
              this.error("Syntax Error", this.currToken);
            }
          } else if (this.nextToken[0] === "space" || this.nextToken[0] === "operator" || this.prevToken[0] === "operator") {
            this.error("Syntax Error", this.currToken);
          }
        }
      }
      if (!this.options.loose) {
        if (this.nextToken[0] === "word") {
          return this.word();
        }
      } else {
        if ((!this.current.nodes.length || this.current.last && this.current.last.type === "operator") && this.nextToken[0] === "word") {
          return this.word();
        }
      }
    }
    node = new Operator$1({
      value: this.currToken[1],
      source: {
        start: {
          line: this.currToken[2],
          column: this.currToken[3]
        },
        end: {
          line: this.currToken[2],
          column: this.currToken[3]
        }
      },
      sourceIndex: this.currToken[4]
    });
    this.position++;
    return this.newNode(node);
  }
  parseTokens() {
    switch (this.currToken[0]) {
      case "space":
        this.space();
        break;
      case "colon":
        this.colon();
        break;
      case "comma":
        this.comma();
        break;
      case "comment":
        this.comment();
        break;
      case "(":
        this.parenOpen();
        break;
      case ")":
        this.parenClose();
        break;
      case "atword":
      case "word":
        this.word();
        break;
      case "operator":
        this.operator();
        break;
      case "string":
        this.string();
        break;
      case "unicoderange":
        this.unicodeRange();
        break;
      default:
        this.word();
        break;
    }
  }
  parenOpen() {
    let unbalanced = 1, pos = this.position + 1, token = this.currToken, last;
    while (pos < this.tokens.length && unbalanced) {
      let tkn = this.tokens[pos];
      if (tkn[0] === "(") {
        unbalanced++;
      }
      if (tkn[0] === ")") {
        unbalanced--;
      }
      pos++;
    }
    if (unbalanced) {
      this.error("Expected closing parenthesis", token);
    }
    last = this.current.last;
    if (last && last.type === "func" && last.unbalanced < 0) {
      last.unbalanced = 0;
      this.current = last;
    }
    this.current.unbalanced++;
    this.newNode(new Paren$1({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));
    this.position++;
    if (this.current.type === "func" && this.current.unbalanced && this.current.value === "url" && this.currToken[0] !== "string" && this.currToken[0] !== ")" && !this.options.loose) {
      let nextToken = this.nextToken, value2 = this.currToken[1], start = {
        line: this.currToken[2],
        column: this.currToken[3]
      };
      while (nextToken && nextToken[0] !== ")" && this.current.unbalanced) {
        this.position++;
        value2 += this.currToken[1];
        nextToken = this.nextToken;
      }
      if (this.position !== this.tokens.length - 1) {
        this.position++;
        this.newNode(new Word$1({
          value: value2,
          source: {
            start,
            end: {
              line: this.currToken[4],
              column: this.currToken[5]
            }
          },
          sourceIndex: this.currToken[6]
        }));
      }
    }
  }
  parenClose() {
    let token = this.currToken;
    this.newNode(new Paren$1({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));
    this.position++;
    if (this.position >= this.tokens.length - 1 && !this.current.unbalanced) {
      return;
    }
    this.current.unbalanced--;
    if (this.current.unbalanced < 0) {
      this.error("Expected opening parenthesis", token);
    }
    if (!this.current.unbalanced && this.cache.length) {
      this.current = this.cache.pop();
    }
  }
  space() {
    let token = this.currToken;
    if (this.position === this.tokens.length - 1 || this.nextToken[0] === "," || this.nextToken[0] === ")") {
      this.current.last.raws.after += token[1];
      this.position++;
    } else {
      this.spaces = token[1];
      this.position++;
    }
  }
  unicodeRange() {
    let token = this.currToken;
    this.newNode(new UnicodeRange$1({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));
    this.position++;
  }
  splitWord() {
    let nextToken = this.nextToken, word2 = this.currToken[1], rNumber = /^[\+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][\+\-]?\d+)?/, rNoFollow = /^(?!\#([a-z0-9]+))[\#\{\}]/gi, hasAt, indices;
    if (!rNoFollow.test(word2)) {
      while (nextToken && nextToken[0] === "word") {
        this.position++;
        let current = this.currToken[1];
        word2 += current;
        nextToken = this.nextToken;
      }
    }
    hasAt = indexesOf(word2, "@");
    indices = sortAscending(uniq$1(flatten2([[0], hasAt])));
    indices.forEach((ind, i) => {
      let index = indices[i + 1] || word2.length, value2 = word2.slice(ind, index), node;
      if (~hasAt.indexOf(ind)) {
        node = new AtWord$1({
          value: value2.slice(1),
          source: {
            start: {
              line: this.currToken[2],
              column: this.currToken[3] + ind
            },
            end: {
              line: this.currToken[4],
              column: this.currToken[3] + (index - 1)
            }
          },
          sourceIndex: this.currToken[6] + indices[i]
        });
      } else if (rNumber.test(this.currToken[1])) {
        let unit = value2.replace(rNumber, "");
        node = new Numbr({
          value: value2.replace(unit, ""),
          source: {
            start: {
              line: this.currToken[2],
              column: this.currToken[3] + ind
            },
            end: {
              line: this.currToken[4],
              column: this.currToken[3] + (index - 1)
            }
          },
          sourceIndex: this.currToken[6] + indices[i],
          unit
        });
      } else {
        node = new (nextToken && nextToken[0] === "(" ? Func$1 : Word$1)({
          value: value2,
          source: {
            start: {
              line: this.currToken[2],
              column: this.currToken[3] + ind
            },
            end: {
              line: this.currToken[4],
              column: this.currToken[3] + (index - 1)
            }
          },
          sourceIndex: this.currToken[6] + indices[i]
        });
        if (node.constructor.name === "Word") {
          node.isHex = /^#(.+)/.test(value2);
          node.isColor = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value2);
        } else {
          this.cache.push(this.current);
        }
      }
      this.newNode(node);
    });
    this.position++;
  }
  string() {
    let token = this.currToken, value2 = this.currToken[1], rQuote = /^(\"|\')/, quoted = rQuote.test(value2), quote = "", node;
    if (quoted) {
      quote = value2.match(rQuote)[0];
      value2 = value2.slice(1, value2.length - 1);
    }
    node = new Str$1({
      value: value2,
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6],
      quoted
    });
    node.raws.quote = quote;
    this.newNode(node);
    this.position++;
  }
  word() {
    return this.splitWord();
  }
  newNode(node) {
    if (this.spaces) {
      node.raws.before += this.spaces;
      this.spaces = "";
    }
    return this.current.append(node);
  }
  get currToken() {
    return this.tokens[this.position];
  }
  get nextToken() {
    return this.tokens[this.position + 1];
  }
  get prevToken() {
    return this.tokens[this.position - 1];
  }
};
const Parser2 = parser$1;
const AtWord = atword;
const Colon = colon$1;
const Comma = comma$1;
const Comment = comment;
const Func = _function;
const Num = number;
const Operator = operator;
const Paren = paren;
const Str = string;
const UnicodeRange = unicodeRange$1;
const Value2 = value;
const Word = word;
let parser = function(source, options) {
  return new Parser2(source, options);
};
parser.atword = function(opts) {
  return new AtWord(opts);
};
parser.colon = function(opts) {
  opts.value = opts.value || ":";
  return new Colon(opts);
};
parser.comma = function(opts) {
  opts.value = opts.value || ",";
  return new Comma(opts);
};
parser.comment = function(opts) {
  return new Comment(opts);
};
parser.func = function(opts) {
  return new Func(opts);
};
parser.number = function(opts) {
  return new Num(opts);
};
parser.operator = function(opts) {
  return new Operator(opts);
};
parser.paren = function(opts) {
  opts.value = opts.value || "(";
  return new Paren(opts);
};
parser.string = function(opts) {
  opts.quote = opts.quote || "'";
  return new Str(opts);
};
parser.value = function(opts) {
  return new Value2(opts);
};
parser.word = function(opts) {
  return new Word(opts);
};
parser.unicodeRange = function(opts) {
  return new UnicodeRange(opts);
};
var lib = parser;
var relativeToAbsoluteIri = {};
var Resolve = {};
Object.defineProperty(Resolve, "__esModule", { value: true });
function resolve(relativeIRI, baseIRI) {
  baseIRI = baseIRI || "";
  const baseFragmentPos = baseIRI.indexOf("#");
  if (baseFragmentPos > 0) {
    baseIRI = baseIRI.substr(0, baseFragmentPos);
  }
  if (!relativeIRI.length) {
    if (baseIRI.indexOf(":") < 0) {
      throw new Error(`Found invalid baseIRI '${baseIRI}' for value '${relativeIRI}'`);
    }
    return baseIRI;
  }
  if (relativeIRI.startsWith("?")) {
    const baseQueryPos = baseIRI.indexOf("?");
    if (baseQueryPos > 0) {
      baseIRI = baseIRI.substr(0, baseQueryPos);
    }
    return baseIRI + relativeIRI;
  }
  if (relativeIRI.startsWith("#")) {
    return baseIRI + relativeIRI;
  }
  if (!baseIRI.length) {
    const relativeColonPos = relativeIRI.indexOf(":");
    if (relativeColonPos < 0) {
      throw new Error(`Found invalid relative IRI '${relativeIRI}' for a missing baseIRI`);
    }
    return removeDotSegmentsOfPath(relativeIRI, relativeColonPos);
  }
  const valueColonPos = relativeIRI.indexOf(":");
  if (valueColonPos >= 0) {
    return removeDotSegmentsOfPath(relativeIRI, valueColonPos);
  }
  const baseColonPos = baseIRI.indexOf(":");
  if (baseColonPos < 0) {
    throw new Error(`Found invalid baseIRI '${baseIRI}' for value '${relativeIRI}'`);
  }
  const baseIRIScheme = baseIRI.substr(0, baseColonPos + 1);
  if (relativeIRI.indexOf("//") === 0) {
    return baseIRIScheme + removeDotSegmentsOfPath(relativeIRI, valueColonPos);
  }
  let baseSlashAfterColonPos;
  if (baseIRI.indexOf("//", baseColonPos) === baseColonPos + 1) {
    baseSlashAfterColonPos = baseIRI.indexOf("/", baseColonPos + 3);
    if (baseSlashAfterColonPos < 0) {
      if (baseIRI.length > baseColonPos + 3) {
        return baseIRI + "/" + removeDotSegmentsOfPath(relativeIRI, valueColonPos);
      } else {
        return baseIRIScheme + removeDotSegmentsOfPath(relativeIRI, valueColonPos);
      }
    }
  } else {
    baseSlashAfterColonPos = baseIRI.indexOf("/", baseColonPos + 1);
    if (baseSlashAfterColonPos < 0) {
      return baseIRIScheme + removeDotSegmentsOfPath(relativeIRI, valueColonPos);
    }
  }
  if (relativeIRI.indexOf("/") === 0) {
    return baseIRI.substr(0, baseSlashAfterColonPos) + removeDotSegments(relativeIRI);
  }
  let baseIRIPath = baseIRI.substr(baseSlashAfterColonPos);
  const baseIRILastSlashPos = baseIRIPath.lastIndexOf("/");
  if (baseIRILastSlashPos >= 0 && baseIRILastSlashPos < baseIRIPath.length - 1) {
    baseIRIPath = baseIRIPath.substr(0, baseIRILastSlashPos + 1);
    if (relativeIRI[0] === "." && relativeIRI[1] !== "." && relativeIRI[1] !== "/" && relativeIRI[2]) {
      relativeIRI = relativeIRI.substr(1);
    }
  }
  relativeIRI = baseIRIPath + relativeIRI;
  relativeIRI = removeDotSegments(relativeIRI);
  return baseIRI.substr(0, baseSlashAfterColonPos) + relativeIRI;
}
Resolve.resolve = resolve;
function removeDotSegments(path) {
  const segmentBuffers = [];
  let i = 0;
  while (i < path.length) {
    switch (path[i]) {
      case "/":
        if (path[i + 1] === ".") {
          if (path[i + 2] === ".") {
            if (!isCharacterAllowedAfterRelativePathSegment(path[i + 3])) {
              segmentBuffers.push([]);
              i++;
              break;
            }
            segmentBuffers.pop();
            if (!path[i + 3]) {
              segmentBuffers.push([]);
            }
            i += 3;
          } else {
            if (!isCharacterAllowedAfterRelativePathSegment(path[i + 2])) {
              segmentBuffers.push([]);
              i++;
              break;
            }
            if (!path[i + 2]) {
              segmentBuffers.push([]);
            }
            i += 2;
          }
        } else {
          segmentBuffers.push([]);
          i++;
        }
        break;
      case "#":
      case "?":
        if (!segmentBuffers.length) {
          segmentBuffers.push([]);
        }
        segmentBuffers[segmentBuffers.length - 1].push(path.substr(i));
        i = path.length;
        break;
      default:
        if (!segmentBuffers.length) {
          segmentBuffers.push([]);
        }
        segmentBuffers[segmentBuffers.length - 1].push(path[i]);
        i++;
        break;
    }
  }
  return "/" + segmentBuffers.map((buffer) => buffer.join("")).join("/");
}
Resolve.removeDotSegments = removeDotSegments;
function removeDotSegmentsOfPath(iri, colonPosition) {
  let searchOffset = colonPosition + 1;
  if (colonPosition >= 0) {
    if (iri[colonPosition + 1] === "/" && iri[colonPosition + 2] === "/") {
      searchOffset = colonPosition + 3;
    }
  } else {
    if (iri[0] === "/" && iri[1] === "/") {
      searchOffset = 2;
    }
  }
  const pathSeparator = iri.indexOf("/", searchOffset);
  if (pathSeparator < 0) {
    return iri;
  }
  const base = iri.substr(0, pathSeparator);
  const path = iri.substr(pathSeparator);
  return base + removeDotSegments(path);
}
Resolve.removeDotSegmentsOfPath = removeDotSegmentsOfPath;
function isCharacterAllowedAfterRelativePathSegment(character) {
  return !character || character === "#" || character === "?" || character === "/";
}
(function(exports) {
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  __export(Resolve);
})(relativeToAbsoluteIri);
async function blobToDataUrl(blob, config = {}) {
  const glob = config.glob || globalThis;
  const binaryString = await new Promise((resolve2, reject) => {
    const reader = new glob.FileReader();
    reader.onload = () => resolve2(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(blob);
  });
  const dataUrl = `data:${blob.type};base64,${glob.btoa(binaryString)}`;
  return dataUrl;
}
async function blobToText(blob, config = {}) {
  const text = await new Promise((resolve2, reject) => {
    const glob = config.glob || globalThis;
    const reader = new glob.FileReader();
    reader.onload = () => resolve2(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
  return text;
}
function removeScripts(docOrElement, config = {}) {
  const rootElement = "documentElement" in docOrElement ? docOrElement.documentElement : docOrElement;
  removeScriptElements(rootElement);
  removeEventHandlers(rootElement);
  removeJavascriptHrefs(rootElement, config);
}
function removeScriptElements(rootElement) {
  const scripts = Array.from(rootElement.querySelectorAll("script"));
  scripts.forEach((element) => {
    var _a;
    return (_a = element.parentNode) == null ? void 0 : _a.removeChild(element);
  });
}
function removeEventHandlers(rootElement) {
  const elements = Array.from(rootElement.querySelectorAll("*"));
  elements.forEach((element) => {
    Array.from(element.attributes).filter((attribute) => attribute.name.toLowerCase().startsWith("on")).forEach((attribute) => {
      element.removeAttribute(attribute.name);
    });
  });
}
function removeJavascriptHrefs(rootElement, config = {}) {
  const glob = config.glob || globalThis;
  const linkElements = Array.from(rootElement.querySelectorAll("a, area")).filter((element) => element instanceof glob.HTMLElement);
  linkElements.filter((element) => element.href.startsWith("javascript:")).forEach((element) => {
    element.setAttribute("href", "javascript:");
  });
}
function makeDomStatic(doc, config = {}) {
  removeScripts(doc, config);
  removeNoscript(doc);
  removeContentEditable(doc, config);
}
function removeNoscript(doc) {
  const noscripts = Array.from(doc.querySelectorAll("noscript"));
  noscripts.forEach((element) => {
    var _a;
    return (_a = element.parentNode) == null ? void 0 : _a.removeChild(element);
  });
}
function removeContentEditable(doc, config = {}) {
  const glob = config.glob || globalThis;
  const editableElements = Array.from(doc.querySelectorAll("*[contenteditable]")).filter((element) => element instanceof glob.HTMLElement);
  editableElements.forEach((element) => {
    element.contentEditable = "false";
  });
}
function setCharsetDeclaration(doc, charsetDeclaration) {
  if (!doc.head) {
    const head = doc.createElement("head");
    doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
  }
  const existingElements = doc.head.querySelectorAll("meta[charset]");
  existingElements.forEach((element) => {
    var _a;
    return (_a = element.parentNode) == null ? void 0 : _a.removeChild(element);
  });
  if (charsetDeclaration !== null && charsetDeclaration !== "") {
    const metaEl = doc.createElement("meta");
    metaEl.setAttribute("charset", charsetDeclaration);
    doc.head.insertBefore(metaEl, doc.head.firstChild);
  }
}
function setContentSecurityPolicy(doc, csp) {
  const cspString = cspToString(csp);
  if (!doc.head) {
    const head = doc.createElement("head");
    doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
  }
  const existingCsps = doc.head.querySelectorAll("meta[http-equiv=Content-Security-Policy i]");
  existingCsps.forEach((element) => {
    var _a;
    return (_a = element.parentNode) == null ? void 0 : _a.removeChild(element);
  });
  const cspMetaEl = doc.createElement("meta");
  cspMetaEl.setAttribute("http-equiv", "Content-Security-Policy");
  cspMetaEl.setAttribute("content", cspString);
  doc.head.insertBefore(cspMetaEl, doc.head.firstChild);
  const querySelector = "meta[charset], meta[http-equiv=Content-Type i]";
  const charsetMetaEl = doc.head.querySelector(querySelector);
  if (charsetMetaEl) {
    doc.head.insertBefore(charsetMetaEl, cspMetaEl);
  }
  doc.documentElement.removeAttribute("manifest");
  doc.head.removeAttribute("profile");
}
function cspToString(csp) {
  if (typeof csp === "string")
    return csp;
  function sourcesToString(sources) {
    if (sources === void 0 || sources === null)
      return "";
    if (typeof sources === "string")
      return sources;
    return sources.join(" ");
  }
  return Object.entries(csp).map(([directive, sources]) => `${directive} ${sourcesToString(sources)}`).join("; ");
}
function setMementoTags(doc, {
  originalUrl,
  datetime
}) {
  if (!doc.head) {
    const head = doc.createElement("head");
    doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
  }
  if (originalUrl) {
    const linkEl = doc.createElement("link");
    linkEl.setAttribute("rel", "original");
    linkEl.setAttribute("href", originalUrl);
    doc.head.insertBefore(linkEl, doc.head.firstChild);
  }
  if (datetime) {
    const metaEl = doc.createElement("meta");
    metaEl.setAttribute("http-equiv", "Memento-Datetime");
    metaEl.setAttribute("content", datetimeToString(datetime));
    doc.head.insertBefore(metaEl, doc.head.firstChild);
  }
}
function datetimeToString(datetime) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const zeropad = (l) => (n) => `${n}`.padStart(l, "0");
  const datetimeString = weekdays[datetime.getUTCDay()] + ", " + zeropad(2)(datetime.getUTCDate()) + " " + months[datetime.getUTCMonth()] + " " + zeropad(4)(datetime.getUTCFullYear()) + " " + zeropad(2)(datetime.getUTCHours()) + ":" + zeropad(2)(datetime.getUTCMinutes()) + ":" + zeropad(2)(datetime.getUTCSeconds()) + " GMT";
  return datetimeString;
}
function setLinkTarget(link, target, config = {}) {
  var _a;
  if (isHtmlAttributeDefinedLink(link) && config.rememberOriginalUrls) {
    const noteAttribute = `data-original-${link.from.attribute}`;
    if (!link.from.element.hasAttribute(noteAttribute)) {
      const originalValue = (_a = link.from.element.getAttribute(link.from.attribute)) != null ? _a : "";
      link.from.element.setAttribute(noteAttribute, originalValue);
    }
  }
  link.target = target;
  if (isHtmlAttributeDefinedLink(link) && link.from.element.hasAttribute("integrity")) {
    link.from.element.removeAttribute("integrity");
  }
}
function isHtmlAttributeDefinedLink(link) {
  const from = link.from;
  return from.element !== void 0 && from.attribute !== void 0;
}
class Resource {
  get subresourceLinks() {
    return this.links.filter((link) => link.isSubresource).filter((link) => Resource.getResourceClass(link.subresourceType));
  }
  async processSubresources(processSubresource) {
    async function processSubresourceWrapper(link) {
      await processSubresource(link, processSubresourceWrapper);
    }
    await Promise.all(this.subresourceLinks.map((link) => processSubresourceWrapper(link)));
  }
  dry() {
    this.makeLinksAbsolute();
  }
  makeLinksAbsolute() {
    this.links.forEach((link) => {
      const absoluteTarget = link.absoluteTarget;
      if (absoluteTarget === void 0)
        return;
      const targetHash = absoluteTarget.includes("#") ? absoluteTarget.substring(absoluteTarget.indexOf("#")) : void 0;
      const urlWithoutHash = (url) => url.split("#")[0];
      if (targetHash && urlWithoutHash(absoluteTarget) === urlWithoutHash(this.url)) {
        link.target = targetHash;
      } else {
        link.target = absoluteTarget;
      }
    });
  }
  static async fromLink(link, config = {}) {
    if (link.absoluteTarget === void 0) {
      throw new Error(`Cannot fetch invalid target: ${link.target}`);
    }
    const targetUrl = link.absoluteTarget;
    const glob = config.glob || globalThis;
    const fetchFunction = config.fetchResource || glob.fetch;
    const resourceOrResponse = await fetchFunction(targetUrl, {
      cache: "force-cache",
      redirect: "follow",
      signal: config.signal
    });
    const blob = typeof resourceOrResponse.blob === "function" ? await resourceOrResponse.blob() : resourceOrResponse.blob;
    const finalUrl = resourceOrResponse.url;
    return await Resource.fromBlob({
      blob,
      url: finalUrl,
      subresourceType: link.subresourceType,
      config
    });
  }
  static async fromBlob({ blob, url, subresourceType, config }) {
    const resourceClass = this.getResourceClass(subresourceType);
    if (resourceClass === void 0) {
      throw new Error(`Not sure how to interpret resource of type '${subresourceType}'`);
    }
    const resource = await resourceClass.fromBlob({ blob, url, config });
    return resource;
  }
  static getResourceClass(subresourceType) {
    const resourceClasses = {
      document: DomResource,
      style: StylesheetResource,
      image: LeafResource,
      video: LeafResource,
      font: LeafResource
    };
    if (subresourceType === void 0) {
      return void 0;
    }
    return resourceClasses[subresourceType];
  }
}
function tryParseUrl(url, baseUrl) {
  try {
    return relativeToAbsoluteIri.resolve(url, baseUrl);
  } catch (err) {
    return void 0;
  }
}
const parsedView = (parse2) => (value2) => {
  const parsedValue = parse2(value2);
  const tokens = [];
  const glueStrings = [];
  let start = 0;
  for (const { token, index, note } of parsedValue) {
    glueStrings.push(value2.substring(start, index));
    tokens.push({
      token,
      get index() {
        return index;
      },
      get note() {
        return note;
      }
    });
    start = index + token.length;
  }
  glueStrings.push(value2.substring(start));
  tokens.toString = () => {
    let newValue = glueStrings[0];
    tokens.forEach(({ token }, i) => {
      newValue += token + glueStrings[i + 1];
    });
    return newValue;
  };
  return tokens;
};
const syncingParsedView = ({ parse: parse2, get: get2, set }) => deepSyncingProxy(transformingCache({
  get: get2,
  set,
  transform: parsedView(parse2),
  untransform: (stringView) => stringView.toString()
}));
function transformingCache({
  get: get2,
  set,
  transform,
  untransform,
  isEqual: isEqual2 = (a, b) => a === b
}) {
  const uninitialised = Symbol("uninitialised");
  let lastValue = uninitialised;
  let lastTransformedValue = uninitialised;
  return {
    get() {
      const newValue = get2();
      if (lastValue === uninitialised || !isEqual2(newValue, lastValue) || lastTransformedValue === uninitialised) {
        lastTransformedValue = transform(newValue);
      }
      lastValue = newValue;
      return lastTransformedValue;
    },
    set(transformedValue, { trustCache = false } = {}) {
      const newValue = untransform(transformedValue);
      const currentValue = trustCache ? lastValue : get2();
      if (currentValue === uninitialised || !isEqual2(newValue, currentValue)) {
        set(newValue);
      }
      lastValue = newValue;
      lastTransformedValue = transformedValue;
    }
  };
}
function deepSyncingProxy({ get: get2, set, alwaysSet = false }) {
  let rootObject;
  const getRootObject = () => {
    rootObject = get2();
  };
  const writeBack = () => {
    set(rootObject);
  };
  function createProxy(object, path) {
    const { proxy, setTarget } = build(object);
    const refreshProxyTarget = () => {
      getRootObject();
      if (!isNonNullObject(rootObject))
        throw new TypeError(`Expected get()${path} to be an object, but get() is ${rootObject}.`);
      let targetWalker = rootObject;
      const properties = path.split(".").slice(1);
      for (let i = 0; i < properties.length; i++) {
        const child = targetWalker[properties[i]];
        if (!isNonNullObject(child)) {
          const pathSoFar = "." + properties.slice(0, i + 1).join(".");
          throw new TypeError(`Expected get()${path} to be an object, but get()${pathSoFar} is ${child}.`);
        }
        targetWalker = child;
      }
      setTarget(targetWalker);
    };
    const writeBackIfMutating = (method, args) => {
      if (modifyingOperations.includes(method)) {
        writeBack();
      }
    };
    const afterHook = alwaysSet ? writeBack : writeBackIfMutating;
    return makeListenerProxy(refreshProxyTarget, afterHook)(proxy);
  }
  const initialRootObject = get2();
  return deepProxy(createProxy)(initialRootObject);
}
function isNonNullObject(value2) {
  return typeof value2 === "object" && value2 !== null;
}
const modifyingOperations = [
  "set",
  "delete",
  "defineProperty",
  "deleteProperty",
  "preventExtensions",
  "setPrototypeOf"
];
function makeListenerProxy(before = () => {
}, after = () => {
}) {
  return (object) => {
    const handler = Object.assign({}, ...Object.getOwnPropertyNames(Reflect).map((method) => ({
      [method](...args) {
        before(method, args);
        const result2 = Reflect[method].apply(null, args);
        after(method, args);
        return result2;
      }
    })));
    return new Proxy(object, handler);
  };
}
function deepProxy(createProxy) {
  let createDeepProxy = (object, path) => {
    const target = createProxy(object, path);
    return new Proxy(target, {
      get(target2, property, receiver) {
        const value2 = Reflect.get(target2, property, receiver);
        if (value2 instanceof Object && target2.hasOwnProperty(property) && typeof property === "string") {
          const innerProxy = createDeepProxy(value2, `${path}.${property}`);
          return innerProxy;
        } else {
          return value2;
        }
      }
    });
  };
  createDeepProxy = memoizeWeak(createDeepProxy);
  return (object) => createDeepProxy(object, "");
}
function findLinksInCss(parsedCss, baseUrl) {
  const links = [];
  parsedCss.walkAtRules("import", (atRule2) => {
    var _a;
    let valueAst;
    try {
      valueAst = lib(atRule2.params).parse();
    } catch (err) {
      return;
    }
    let maybeUrlNode;
    const firstNode = (_a = valueAst.nodes[0]) == null ? void 0 : _a.nodes[0];
    if (!firstNode)
      return;
    if (firstNode.type === "string") {
      maybeUrlNode = firstNode;
    } else if (firstNode.type === "func" && firstNode.value === "url") {
      const argument = firstNode.nodes[1];
      if (!argument)
        return;
      if (argument.type === "string" || argument.type === "word") {
        maybeUrlNode = argument;
      }
    }
    if (maybeUrlNode) {
      const urlNode = maybeUrlNode;
      const link = {
        get target() {
          return urlNode.value;
        },
        set target(newUrl) {
          urlNode.value = newUrl;
          atRule2.params = valueAst.toString();
        },
        get absoluteTarget() {
          return tryParseUrl(this.target, baseUrl);
        },
        get isSubresource() {
          return true;
        },
        get subresourceType() {
          return "style";
        },
        get from() {
          return {};
        }
      };
      links.push(link);
    }
  });
  parsedCss.walkDecls((decl) => {
    let valueAst;
    try {
      valueAst = lib(decl.value).parse();
    } catch (err) {
      return;
    }
    valueAst.walk((functionNode) => {
      var _a;
      if (functionNode.type !== "func")
        return;
      if (functionNode.value !== "url")
        return;
      let subresourceType;
      if (decl.prop === "src" && ((_a = decl.parent) == null ? void 0 : _a.type) === "atrule" && decl.parent.name === "font-face") {
        subresourceType = "font";
      } else {
        subresourceType = "image";
      }
      const argument = functionNode.nodes[1];
      if (argument === void 0)
        return;
      if (argument.type === "string" || argument.type === "word") {
        const urlNode = argument;
        const link = {
          get target() {
            return urlNode.value;
          },
          set target(newUrl) {
            urlNode.value = newUrl;
            decl.value = valueAst.toString();
          },
          get absoluteTarget() {
            return tryParseUrl(this.target, baseUrl);
          },
          get isSubresource() {
            return true;
          },
          get subresourceType() {
            return subresourceType;
          },
          get from() {
            return {};
          }
        };
        links.push(link);
      }
    });
  });
  return links;
}
function findLinksInCssSynced({
  get: getCssString,
  set: setCssString,
  baseUrl
}) {
  const { get: getParsedCss, set: setParsedCss } = transformingCache({
    get: getCssString,
    set: setCssString,
    transform: (cssString) => postcss_1.parse(cssString),
    untransform: (parsedCss) => parsedCss.toResult().css
  });
  const memoizedfindLinksInCss = memoizeOne(findLinksInCss);
  let currentParsedCss;
  const links = deepSyncingProxy({
    get: () => {
      let parsedCss;
      try {
        parsedCss = getParsedCss();
      } catch (err) {
        currentParsedCss = null;
        return [];
      }
      currentParsedCss = parsedCss;
      return memoizedfindLinksInCss(parsedCss, baseUrl);
    },
    set: (links2) => {
      if (currentParsedCss !== null) {
        setParsedCss(currentParsedCss);
      }
    }
  });
  return links;
}
function getBaseUrl(doc, docUrl = doc.URL) {
  const baseEl = doc.querySelector("base[href]");
  if (baseEl) {
    const baseHref = baseEl.getAttribute("href");
    if (baseHref !== null) {
      const baseUrl = tryParseUrl(baseHref, docUrl);
      if (baseUrl) {
        return baseUrl;
      }
    }
  }
  return docUrl;
}
const splitByRegex = (regex) => (value2) => {
  const tokens = [];
  let remainder = value2;
  let remainderIndex = 0;
  while (remainder.length > 0) {
    const match = remainder.match(regex);
    const leadingWhitespace = match[1];
    const token = match[2];
    if (token.length > 0) {
      tokens.push({
        token,
        index: remainderIndex + leadingWhitespace.length
      });
    }
    const charactersSeen = match[0].length;
    remainder = remainder.slice(charactersSeen);
    remainderIndex += charactersSeen;
  }
  return tokens;
};
const splitByWhitespace = splitByRegex(/^(\s*)([^]*?)(\s*)(\s|$)/);
const splitByComma = splitByRegex(/^(\s*)([^]*?)(\s*)(,|$)/);
const splitByCommaPickFirstTokens = splitByRegex(/^(\s*)(\S*)([^]*?)(,|$)/);
function merge(objects, mergeValues = (_, b) => b) {
  const result2 = {};
  for (const object of objects) {
    for (const [key, value2] of Object.entries(object)) {
      result2[key] = key in result2 ? mergeValues(result2[key], value2) : value2;
    }
  }
  return result2;
}
function omit(object, keys) {
  const entries = Object.entries(object);
  const entriesToKeep = entries.filter((entry) => !keys.includes(entry[0]));
  return ObjectFromEntries(entriesToKeep);
}
function ObjectFromEntries(entries) {
  return Object.fromEntries(entries);
}
function uniq(array) {
  const newArray = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value2 of array) {
    if (!seen.has(value2)) {
      seen.add(value2);
      newArray.push(value2);
    }
  }
  return newArray;
}
const defaultItem = {
  elements: ["*"],
  parse: (value2) => {
    const url = value2.trim();
    if (url.length === 0)
      return [];
    const index = value2.indexOf(url[0]);
    return [{ token: url, index }];
  },
  isSubresource: false,
  subresourceType: void 0,
  makeAbsolute(url, element, baseUrl = element.baseURI, documentURL = element.ownerDocument !== null ? element.ownerDocument.URL : void 0) {
    return tryParseUrl(url, baseUrl);
  }
};
const makeAbsoluteUsingCodebase = (url, element, ...etc) => {
  const codebaseValue = element.getAttribute("codebase");
  if (codebaseValue) {
    const [codebaseUrlLocation] = html40.codebase.parse(codebaseValue);
    if (codebaseUrlLocation) {
      const codebaseUrl = codebaseUrlLocation.token;
      const codebaseAbsoluteUrl = html40.codebase.makeAbsolute(codebaseUrl, element, ...etc);
      return tryParseUrl(url, codebaseAbsoluteUrl);
    }
  }
  return defaultItem.makeAbsolute(url, element, ...etc);
};
const html40 = {
  action: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "action",
    elements: ["form"]
  }),
  applet_archive: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "archive",
    elements: ["applet"],
    parse: splitByComma,
    isSubresource: true,
    makeAbsolute: makeAbsoluteUsingCodebase
  }),
  object_archive: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "archive",
    elements: ["object"],
    parse: splitByWhitespace,
    isSubresource: true,
    makeAbsolute: makeAbsoluteUsingCodebase
  }),
  background: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "background",
    elements: ["body"],
    isSubresource: true,
    subresourceType: "image"
  }),
  cite: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "cite",
    elements: ["blockquote", "q", "del", "ins"]
  }),
  classid: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "classid",
    elements: ["object"],
    isSubresource: true,
    makeAbsolute: makeAbsoluteUsingCodebase
  }),
  codebase: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "codebase",
    elements: ["object", "applet"]
  }),
  data: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "data",
    elements: ["object"],
    isSubresource: true,
    subresourceType: "object",
    makeAbsolute: makeAbsoluteUsingCodebase
  }),
  href: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "href",
    elements: ["a", "area", "base", "link:not([rel~=icon i]):not([rel~=stylesheet i])"]
  }),
  link_icon_href: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "href",
    elements: ["link[rel~=icon i]"],
    isSubresource: true,
    subresourceType: "image"
  }),
  link_stylesheet_href: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "href",
    elements: ["link[rel~=stylesheet i]"],
    isSubresource: true,
    subresourceType: "style"
  }),
  longdesc: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "longdesc",
    elements: ["img", "frame", "iframe"]
  }),
  profile: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "profile",
    elements: ["head"]
  }),
  img_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["img", "input[type=image i]"],
    isSubresource: true,
    subresourceType: "image"
  }),
  frame_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["frame", "iframe"],
    isSubresource: true,
    subresourceType: "document"
  }),
  script_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["script"],
    isSubresource: true,
    subresourceType: "script"
  }),
  param_ref_value: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "value",
    elements: ["param[valuetype=ref i]"]
  }),
  meta_refresh_content: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "content",
    elements: ["meta[http-equiv=refresh i]"],
    parse: (value2) => {
      const match = value2.match(/^(\s*[\d.]+\s*[;,\s]\s*(?:url\s*=\s*)?('|")?\s*)(.+)/i);
      if (!match)
        return [];
      const quote = match[2];
      let url = match[3];
      if (quote && url.includes(quote)) {
        url = url.slice(0, url.indexOf(quote));
      }
      const index = match[1].length;
      url = url.trim();
      return [{ token: url, index }];
    }
  })
};
const html52 = {
  action: html40.action,
  cite: html40.cite,
  data: __spreadProps(__spreadValues({}, html40.data), {
    makeAbsolute: defaultItem.makeAbsolute
  }),
  formaction: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "formaction",
    elements: ["button", "input"]
  }),
  href: html40.href,
  link_icon_href: html40.link_icon_href,
  link_stylesheet_href: html40.link_stylesheet_href,
  longdesc: __spreadProps(__spreadValues({}, html40.longdesc), {
    elements: ["img"]
  }),
  manifest: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "manifest",
    elements: ["html"],
    isSubresource: true,
    makeAbsolute(url, element, _, documentURL = element.ownerDocument !== null ? element.ownerDocument.URL : void 0) {
      return tryParseUrl(url, documentURL);
    }
  }),
  poster: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "poster",
    elements: ["video"],
    isSubresource: true,
    subresourceType: "image"
  }),
  audio_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["audio", "audio>source"],
    isSubresource: true,
    subresourceType: "audio"
  }),
  embed_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["embed"],
    isSubresource: true,
    subresourceType: "embed"
  }),
  frame_src: __spreadProps(__spreadValues({}, html40.frame_src), {
    elements: ["iframe"]
  }),
  img_src: html40.img_src,
  script_src: html40.script_src,
  track_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["track"],
    isSubresource: true,
    subresourceType: "track"
  }),
  video_src: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "src",
    elements: ["video", "video>source"],
    isSubresource: true,
    subresourceType: "video"
  }),
  srcset: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "srcset",
    elements: ["img", "picture>source"],
    parse: splitByCommaPickFirstTokens,
    isSubresource: true,
    subresourceType: "image"
  }),
  meta_refresh_content: html40.meta_refresh_content
};
const whatwg = __spreadProps(__spreadValues({}, omit(html52, ["longdesc"])), {
  itemprop: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "itemprop",
    parse: (value2) => {
      return splitByWhitespace(value2).filter(({ token }) => token.includes(":"));
    },
    makeAbsolute: (url) => tryParseUrl(url)
  }),
  itemtype: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "itemtype",
    parse: splitByWhitespace,
    makeAbsolute: (url) => tryParseUrl(url)
  }),
  itemid: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "itemid"
  }),
  ping: __spreadProps(__spreadValues({}, defaultItem), {
    attribute: "ping",
    elements: ["a", "area"]
  })
});
const mergeAttributeInfos = (info1, info2) => info1 === info2 ? info1 : __spreadProps(__spreadValues(__spreadValues({}, info1), info2), {
  elements: uniq(info1.elements.concat(info2.elements))
});
const allAttributes = merge([whatwg, html52, html40], mergeAttributeInfos);
function findLinksInDom(doc, {
  docUrl = void 0
} = {}) {
  const baseUrl = docUrl !== void 0 ? getBaseUrl(doc, docUrl) : void 0;
  const rootElement = doc.documentElement;
  const links = [
    ...findLinksInAttributes({ rootElement, baseUrl, docUrl }),
    ...findLinksInStyleAttributes({ rootElement, baseUrl }),
    ...findLinksInStyleTags({ rootElement, baseUrl })
  ];
  return links;
}
function findLinksInAttributes({
  rootElement,
  baseUrl,
  docUrl
}) {
  const links = Object.values(allAttributes).flatMap((attributeInfo) => {
    const { attribute, elements: elementNames } = attributeInfo;
    const selector = elementNames.map((name) => `${name}[${attribute}]`).join(", ");
    const elements = Array.from(rootElement.querySelectorAll(selector));
    const links2 = elements.flatMap((element) => linksInAttribute({ element, attributeInfo, baseUrl, docUrl }));
    return links2;
  });
  return links;
}
function linksInAttribute({
  element,
  attributeInfo,
  baseUrl,
  docUrl
}) {
  const { attribute, parse: parse2, makeAbsolute } = attributeInfo;
  const parsedAttributeView = syncingParsedView({
    parse: parse2,
    get: () => element.getAttribute(attribute) || "",
    set: (value2) => {
      element.setAttribute(attribute, value2);
    }
  });
  const links = parsedAttributeView.map((tokenView) => ({
    get target() {
      return tokenView.token;
    },
    set target(newUrl) {
      tokenView.token = newUrl;
    },
    get absoluteTarget() {
      return makeAbsolute(this.target, element, baseUrl, docUrl);
    },
    get from() {
      const index = tokenView.index;
      return {
        get element() {
          return element;
        },
        get attribute() {
          return attribute;
        },
        get rangeWithinAttribute() {
          return [index, index + tokenView.token.length];
        }
      };
    },
    get isSubresource() {
      return attributeInfo.isSubresource;
    },
    get subresourceType() {
      return attributeInfo.subresourceType;
    }
  }));
  return links;
}
function findLinksInStyleAttributes({
  rootElement,
  baseUrl
}) {
  const querySelector = "*[style]";
  const elements = Array.from(rootElement.querySelectorAll(querySelector));
  const links = elements.flatMap((element) => {
    const cssLinks = findLinksInCssSynced({
      get: () => element.getAttribute("style") || "",
      set: (newValue) => {
        element.setAttribute("style", newValue);
      },
      baseUrl: baseUrl || element.baseURI
    });
    const links2 = cssLinks.map((link) => {
      const newLink = Object.create(link, {
        from: {
          get: () => ({
            get element() {
              return element;
            },
            get attribute() {
              return "style";
            },
            get rangeWithinAttribute() {
              return link.from.range;
            }
          })
        }
      });
      return newLink;
    });
    return links2;
  });
  return links;
}
function findLinksInStyleTags({
  rootElement,
  baseUrl
}) {
  const querySelector = 'style[type="text/css" i], style:not([type])';
  const elements = Array.from(rootElement.querySelectorAll(querySelector));
  const links = elements.flatMap((element) => {
    const cssLinks = findLinksInCssSynced({
      get: () => element.textContent || "",
      set: (newValue) => {
        element.textContent = newValue;
      },
      baseUrl: baseUrl || element.baseURI
    });
    const links2 = cssLinks.map((cssLink) => {
      const htmlLink = Object.create(cssLink, {
        from: {
          get: () => ({
            get element() {
              return element;
            },
            get rangeWithinTextContent() {
              return cssLink.from.range;
            }
          })
        }
      });
      return htmlLink;
    });
    return links2;
  });
  return links;
}
class DomResource extends Resource {
  constructor(docOrHtml, url, config = {}) {
    super();
    const glob = config.glob || globalThis;
    const doc = typeof docOrHtml === "string" ? new glob.DOMParser().parseFromString(docOrHtml, "text/html") : docOrHtml;
    this._doc = doc;
    this._url = url;
    this._config = config;
    this._linksInDom = findLinksInDom(doc, { docUrl: url });
    for (const link of this._linksInDom)
      link.from.resource = this;
  }
  get doc() {
    return this._doc;
  }
  get url() {
    var _a;
    return (_a = this._url) != null ? _a : this._doc.URL;
  }
  get blob() {
    const glob = this._config.glob || globalThis;
    return new glob.Blob([this.string], { type: "text/html" });
  }
  get string() {
    return documentOuterHTML(this._doc);
  }
  get links() {
    const allLinks = [
      ...this.linksInDom,
      ...this.iframeSrcDocs.flatMap((resource) => resource.links)
    ];
    return allLinks;
  }
  get linksInDom() {
    return this._linksInDom;
  }
  get iframeSrcDocs() {
    const frames = Array.from(this.doc.querySelectorAll("iframe[srcdoc]"));
    const resources = frames.map((frame) => this.getContentDocOfFrame(frame)).filter(isNotNull);
    return resources;
  }
  dry() {
    super.dry();
    makeDomStatic(this.doc, this._config);
    this.updateSrcdocValues();
  }
  updateSrcdocValues() {
    this.doc.querySelectorAll("iframe[srcdoc],iframe:not([src])").forEach((iframe) => {
      const innerDomResource = this.getContentDocOfFrame(iframe);
      if (innerDomResource) {
        const html = innerDomResource.string;
        if (!iframe.srcdoc && html === "<html><head></head><body></body></html>")
          return;
        iframe.srcdoc = attributeEncode(html);
      }
    });
  }
  getContentDocOfFrame(frameElement) {
    const innerDoc = frameElement.contentDocument;
    if (innerDoc !== null) {
      return new DomResource(innerDoc, void 0, this._config);
    } else {
      return null;
    }
  }
  static async fromBlob({ blob, url, config }) {
    const html = await blobToText(blob, config);
    return new this(html, url, config);
  }
}
function attributeEncode(string2) {
  return string2.replace(/"/g, "&quot;");
}
function isNotNull(x2) {
  return x2 !== null;
}
class DomCloneResource extends DomResource {
  constructor(originalDoc, url, config = {}) {
    const clone = originalDoc.cloneNode(true);
    super(clone, url, config);
    this._originalDoc = originalDoc;
    this._framesContentDocClones = /* @__PURE__ */ new Map();
  }
  get doc() {
    return super.doc;
  }
  get originalDoc() {
    return this._originalDoc;
  }
  getOriginalNode(nodeInClone) {
    const path = pathToDomnode(nodeInClone, this.doc);
    const originalNode = domnodeAtPath(path, this._originalDoc);
    return originalNode;
  }
  getClonedNode(nodeInOriginal) {
    const path = pathToDomnode(nodeInOriginal, this._originalDoc);
    const originalNode = domnodeAtPath(path, this.doc);
    return originalNode;
  }
  cloneFramedDocs(deep = false) {
    const glob = this._config.glob || globalThis;
    const clonedFrames = Array.from(this.doc.querySelectorAll("frame,iframe")).filter((element) => element instanceof glob.HTMLElement);
    const frameLinks = this.subresourceLinks.filter((link) => link.subresourceType === "document");
    for (const clonedFrame of clonedFrames) {
      const clonedInnerDoc = this.getContentDocOfFrame(clonedFrame);
      if (clonedInnerDoc !== null) {
        if (deep)
          clonedInnerDoc.cloneFramedDocs(true);
        const link = frameLinks.find((link2) => link2.from.element === clonedFrame);
        if (link) {
          if (clonedInnerDoc.url !== "about:srcdoc")
            link.resource = clonedInnerDoc;
          link.from.resource = this;
        }
      }
    }
  }
  getContentDocOfFrame(frameElement) {
    let originalFrameElement, clonedFrameElement;
    if (frameElement.ownerDocument === this.doc) {
      clonedFrameElement = frameElement;
      originalFrameElement = this.getOriginalNode(frameElement);
    } else if (frameElement.ownerDocument === this._originalDoc) {
      clonedFrameElement = this.getClonedNode(frameElement);
      originalFrameElement = frameElement;
    } else {
      throw new Error("Argument must be an element of either the original or the cloned document");
    }
    let clonedInnerDoc = this._framesContentDocClones.get(clonedFrameElement);
    if (clonedInnerDoc === void 0) {
      clonedInnerDoc = this._getContentDocOfFrame(originalFrameElement);
      this._framesContentDocClones.set(clonedFrameElement, clonedInnerDoc);
    }
    return clonedInnerDoc;
  }
  _getContentDocOfFrame(originalFrameElement) {
    const originalInnerDoc = getDocInFrame(originalFrameElement);
    if (originalInnerDoc !== null) {
      return new DomCloneResource(originalInnerDoc, void 0, this._config);
    } else {
      return null;
    }
  }
}
function getDocInFrame(frameElement) {
  try {
    return frameElement.contentDocument;
  } catch (err) {
    return null;
  }
}
class StylesheetResource extends Resource {
  constructor(stylesheetContent, url, config = {}) {
    super();
    this._url = url;
    this._config = config;
    try {
      const parsedCss = postcss_1.parse(stylesheetContent);
      this._links = findLinksInCss(parsedCss, url);
      for (const link of this._links)
        link.from.resource = this;
      this._getString = () => parsedCss.toResult().css;
    } catch (err) {
      this._links = [];
      this._getString = () => stylesheetContent;
    }
  }
  get url() {
    return this._url;
  }
  get blob() {
    const glob = this._config.glob || globalThis;
    return new glob.Blob([this.string], { type: "text/css" });
  }
  get string() {
    return this._getString();
  }
  get links() {
    return this._links;
  }
  static async fromBlob({ blob, url, config }) {
    const stylesheetText = await blobToText(blob, config);
    return new this(stylesheetText, url, config);
  }
}
class LeafResource extends Resource {
  constructor(blob, url) {
    super();
    this._blob = blob;
    this._url = url;
  }
  get url() {
    return this._url;
  }
  get blob() {
    return this._blob;
  }
  get links() {
    return [];
  }
  static async fromBlob({ blob, url }) {
    return new this(blob, url);
  }
}
async function freezeDry(document2 = typeof window !== "undefined" && window.document || fail("No document given to freeze-dry"), options = {}) {
  const freezeDryer = await new FreezeDryer(document2, options).run();
  const html = freezeDryer.result.string;
  return html;
}
class FreezeDryer {
  constructor(document2, options = {}) {
    this.original = document2;
    this.config = this.applyDefaultConfig(document2, options);
    this.abortController = this.initAbortController();
    this.result = this.captureDom(document2);
  }
  async run() {
    await this.crawlSubresources();
    await this.config.dryResource(this.result, true);
    this.finaliseSnapshot();
    return this;
  }
  captureDom(original) {
    const domResource = new DomCloneResource(original, this.config.docUrl, { glob: this.config.glob });
    domResource.cloneFramedDocs(true);
    return domResource;
  }
  async crawlSubresources() {
    var _a;
    try {
      await this.result.processSubresources(this.config.processSubresource);
    } catch (error) {
      if (!((_a = this.config.signal) == null ? void 0 : _a.aborted))
        throw error;
    }
  }
  async processSubresource(link, recurse) {
    if (!link.resource) {
      try {
        link.resource = await Resource.fromLink(link, {
          fetchResource: this.config.fetchResource,
          signal: this.signal,
          glob: this.config.glob
        });
      } catch (err) {
        return;
      }
    }
    await link.resource.processSubresources(recurse);
    await this.config.dryResource(link.resource, false);
    const newUrl = await this.config.newUrlForResource(link.resource);
    if (newUrl !== link.target)
      setLinkTarget(link, newUrl, { rememberOriginalUrls: this.config.rememberOriginalUrls });
  }
  async newUrlForResource(resource) {
    return await blobToDataUrl(resource.blob, { glob: this.config.glob });
  }
  dryResource(resource, isRootDocument) {
    resource.dry();
  }
  finaliseSnapshot() {
    if (this.config.addMetadata)
      setMementoTags(this.result.doc, { originalUrl: this.result.url, datetime: this.config.now });
    if (this.config.contentSecurityPolicy !== null)
      setContentSecurityPolicy(this.result.doc, this.config.contentSecurityPolicy);
    if (this.config.charsetDeclaration !== void 0)
      setCharsetDeclaration(this.result.doc, this.config.charsetDeclaration);
  }
  applyDefaultConfig(doc, options) {
    const defaultOptions = {
      addMetadata: true,
      rememberOriginalUrls: true,
      now: new Date(),
      contentSecurityPolicy: {
        "default-src": ["'none'"],
        "img-src": ["data:"],
        "media-src": ["data:"],
        "style-src": ["data:", "'unsafe-inline'"],
        "font-src": ["data:"],
        "frame-src": ["data:"]
      },
      charsetDeclaration: "utf-8",
      timeout: Infinity,
      signal: void 0,
      fetchResource: void 0,
      dryResource: this.dryResource.bind(this),
      newUrlForResource: this.newUrlForResource.bind(this),
      processSubresource: this.processSubresource.bind(this),
      docUrl: void 0,
      glob: doc.defaultView || (typeof window !== "undefined" ? window : void 0) || fail("Lacking a global window object")
    };
    const config = flatOptions(options, defaultOptions);
    return config;
  }
  initAbortController() {
    const glob = this.config.glob || globalThis;
    const abortController = new glob.AbortController();
    if (this.config.timeout >= 0 && this.config.timeout < Infinity) {
      glob.setTimeout(() => {
        this.abort("Freeze-dry timed out");
      }, this.config.timeout);
    }
    if (this.config.signal) {
      const configSignal = this.config.signal;
      configSignal.addEventListener("abort", (event) => this.abort(configSignal.reason));
    }
    return abortController;
  }
  async abort(reason) {
    this.abortController.abort(reason);
  }
  get signal() {
    return this.abortController.signal;
  }
}
function fail(message) {
  throw new Error(message);
}
export { DomCloneResource, DomResource, FreezeDryer, LeafResource, Resource, StylesheetResource, blobToDataUrl, blobToText, freezeDry as default, freezeDry, makeDomStatic, removeContentEditable, removeNoscript, removeScripts, setCharsetDeclaration, setContentSecurityPolicy, setLinkTarget, setMementoTags };
