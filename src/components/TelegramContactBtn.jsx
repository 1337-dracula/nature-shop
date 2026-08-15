export default function TelegramContactBtn({ username, message }) {
  const url = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
  return (
    <>
      <style>{`
        @keyframes tg-pulse {
          0%,100% { box-shadow: 0 4px 16px rgba(41,182,246,0.4); }
          50%      { box-shadow: 0 4px 28px rgba(41,182,246,0.75); }
        }
      `}</style>
      <a href={url} target="_blank" rel="noreferrer" aria-label="Contact on Telegram"
        style={{ position: "fixed", bottom: 24, right: 20, zIndex: 999, width: 54, height: 54, borderRadius: "50%", background: "#29B6F6", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", animation: "tg-pulse 2.5s ease-in-out infinite" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21.8 2.15a1 1 0 0 0-1.02-.15L2.3 9.36a1 1 0 0 0 .06 1.88l4.67 1.56 2.07 6.2a1 1 0 0 0 1.74.28l2.42-2.9 4.74 3.47a1 1 0 0 0 1.55-.63l2.9-16a1 1 0 0 0-.65-1.07z" fill="#fff" />
        </svg>
      </a>
    </>
  );
}
