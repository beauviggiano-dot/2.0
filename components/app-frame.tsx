// Renders the gated TradeSafe app. The iframe loads /app, which only returns
// the real HTML when the request carries a valid, access-granting session.
export function AppFrame() {
  return (
    <iframe
      src="/app?v=22"
      title="TradeSafe — Day Trading Workflow"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  )
}
