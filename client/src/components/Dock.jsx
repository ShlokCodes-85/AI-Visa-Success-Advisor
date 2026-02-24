import React, { useState } from "react";
import "../App.css";

export default function Dock({ items, panelHeight = 68, baseItemSize = 50 }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="dock-outer" style={{ height: panelHeight }}>
      <div className="dock-panel">
        {items.map((item, idx) => (
          <button
            key={idx}
            className={`dock-item${item.label && item.label.toLowerCase().includes('logout') ? ' dock-logout' : ''}`}
            style={{ width: baseItemSize, height: baseItemSize }}
            onClick={item.onClick}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="dock-icon">{item.icon}</span>
            {hovered === idx && (
              <span className="dock-label">{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
