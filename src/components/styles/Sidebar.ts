import styled from "@emotion/styled";

export const SidebarPanel = styled("aside")({
  background: "rgba(8, 16, 24, 0.97)",
  borderRight: "1px solid var(--line)",
  padding: "22px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  zIndex: 600,
  minHeight: 0,
  "@media (max-width: 820px)": {
    position: "absolute",
    left: "12px",
    right: "12px",
    top: "12px",
    zIndex: 700,
    border: "1px solid var(--line)",
    borderRadius: "20px",
    maxHeight: "56vh",
    boxShadow: "var(--shadow)",
    display: "none",
    "&.open": {
      display: "flex",
    },
  },
});

export const BrandRow = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const Brand = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "14px",
  "& h1": {
    margin: 0,
    fontSize: "28px",
    letterSpacing: "-0.04em",
  },
  "& p": {
    margin: "6px 0 0",
    color: "var(--muted)",
    fontSize: "13px",
  },
});

export const Count = styled("span")({
  padding: "6px 9px",
  border: "1px solid var(--line)",
  borderRadius: "999px",
  color: "var(--accent2)",
  fontSize: "12px",
  whiteSpace: "nowrap",
});

export const SidebarTabs = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "12px",
  padding: "3px",
  "& button": {
    border: 0,
    background: "transparent",
    color: "var(--muted)",
    padding: "8px 10px",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: 750,
  },
  "& button.active": {
    background: "var(--accent2)",
    color: "#06121C",
  },
});

export const Search = styled("input")({
  width: "100%",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "13px",
  color: "var(--text)",
  padding: "12px 13px",
  outline: "none",
  "&:focus": {
    borderColor: "rgba(155, 215, 255, 0.7)",
    boxShadow: "0 0 0 3px rgba(155, 215, 255, 0.1)",
  },
});

export const SectionTitle = styled("p")({
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "var(--muted)",
  margin: "0 0 9px",
});

export const Filters = styled("div")({
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  "&.compact-filters": {
    maxHeight: "78px",
    overflow: "auto",
  },
  "&.status-filters .chip": {
    fontWeight: 700,
  },
});

export const Chip = styled("button")({
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--muted)",
  padding: "7px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  "&.active": {
    background: "var(--accent2)",
    color: "#06121C",
    borderColor: "var(--accent2)",
  },
});

export const Results = styled("div")({
  overflow: "auto",
  paddingRight: "4px",
});

export const PlaceRow = styled("button")({
  display: "block",
  width: "100%",
  textAlign: "left",
  border: 0,
  borderBottom: "1px solid var(--line)",
  background: "transparent",
  color: "var(--text)",
  padding: "12px 2px",
  "&:hover": {
    color: "var(--accent)",
  },
  "& small": {
    display: "block",
    color: "var(--muted)",
    marginTop: "4px",
  },
});

export const PlaceRowMain = styled("span")({
  display: "flex",
  alignItems: "center",
  gap: "9px",
});

export const MiniCategory = styled("span")({
  width: "24px",
  height: "24px",
  display: "inline-grid",
  placeItems: "center",
  borderRadius: "8px",
  background: "var(--surface2)",
  fontSize: "12px",
  flex: "none",
  "&.cat-waterfall": {
    background: "#168BD2",
  },
  "&.cat-thermal": {
    background: "#C85B35",
  },
  "&.cat-glacier": {
    background: "#6AA8C8",
  },
  "&.cat-beach": {
    background: "#457C91",
  },
  "&.cat-viewpoint": {
    background: "#6F62B6",
  },
  "&.cat-parking": {
    background: "#446176",
  },
  "&.cat-stay": {
    background: "#8A5E9C",
  },
  "&.cat-shop": {
    background: "#55865C",
  },
  "&.cat-fuel": {
    background: "#9A7044",
  },
  "&.cat-food": {
    background: "#A55151",
  },
});

export const Empty = styled("div")({
  color: "var(--muted)",
  fontSize: "14px",
  padding: "18px 0",
});
