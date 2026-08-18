import { useState } from "react";

function generateId() {
  return "ORD-" + Math.floor(1000 + Math.random() * 9000);
}

async function sendOrder(order) {
  const initData = window?.Telegram?.WebApp?.initData || "";

  const res = await fetch("/api/send-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData, ...order }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed");
  }
  return res.json();
}

const lbl = { display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 };

export default function OrderModal({ product, qty, total, t, lang, onClose }) {
  const [step, setStep] = useState("form");
  const [orderId, setOrderId] = useState(generateId);
  const [focused, setFocus] = useState(null);
  const [form, setForm] = useState({ name: "", phone1: "", phone2: "", address: "" });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.name.trim() && form.phone1.trim() && form.address.trim();

  const inp = (name) => ({
    width: "100%", padding: "11px 13px", border: `1.5px solid ${focused === name ? "#16a34a" : "#e5e7eb"}`,
    borderRadius: 11, fontSize: 14, color: "#111", outline: "none", fontFamily: "inherit",
    boxSizing: "border-box", background: "#fff", transition: "border-color 0.15s",
  });

  async function submit() {
    if (!valid) return;
    setStep("loading");
    try {
      const result = await sendOrder({
        name: form.name.trim(),
        phone1: form.phone1.trim(),
        phone2: form.phone2.trim(),
        address: form.address.trim(),
        productName: product.name,
        qty,
        total,
        lang,
      });
      if (result.orderId) setOrderId(result.orderId);
      setStep("success");
    } catch { setStep("error"); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 100, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 480, margin: "0 auto", padding: "0 20px 32px", maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 34, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "12px auto 16px" }} />

        {step === "form" && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b7280", fontFamily: "inherit" }}>
              ← {t.back}
            </button>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f2e1a", flex: 1 }}>{t.modalTitle}</div>
          </div>

          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 18 }}>{t.modalSub(qty)}</div>

          {[
            { key: "name", lbl: t.nameLbl, ph: t.namePh, type: "text" },
            { key: "phone1", lbl: t.ph1Lbl, ph: t.ph1Ph, type: "tel" },
            { key: "address", lbl: t.addrLbl, ph: t.addrPh, type: "text" },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 13 }}>
              <label style={lbl}>{field.lbl}</label>
              <input style={inp(field.key)} placeholder={field.ph} type={field.type}
                value={form[field.key]} onChange={e => set(field.key, e.target.value)}
                onFocus={() => setFocus(field.key)} onBlur={() => setFocus(null)} />
            </div>
          ))}

          {/* Phone 2 optional */}
          <div style={{ marginBottom: 13 }}>
            <label style={lbl}>{t.ph2Lbl} <span style={{ fontSize: 10, fontWeight: 400, color: "#9ca3af" }}>{t.optional}</span></label>
            <input style={inp("phone2")} placeholder={t.ph2Ph} type="tel"
              value={form.phone2} onChange={e => set("phone2", e.target.value)}
              onFocus={() => setFocus("phone2")} onBlur={() => setFocus(null)} />
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 11, padding: "11px 13px", fontSize: 12, color: "#166534", lineHeight: 1.55, marginBottom: 18 }}>
            {t.cashNote}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #f3f4f6", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{t.totalLbl}</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>{total.toLocaleString("en-Us")} sum</span>;
          </div>

          <button onClick={submit} disabled={!valid}
            style={{ width: "100%", padding: "14px", background: valid ? "#16a34a" : "#9ca3af", color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 700, cursor: valid ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
            {t.confirmBtn}
          </button>
        </>}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "52px 0" }}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>⏳</div>
          </div>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center", padding: "14px 0 8px" }}>
            <div style={{ width: 62, height: 62, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 14px" }}>✅</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#0f2e1a", marginBottom: 14 }}>{t.sucTitle}</div>
            <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 13, padding: "13px 15px", textAlign: "left", marginBottom: 13 }}>
              {[["🧾", orderId], ["📦", `${qty} × ${product.name} — ${total.toLocaleString("en-US")} sum`], ["📍", form.address], ["📞", form.phone1], form.phone2 && ["📞", form.phone2]].filter(Boolean).map(([icon, text], i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#374151", marginBottom: 5 }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 18 }}>{t.sucNote}</div>
            <button onClick={onClose} style={{ width: "100%", padding: "12px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 11, fontSize: 13, fontWeight: 600, color: "#166534", cursor: "pointer", fontFamily: "inherit" }}>
              {t.backShop}
            </button>
          </div>
        )}

        {step === "error" && (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>⚠️</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
            <button onClick={() => setStep("form")} style={{ width: "100%", padding: "13px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>Try again</button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px", background: "#f3f4f6", border: "none", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
