import { useState } from "react";
import { STRINGS, detectLang } from "./i18n";
import PhotoSwiper from "./components/PhotoSwiper";
import OrderModal from "./components/OrderModal";
import TelegramContactBtn from "./components/TelegramContactBtn";

const TELEGRAM_USERNAME = "YourUsername"; // ← change this

const PRODUCT = { name: "Detoxsioma", price: 1370000, stock: 48 };

const PHOTOS = [
  { src: "/photos/detox.jpg", bg: "#ecfdf5" },
  { src: "/photos/detoxbox.jpg", bg: "#fdf4ff" },
];

export default function App() {
  const [lang, setLang] = useState(detectLang);
  const [qty, setQty] = useState(1);
  const [modalOpen, setModal] = useState(false);
  const t = STRINGS[lang];
  const total = PRODUCT.price * qty;

  return (
    <div style={{ minHeight: "100vh", background: "#f6faf7", fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 480, margin: "0 auto" }}>

      {/* NAVBAR */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #d1fae5", padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 17, fontWeight: 700, color: "#14532d" }}>
          🌿 Natura
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["uz", "ru", "en"].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding: "4px 9px", borderRadius: 20, border: "1px solid", borderColor: lang === l ? "#166534" : "#d1fae5", background: lang === l ? "#166634" : "#f0fdf4", color: lang === l ? "#fff" : "#166534", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: lang === l ? "#166534" : "#f0fdf4" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* CASH STRIP */}
      <div style={{ background: "#f0fdf4", borderBottom: "1px solid #d1fae5", padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#166534", textAlign: "center" }}>
        {t.cashLabel}
      </div>

      {/* PHOTO SWIPER */}
      <PhotoSwiper photos={PHOTOS} labels={[t.photo1, t.photo2, t.photo3, t.photo4]} />

      {/* PRODUCT BODY */}
      <div style={{ padding: "16px 16px 100px" }}>
        <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
          <span style={{ background: "#d1fae5", color: "#166534", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{t.badge}</span>
          <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "0.5px solid #e5e7eb" }}>{t.stock(PRODUCT.stock)}</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f2e1a", letterSpacing: "-0.4px", marginBottom: 4 }}>{PRODUCT.name}</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>{t.sub}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          {[t.b1, t.b2, t.b3].map(b => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#374151" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
              {b}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, paddingTop: 14, borderTop: "1px solid #f3f4f6", marginBottom: 16 }}>{t.desc}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>{total.toLocaleString("en-Us")} sum</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "5px 12px", borderRadius: 20 }}>{t.cashPill}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#374151", flex: 1 }}>{t.qtyLabel}</span>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #d1fae5", background: "#f0fdf4", fontSize: 20, color: "#16a34a", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>−</button>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f2e1a", minWidth: 24, textAlign: "center" }}>{qty}</span>
          <button onClick={() => setQty(q => Math.min(PRODUCT.stock, q + 1))} style={{ width: 34, height: 34, borderRadius: 10, border: "1.5px solid #d1fae5", background: "#f0fdf4", fontSize: 20, color: "#16a34a", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+</button>
        </div>

        <button onClick={() => setModal(true)} style={{ width: "100%", padding: "15px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {t.orderBtn(total)}
        </button>
      </div>

      <TelegramContactBtn username={TELEGRAM_USERNAME} message={t.tgMessage} />

      {modalOpen && (
        <OrderModal product={PRODUCT} qty={qty} total={total} t={t} lang={lang} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
