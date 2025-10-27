export interface Adapter {
  name: string;
  open: (promptText: string) => void;
}

export const cursorAdapter: Adapter = {
  name: "cursor",
  open: (promptText) => {
    if (!promptText) return;
    const url = new URL("cursor://anysphere.cursor-deeplink/prompt");
    url.searchParams.set("text", promptText);
    window.open(url.toString(), "_blank");
  },
};
