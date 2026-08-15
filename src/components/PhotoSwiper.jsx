import { useState, useRef } from "react";

export default function PhotoSwiper({ photos, labels }) {
  const [current, setCurrent] = useState(0);
  const startX = useRef(null);

  function go(n) {
    setCurrent(Math.max(0, Math.min(photos.length - 1, n)));
  }

  function onTouchStart(e) { startX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
    startX.current = null;
  }
  function onMouseDown(e) { startX.current = e.clientX; }
  function onMouseUp(e) {
    if (startX.current === null) return;
    const diff = startX.current - e.clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
    startX.current = null;
  }

  return (
    <div
      style={{ position: "relative", overflow: "hidden", height: 200, cursor: "grab", userSelect: "none" }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown} onMouseUp={onMouseUp}
    >
      {/* Slide strip */}
      <div style={{ display: "flex", height: "100%", transform: `translateX(-${current * 100}%)`, transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        {photos.map((photo, i) => (
          <div key={i} style={{ minWidth: "100%", height: "100%", background: photo.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 72, gap: 6 }}>
            {/* Replace with <img src={photo.src} style={{width:"100%",height:"100%",objectFit:"cover"}} /> when you have real photos */}
            <span>{photo.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>{labels[i]}</span>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {current > 0 && (
        <button onClick={() => go(current - 1)} style={arrow("left")} aria-label="Previous">‹</button>
      )}
      {current < photos.length - 1 && (
        <button onClick={() => go(current + 1)} style={arrow("right")} aria-label="Next">›</button>
      )}

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
        {photos.map((_, i) => (
          <div key={i} onClick={() => go(i)} style={{ width: current === i ? 16 : 6, height: 6, borderRadius: 3, background: current === i ? "#16a34a" : "rgba(255,255,255,0.6)", cursor: "pointer", transition: "all 0.2s" }} />
        ))}
      </div>
    </div>
  );
}

function arrow(side) {
  return { position: "absolute", top: "50%", transform: "translateY(-50%)", [side]: 8, width: 28, height: 28, borderRadius: "50%", border: "0.5px solid #e5e7eb", background: "rgba(255,255,255,0.9)", fontSize: 20, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, lineHeight: 1 };
}
