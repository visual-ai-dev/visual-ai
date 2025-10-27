export interface ReactGrabPluginOptions {
  adapter?: "cursor";
  enabled?: boolean;
}

export const reactGrab = (options: ReactGrabPluginOptions = {}) => {
  const {
    adapter,
    enabled = true,
  } = options;

  const dataAttrs: string[] = [];

  if (enabled !== undefined) {
    dataAttrs.push(`data-enabled="${enabled}"`);
  }

  if (adapter !== undefined) {
    dataAttrs.push(`data-adapter="${adapter}"`);
  }

  const scriptTag = `<script
      src="//unpkg.com/react-grab/dist/index.global.js"
      crossorigin="anonymous"
      ${dataAttrs.join("\n      ")}
    ></script>`;

  return {
    apply: "serve" as const,
    name: "vite-plugin-react-grab",
    transformIndexHtml: {
      handler(html: string) {
        return html.replace(
          "<head>",
          `<head>
    ${scriptTag}`,
        );
      },
      order: "pre" as const,
    },
  };
};
