import { _fiberRoots, getFiberFromHostInstance, instrument } from "bippy";
import {
  getFiberSource,
  getFiberStackTrace,
  getOwnerStack,
} from "bippy/dist/source";

export const fiberRoots = _fiberRoots;

instrument({
  onCommitFiberRoot(_, fiberRoot) {
    fiberRoots.add(fiberRoot);
  },
});

export interface StackItem {
  componentName: string;
  displayName?: string;
  fileName: string | undefined;
  source?: string;
}

// HACK: sometimes source file paths get duplicated in the form /path/to/file/path/to/file
// this detects obvious duplicates where the path repeats itself and removes the duplication
const dedupeFileName = (fileName: string | undefined): string | undefined => {
  if (!fileName) return fileName;

  const parts = fileName.split("/");

  for (let start = 0; start < parts.length / 2; start++) {
    for (let len = 1; len <= parts.length - start; len++) {
      const firstSeq = parts.slice(start, start + len);
      const secondStart = start + len;
      const secondSeq = parts.slice(secondStart, secondStart + len);

      if (firstSeq.length > 2 &&
          firstSeq.length === secondSeq.length &&
          firstSeq.every((part, i) => part === secondSeq[i])) {
        return parts.slice(secondStart).join("/");
      }
    }
  }

  return fileName;
};

export const getStack = async (element: Element) => {
  const fiber = getFiberFromHostInstance(element);
  if (!fiber) return null;
  const stackTrace = getFiberStackTrace(fiber);
  const rawOwnerStack = await getOwnerStack(stackTrace);
  const stack: StackItem[] = rawOwnerStack.map((item) => ({
    componentName: item.name,
    fileName: dedupeFileName(item.source?.fileName),
  }));

  if (stack.length > 0 && fiber) {
    const fiberSource = await getFiberSource(fiber);
    if (fiberSource) {
      const fiberType = fiber.type as
        | null
        | undefined
        | { displayName?: string; name?: string };
      const displayName =
        fiberType?.displayName ?? fiberType?.name ?? stack[0].componentName;
      stack[0].displayName = displayName;
      const dedupedFileName = dedupeFileName(fiberSource.fileName);
      stack[0].source = `${dedupedFileName}:${fiberSource.lineNumber}:${fiberSource.columnNumber}`;
    }
  }

  return stack;
};

export const filterStack = (stack: StackItem[]) => {
  return stack.filter(
    (item) =>
      item.fileName &&
      !item.fileName.includes("node_modules") &&
      item.componentName.length > 1 &&
      !item.fileName.startsWith("_"),
  );
};

export const serializeStack = (stack: StackItem[]) => {
  return stack
    .map((item, index) => {
      const fileName = item.fileName;
      const componentName = item.displayName || item.componentName;
      let result = `${componentName}${fileName ? ` (${fileName})` : ""}`;

      if (index === 0 && item.source) {
        result += `\n${item.source}`;
      }

      return result;
    })
    .join("\n");
};

