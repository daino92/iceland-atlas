import styled from "@emotion/styled";

export const LanguageSwitch = styled("div")({
  display: "flex",
  alignSelf: "flex-start",
  border: "1px solid var(--line)",
  borderRadius: "10px",
  overflow: "hidden",
  background: "var(--surface)",
  "& button": {
    border: 0,
    background: "transparent",
    color: "var(--muted)",
    padding: "6px 9px",
    fontSize: "11px",
    fontWeight: 750,
    textDecoration: "none",
    letterSpacing: "0.08em",
  },
  "& a": {
    border: 0,
    background: "transparent",
    color: "var(--muted)",
    padding: "6px 9px",
    fontSize: "11px",
    fontWeight: 750,
    textDecoration: "none",
    letterSpacing: "0.08em",
  },
  "& .active": {
    background: "var(--accent2)",
    color: "#06121C",
  },
  "&.detail-language": {
    alignSelf: "auto",
  },
});

export const Placeholder = styled("div")({
  height: "190px",
  border: "1px dashed var(--line)",
  borderRadius: "14px",
  display: "grid",
  placeItems: "center",
  color: "var(--muted)",
  margin: "16px 0",
  background: "rgba(255, 255, 255, 0.02)",
  "&.hero-placeholder": {
    height: "100%",
    margin: 0,
    border: 0,
  },
});

export const Primary = styled("button")({
  borderRadius: "12px",
  padding: "11px 14px",
  border: "1px solid var(--line)",
  textDecoration: "none",
  fontWeight: 650,
  background: "var(--accent2)",
  color: "#06121C",
  borderColor: "var(--accent2)",
});
