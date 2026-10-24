/*! pharaonic/livewire-tagify | MIT License */

// resources/js/legacy.js
function installLegacy(win, namespace, withAssistant) {
  const scan = (root) => withAssistant((assistant) => assistant.scan(root));
  namespace.Tagify = Object.freeze({
    init: () => scan(win.document),
    load: (target, componentId) => {
      const element = typeof target === "string" ? win.document.querySelector(target) : target;
      if (element && typeof componentId === "string" && componentId !== "" && !element.hasAttribute("data-component-id")) {
        element.setAttribute("data-component-id", componentId);
      }
      scan(element || win.document);
    }
  });
  win.addEventListener("pharaonic.tagify.init", () => scan(win.document));
  win.addEventListener("pharaonic.tagify.load", (event) => {
    const detail = event.detail || {};
    namespace.Tagify.load(detail.target, detail.component);
  });
}

// resources/js/model.js
function readModel(element) {
  for (const attribute of Array.from(element.attributes)) {
    if (attribute.name !== "wire:model" && !attribute.name.startsWith("wire:model.")) {
      continue;
    }
    const property = attribute.value.trim();
    if (property === "") {
      return null;
    }
    return { property, modifiers: attribute.name.split(".").slice(1) };
  }
  return null;
}

// resources/js/livewire.js
function modelBinding(element) {
  const model = readModel(element);
  return model === null ? null : { property: model.property, live: true };
}
var guarded = /* @__PURE__ */ new WeakSet();
function guardModelWrites(window2) {
  const livewire = window2.livewire;
  if (guarded.has(window2) || !livewire || typeof livewire.hook !== "function") {
    return;
  }
  guarded.add(window2);
  livewire.hook("interceptWireModelSetValue", (domElement) => {
    const element = domElement && domElement.el;
    if (element && element.__tagify && typeof element.tagifyValue === "string") {
      window2.queueMicrotask(() => {
        element.value = element.tagifyValue;
      });
    }
  });
}

// resources/js/options.js
var enabled = (value) => value.toLowerCase() !== "false";
var isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var copy = (value) => value === void 0 ? {} : JSON.parse(JSON.stringify(value));
function list(value, delimiters) {
  if (value.startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
    }
  }
  return value.split(delimiters instanceof RegExp ? delimiters : new RegExp(typeof delimiters === "string" && delimiters !== "" ? delimiters : ",")).map((item) => item.trim()).filter((item) => item !== "");
}
var defaults = () => ({
  tagTextProp: "value",
  dropdown: {
    maxItems: 25,
    enabled: 1,
    closeOnSelect: false,
    classname: "",
    mapValueTo: "value",
    searchKeys: ["value"]
  }
});
var SHORTHANDS = {
  "data-delimiters": (settings, value) => {
    if (value !== "") {
      settings.delimiters = value;
    }
  },
  "data-suggest": (settings, value) => {
    if (enabled(value)) {
      settings.dropdown.enabled = 0;
    }
  },
  "data-suggest-enforce": (settings, value) => {
    if (enabled(value)) {
      settings.enforceWhitelist = true;
      settings.dropdown.enabled = 0;
    }
  },
  "data-max": (settings, value) => {
    const max = Number(value);
    if (value !== "" && Number.isInteger(max) && max > 0) {
      settings.maxTags = max;
    }
  },
  "data-classname": (settings, value) => {
    settings.dropdown.classname = value;
  },
  "data-value": (settings, value) => {
    if (value !== "") {
      settings.tagTextProp = value;
      settings.dropdown.mapValueTo = value;
      settings.dropdown.searchKeys = [value];
    }
  }
};
var LISTS = {
  "data-suggest-list": "whitelist",
  "data-black-list": "blacklist"
};
function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      merge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}
function buildOptions({ element, options }) {
  var _a;
  const settings = defaults();
  const read = (attribute) => element.hasAttribute(attribute) ? element.getAttribute(attribute).trim() : null;
  for (const [attribute, apply] of Object.entries(SHORTHANDS)) {
    const value = read(attribute);
    if (value !== null) {
      apply(settings, value);
    }
  }
  const given = copy(options);
  const delimiters = (_a = given.delimiters) != null ? _a : settings.delimiters;
  for (const [attribute, setting] of Object.entries(LISTS)) {
    const value = read(attribute);
    if (value !== null && value !== "") {
      settings[setting] = list(value, delimiters);
    }
  }
  merge(settings, given);
  const direct = read("data-direct");
  const key = read("data-key");
  return {
    settings,
    key: key === null || key === "" ? "value" : key,
    direct: direct !== null && enabled(direct)
  };
}
function withoutShorthandOverrides(element, callback) {
  const hidden = [];
  if (element.hasAttribute("data-suggest")) {
    hidden.push(["data-suggest", element.getAttribute("data-suggest")]);
    element.removeAttribute("data-suggest");
  }
  try {
    return callback();
  } finally {
    hidden.forEach(([name, value]) => element.setAttribute(name, value));
  }
}

