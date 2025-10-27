const IS_NAVIGATOR_CLIPBOARD_AVAILABLE =
  typeof window !== "undefined" &&
  window.navigator.clipboard &&
  window.isSecureContext;

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (IS_NAVIGATOR_CLIPBOARD_AVAILABLE) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }

  const textareaElement = document.createElement("textarea");
  textareaElement.value = text;
  textareaElement.setAttribute("readonly", "");
  textareaElement.style.position = "fixed";
  textareaElement.style.top = "-9999px";
  textareaElement.style.opacity = "0";
  textareaElement.style.pointerEvents = "none";

  const doc = document.body || document.documentElement;
  doc.appendChild(textareaElement);
  textareaElement.select();
  textareaElement.setSelectionRange(0, textareaElement.value.length);

  let didCopyToClipboard = false;
  try {
    didCopyToClipboard = document.execCommand("copy");
  } catch {
    didCopyToClipboard = false;
  } finally {
    doc.removeChild(textareaElement);
  }

  return didCopyToClipboard;
};
