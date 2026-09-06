import styled from "@emotion/styled";

export const ModalBackdrop = styled("div")({
  position: "absolute",
  inset: 0,
  background: "rgba(1, 6, 10, 0.42)",
  zIndex: 900,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "28px",
  pointerEvents: "auto",
  "@media (max-width: 820px)": {
    alignItems: "flex-end",
    padding: "10px",
  },
});

export const ModalPanel = styled("article")({
  width: "min(460px, calc(100vw - 56px))",
  maxHeight: "calc(100vh - 56px)",
  overflow: "auto",
  background: "rgba(15, 24, 34, 0.98)",
  border: "1px solid var(--line)",
  borderRadius: "24px",
  boxShadow: "var(--shadow)",
  padding: "18px",
  "& h2": {
    margin: "4px 0 5px",
    fontSize: "26px",
    letterSpacing: "-0.03em",
  },
  "@media (max-width: 820px)": {
    width: "100%",
    maxHeight: "72vh",
    borderRadius: "22px",
  },
});

export const ModalHead = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
});

export const Meta = styled("div")({
  color: "var(--muted)",
  fontSize: "13px",
});

export const Close = styled("button")({
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "1px solid var(--line)",
  background: "var(--surface2)",
  color: "var(--text)",
  fontSize: "21px",
});

export const PlaceStateRow = styled("div")({
  display: "flex",
  gap: "7px",
  flexWrap: "wrap",
  margin: "14px 0 2px",
  "& button": {
    border: "1px solid var(--line)",
    background: "var(--surface2)",
    color: "var(--muted)",
    padding: "8px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
  },
  "& button.state-active": {
    background: "var(--accent2)",
    borderColor: "var(--accent2)",
    color: "#06121C",
  },
});

export const Gallery = styled("div")({
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gridTemplateRows: "100px 100px",
  gap: "7px",
  margin: "16px 0",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
    background: "var(--surface2)",
  },
  "& img:first-child": {
    gridRow: "1/3",
  },
  "&.one": {
    display: "block",
    height: "220px",
  },
  "&.one img": {
    height: "220px",
  },
});

export const Summary = styled("div")({
  lineHeight: 1.58,
  color: "#DCE5EC",
  fontSize: "14px",
});

export const QuickFactsGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  marginTop: "16px",
  "& > div": {
    background: "var(--surface2)",
    border: "1px solid var(--line)",
    borderRadius: "12px",
    padding: "10px",
  },
  "& span": {
    display: "block",
    color: "var(--muted)",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "5px",
  },
  "& b": {
    fontSize: "12px",
    lineHeight: 1.3,
  },
  "& .winter-seasonal": {
    borderColor: "rgba(255, 143, 143, 0.55) !important",
  },
  "& .winter-difficult": {
    borderColor: "rgba(244, 201, 93, 0.48) !important",
  },
  "@media (max-width: 820px)": {
    gridTemplateColumns: "1fr",
  },
});

export const AddDayWrap = styled("div")({
  position: "relative",
  marginTop: "14px",
});

export const Secondary = styled("button")({
  borderRadius: "12px",
  padding: "11px 14px",
  border: "1px solid var(--line)",
  textDecoration: "none",
  fontWeight: 650,
  background: "transparent",
  color: "var(--text)",
  "&.wide": {
    width: "100%",
  },
});

export const DayPicker = styled("div")({
  position: "absolute",
  zIndex: 10,
  bottom: "44px",
  left: 0,
  right: 0,
  background: "#111C27",
  border: "1px solid var(--line)",
  borderRadius: "12px",
  padding: "6px",
  boxShadow: "var(--shadow)",
  maxHeight: "180px",
  overflow: "auto",
  "& button": {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "transparent",
    color: "var(--text)",
    border: 0,
    padding: "9px 10px",
    borderRadius: "8px",
  },
  "& button:hover": {
    background: "var(--surface2)",
  },
});

export const Actions = styled("div")({
  display: "flex",
  gap: "10px",
  marginTop: "18px",
});

export const SecondaryLink = styled("a")({
  borderRadius: "12px",
  padding: "11px 14px",
  border: "1px solid var(--line)",
  textDecoration: "none",
  fontWeight: 650,
  background: "transparent",
  color: "var(--text)",
  "&.wide": {
    width: "100%",
  },
});
