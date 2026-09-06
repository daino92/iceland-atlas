import styled from "@emotion/styled";

export const Shell = styled("div")({
  height: "100%",
  display: "grid",
  gridTemplateColumns: "340px 1fr",
  position: "relative",
  "@media (max-width: 820px)": {
    gridTemplateColumns: "1fr",
  },
});

export const MobileToggle = styled("button")({
  display: "none",
  "@media (max-width: 820px)": {
    display: "block",
    position: "absolute",
    zIndex: 750,
    left: "14px",
    top: "14px",
    border: "1px solid var(--line)",
    background: "rgba(8, 16, 24, 0.92)",
    color: "var(--text)",
    padding: "10px 12px",
    borderRadius: "12px",
  },
});

export const MapWrap = styled("main")({
  width: "100%",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  position: "relative",
});
