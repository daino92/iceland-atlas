import styled from "@emotion/styled";

export const MapToolsBar = styled("div")({
  position: "absolute",
  zIndex: 520,
  top: "18px",
  right: "18px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  "& button": {
    border: "1px solid var(--line)",
    background: "rgba(8, 16, 24, 0.9)",
    color: "var(--text)",
    backdropFilter: "blur(10px)",
    padding: "9px 12px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    fontSize: "12px",
    fontWeight: 700,
  },
  "& button.active": {
    background: "#D7F5FF",
    color: "#06121C",
  },
  "@media (max-width: 820px)": {
    top: "14px",
    right: "14px",
    left: "auto",
    "& button": {
      padding: "8px 10px",
    },
  },
});

export const ActiveDayPill = styled("button")({
  maxWidth: "220px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
