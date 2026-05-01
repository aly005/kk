const mountNode = document.getElementById("root");

function showStartupError(title, error) {
  const details = (error && (error.stack || error.message)) || String(error);
  mountNode.innerHTML = `
    <div style="max-width:900px;margin:20px auto;padding:16px;border:1px solid #fca5a5;background:#fff1f2;border-radius:10px;font-family:Segoe UI,Tahoma,sans-serif;">
      <h2 style="margin-top:0;color:#9f1239;">${title}</h2>
      <p style="color:#334155;">The app could not start. Copy this error and send it in chat.</p>
      <pre style="white-space:pre-wrap;word-break:break-word;background:#fff;padding:12px;border-radius:8px;border:1px solid #fecdd3;">${details}</pre>
      <p style="color:#475569;">Tip: make sure internet is available because React libraries are loaded from CDN.</p>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  showStartupError("Runtime Error", event.error || event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  showStartupError("Unhandled Promise Rejection", event.reason);
});

async function boot() {
  try {
    const [{ default: React }, { createRoot }, { BrowserRouter }, { default: App }, { AppProvider }] =
      await Promise.all([
        import("react"),
        import("react-dom/client"),
        import("react-router-dom"),
        import("./App.js"),
        import("./context/AppContext.js")
      ]);

    const root = createRoot(mountNode);
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(AppProvider, null, React.createElement(App))
        )
      )
    );
  } catch (error) {
    showStartupError("Startup Error", error);
  }
}

boot();
