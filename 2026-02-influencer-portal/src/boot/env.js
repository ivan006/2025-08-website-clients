export default ({ app }) => {
  app.config.globalProperties.$apiProxyUrl =
    import.meta.env.VITE_API_PROXY_URL + "/data-cache/index.php?url=" || "";
};