export const getHTMLSnippet = (element: Element) => {
  const semanticTags = new Set([
    "article",
    "aside",
    "footer",
    "form",
    "header",
    "main",
    "nav",
    "section",
  ]);

  const hasDistinguishingFeatures = (el: Element): boolean => {
    const tagName = el.tagName.toLowerCase();
    if (semanticTags.has(tagName)) return true;
    if (el.id) return true;
    if (el.className && typeof el.className === "string") {
      const classes = el.className.trim();
      if (classes && classes.length > 0) return true;
    }
    return Array.from(el.attributes).some((attr) =>
      attr.name.startsWith("data-"),
    );
  };

  const getAncestorChain = (el: Element, maxDepth: number = 10): Element[] => {
    const ancestors: Element[] = [];
    let current = el.parentElement;
    let depth = 0;

    while (current && depth < maxDepth && current.tagName !== "BODY") {
      if (hasDistinguishingFeatures(current)) {
        ancestors.push(current);
        if (ancestors.length >= 3) break;
      }
      current = current.parentElement;
      depth++;
    }

    return ancestors.reverse();
  };

  const getCSSPath = (el: Element): string => {
    const parts: string[] = [];
    let current: Element | null = el;
    let depth = 0;
    const maxDepth = 5;

    while (current && depth < maxDepth && current.tagName !== "BODY") {
      let selector = current.tagName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
        parts.unshift(selector);
        break;
      } else if (
        current.className &&
        typeof current.className === "string" &&
        current.className.trim()
      ) {
        const classes = current.className.trim().split(/\s+/).slice(0, 2);
        selector += `.${classes.join(".")}`;
      }

      if (
        !current.id &&
        (!current.className || !current.className.trim()) &&
        current.parentElement
      ) {
        const siblings = Array.from(current.parentElement.children);
        const index = siblings.indexOf(current);
        if (index >= 0 && siblings.length > 1) {
          selector += `:nth-child(${index + 1})`;
        }
      }

      parts.unshift(selector);
      current = current.parentElement;
      depth++;
    }

    return parts.join(" > ");
  };

  const getElementTag = (el: Element, compact: boolean = false): string => {
    const tagName = el.tagName.toLowerCase();
    const attrs: string[] = [];

    if (el.id) {
      attrs.push(`id="${el.id}"`);
    }

    if (el.className && typeof el.className === "string") {
      const classes = el.className.trim().split(/\s+/);
      if (classes.length > 0 && classes[0]) {
        const displayClasses = compact ? classes.slice(0, 3) : classes;
        let classStr = displayClasses.join(" ");
        if (classStr.length > 30) {
          classStr = classStr.substring(0, 30) + "...";
        }
        attrs.push(`class="${classStr}"`);
      }
    }

    const dataAttrs = Array.from(el.attributes).filter((attr) =>
      attr.name.startsWith("data-"),
    );
    const displayDataAttrs = compact ? dataAttrs.slice(0, 1) : dataAttrs;
    for (const attr of displayDataAttrs) {
      let value = attr.value;
      if (value.length > 20) {
        value = value.substring(0, 20) + "...";
      }
      attrs.push(`${attr.name}="${value}"`);
    }

    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel && !compact) {
      let value = ariaLabel;
      if (value.length > 20) {
        value = value.substring(0, 20) + "...";
      }
      attrs.push(`aria-label="${value}"`);
    }

    return attrs.length > 0
      ? `<${tagName} ${attrs.join(" ")}>`
      : `<${tagName}>`;
  };

  const getClosingTag = (el: Element) => {
    return `</${el.tagName.toLowerCase()}>`;
  };

  const getTextContent = (el: Element) => {
    let text = el.textContent || "";
    text = text.trim().replace(/\s+/g, " ");
    const maxLength = 60;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getSiblingIdentifier = (el: Element): null | string => {
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === "string") {
      const classes = el.className.trim().split(/\s+/);
      if (classes.length > 0 && classes[0]) {
        return `.${classes[0]}`;
      }
    }
    return null;
  };

  const lines: string[] = [];

  lines.push(`Path: ${getCSSPath(element)}`);
  lines.push("");

  const ancestors = getAncestorChain(element);

  for (let i = 0; i < ancestors.length; i++) {
    const indent = "  ".repeat(i);
    lines.push(indent + getElementTag(ancestors[i], true));
  }

  const parent = element.parentElement;
  let targetIndex = -1;
  if (parent) {
    const siblings = Array.from(parent.children);
    targetIndex = siblings.indexOf(element);

    if (targetIndex > 0) {
      const prevSibling = siblings[targetIndex - 1];
      const prevId = getSiblingIdentifier(prevSibling);
      if (prevId && targetIndex <= 2) {
        const indent = "  ".repeat(ancestors.length);
        lines.push(`${indent}  ${getElementTag(prevSibling, true)}`);
        lines.push(`${indent}  </${prevSibling.tagName.toLowerCase()}>`);
      } else if (targetIndex > 0) {
        const indent = "  ".repeat(ancestors.length);
        lines.push(
          `${indent}  ... (${targetIndex} element${
            targetIndex === 1 ? "" : "s"
          })`,
        );
      }
    }
  }

  const indent = "  ".repeat(ancestors.length);
  lines.push(indent + "  <!-- SELECTED -->");

  const textContent = getTextContent(element);
  const childrenCount = element.children.length;

  if (textContent && childrenCount === 0 && textContent.length < 40) {
    lines.push(
      `${indent}  ${getElementTag(element)}${textContent}${getClosingTag(
        element,
      )}`,
    );
  } else {
    lines.push(indent + "  " + getElementTag(element));
    if (textContent) {
      lines.push(`${indent}    ${textContent}`);
    }
    if (childrenCount > 0) {
      lines.push(
        `${indent}    ... (${childrenCount} element${
          childrenCount === 1 ? "" : "s"
        })`,
      );
    }
    lines.push(indent + "  " + getClosingTag(element));
  }

  if (parent && targetIndex >= 0) {
    const siblings = Array.from(parent.children);
    const siblingsAfter = siblings.length - targetIndex - 1;
    if (siblingsAfter > 0) {
      const nextSibling = siblings[targetIndex + 1];
      const nextId = getSiblingIdentifier(nextSibling);
      if (nextId && siblingsAfter <= 2) {
        lines.push(`${indent}  ${getElementTag(nextSibling, true)}`);
        lines.push(`${indent}  </${nextSibling.tagName.toLowerCase()}>`);
      } else {
        lines.push(
          `${indent}  ... (${siblingsAfter} element${
            siblingsAfter === 1 ? "" : "s"
          })`,
        );
      }
    }
  }

  for (let i = ancestors.length - 1; i >= 0; i--) {
    const indent = "  ".repeat(i);
    lines.push(indent + getClosingTag(ancestors[i]));
  }

  return lines.join("\n");
};