// resources/js/value.js
var isPlainObject2 = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var blank = (value) => value === null || value === void 0 || value === "";
function createValue({ settings, key, direct }) {
  const mode = settings.mode;
  const textProp = settings.tagTextProp || "value";
  const toTag = (item, whitelist) => {
    if (isPlainObject2(item)) {
      return item;
    }
    const match = (whitelist || []).find((entry) => isPlainObject2(entry) ? String(entry[key]) === String(item) : String(entry) === String(item));
    const tag = isPlainObject2(match) ? { ...match } : { [textProp]: String(item), [key]: item };
    if (tag.value === void 0) {
      tag.value = String(tag[textProp]);
    }
    return tag;
  };
  return {
    read(tagify) {
      var _a;
      if (mode === "mix") {
        return tagify.getMixedTagsAsString().replace(/\r\n$/, "");
      }
      const tags = tagify.getCleanValue();
      const values = direct ? tags.map((tag) => tag[key]) : tags;
      return mode === "select" ? (_a = values[0]) != null ? _a : null : values;
    },
    // Loading never fires Tagify's change event, so nothing is written back.
    load(tagify, value) {
      if (mode === "mix") {
        tagify.loadOriginalValues(blank(value) ? "" : String(value));
        return;
      }
      const items = blank(value) ? [] : Array.isArray(value) ? value : [value];
      const tags = items.filter((item) => !blank(item)).map((item) => toTag(item, tagify.settings.whitelist));
      tagify.loadOriginalValues(tags.length > 0 ? JSON.stringify(tags) : "");
    }
  };
}

// resources/js/tagify.js
var same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
var hasWire = (element, directive) => Array.from(element.attributes).some((attribute) => attribute.name === directive || attribute.name.startsWith(`${directive}.`));
function tagifyError(code, message) {
  return Object.assign(new Error(message), { code });
}
function createTagify({ window: window2, modelBinding: modelBinding2, guardModelWrites: guardModelWrites2 = () => {
}, assistant }) {
  const records = /* @__PURE__ */ new WeakMap();
  const waiting = /* @__PURE__ */ new Set();
  const loaded = () => window2.document.readyState === "complete";
  if (!loaded()) {
    window2.addEventListener("load", () => {
      const runtime = assistant();
      const elements = [...waiting];
      waiting.clear();
      elements.forEach((element) => {
        runtime.destroy(element);
        runtime.scan(element);
      });
    }, { once: true });
  }
  function create(element, settings) {
    return withoutShorthandOverrides(element, () => new window2.Tagify(element, settings));
  }
  function isIntact(tagify, element) {
    return element.__tagify === tagify && tagify.DOM.scope.isConnected && tagify.DOM.scope.nextElementSibling === element;
  }
  function mount(context) {
    const { element, property, component } = context;
    if (typeof window2.Tagify !== "function") {
      if (!loaded()) {
        waiting.add(element);
        return () => waiting.delete(element);
      }
      throw tagifyError("tagify-missing", "Tagify needs window.Tagify. Load it before the page finishes loading.");
    }
    const { settings, key, direct } = buildOptions({ element, options: context.options });
    const value = createValue({ settings, key, direct });
    const binding = property !== null ? { property, live: true } : modelBinding2(element);
    const shielded = property !== null || hasWire(element, "wire:model") || hasWire(element, "wire:change");
    let tagify = create(element, settings);
    if (hasWire(element, "wire:model")) {
      guardModelWrites2(window2);
    }
    const apply = (incoming) => {
      if (!same(value.read(tagify), incoming)) {
        value.load(tagify, incoming);
      }
    };
    const sync = () => {
      if (binding !== null) {
        apply(component.get(binding.property));
      }
    };
    const sent = [];
    const received = (incoming) => {
      const echoed = sent.findIndex((entry) => same(entry, incoming));
      if (echoed === -1) {
        sent.length = 0;
        apply(incoming);
      } else {
        sent.splice(0, echoed + 1);
      }
    };
    const write = () => {
      const next = value.read(tagify);
      if (same(next, component.get(binding.property))) {
        return null;
      }
      sent.push(next);
      return component.set(binding.property, next, { live: binding.live }).catch((error) => {
        const index = sent.indexOf(next);
        if (index !== -1) {
          sent.splice(index, 1);
        }
        throw error;
      });
    };
    let notifying = false;
    const shield = (event) => {
      if (!notifying) {
        event.stopImmediatePropagation();
      }
    };
    const notify = () => {
      if (!hasWire(element, "wire:change")) {
        return;
      }
      notifying = true;
      try {
        element.dispatchEvent(new window2.Event("change", { bubbles: true }));
      } finally {
        notifying = false;
      }
    };
    const changed = () => {
      const written = binding === null ? Promise.resolve() : write();
      if (written === null) {
        return;
      }
      const failed = (error) => window2.console.error(`Tagify could not update "${binding.property}".`, error);
      if (binding !== null && !binding.live) {
        written.catch(failed);
        notify();
      } else {
        written.then(notify, failed);
      }
    };
    if (shielded) {
      element.addEventListener("change", shield, true);
    }
    tagify.on("change", changed);
    if (binding !== null) {
      sync();
      component.watch(binding.property, received);
    }
    records.set(element, {
      refresh() {
        if (!isIntact(tagify, element)) {
          tagify.off("change", changed);
          tagify.destroy();
          tagify = create(element, settings);
          tagify.on("change", changed);
        }
        sync();
      }
    });
    return () => {
      records.delete(element);
      element.removeEventListener("change", shield, true);
      tagify.off("change", changed);
      tagify.destroy();
    };
  }
  return {
    mount,
    // Livewire changed a field outside wire:ignore: rebuild what the morph removed.
    update({ element }) {
      const record = records.get(element);
      if (record) {
        record.refresh();
      }
    }
  };
}

// resources/js/index.js
function install(win) {
  var _a, _b;
  const namespace = (_a = win.Pharaonic) != null ? _a : win.Pharaonic = {};
  if (namespace.tagify) {
    return namespace.tagify;
  }
  let assistant = null;
  const pending = [];
  const withAssistant = (callback) => {
    if (assistant) {
      callback(assistant);
    } else {
      pending.push(callback);
    }
  };
  const integration = createTagify({ window: win, modelBinding, guardModelWrites, assistant: () => assistant });
  const api = Object.freeze({});
  namespace.tagify = api;
  installLegacy(win, namespace, withAssistant);
  const registerTagify = (runtime) => {
    assistant = runtime;
    runtime.register("tagify", integration);
    pending.splice(0).forEach((callback) => callback(runtime));
  };
  if (namespace.assistant) {
    registerTagify(namespace.assistant);
  } else {
    ((_b = win.PharaonicAssistantQueue) != null ? _b : win.PharaonicAssistantQueue = []).push(registerTagify);
  }
  return api;
}
install(window);
