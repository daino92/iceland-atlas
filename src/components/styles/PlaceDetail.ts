import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const Detail = styled("main")({
  height: "100%",
  overflow: "auto",
  background: "linear-gradient(180deg, #071019, #0B131B)",
  padding: "24px",
  "@media (max-width: 820px)": {
    padding: "16px",
  },
});

export const DetailInner = styled("div")({
  maxWidth: "1050px",
  margin: "0 auto",
});

export const DetailTopbar = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
});

export const Back = styled(Link)({
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  background: "transparent",
  border: "1px solid var(--line)",
  color: "var(--text)",
  padding: "9px 12px",
  borderRadius: "999px",
  textDecoration: "none",
});

export const DetailTitle = styled("h1")({
  margin: "28px 0 8px",
  fontSize: "clamp(40px, 7vw, 78px)",
  letterSpacing: "-0.055em",
  lineHeight: 0.94,
  "@media (max-width: 820px)": {
    marginTop: "22px",
  },
});

export const DetailMeta = styled("div")({
  color: "var(--muted)",
  marginBottom: "24px",
});

export const Hero = styled("div")({
  height: "min(54vw, 520px)",
  minHeight: "280px",
  borderRadius: "26px",
  overflow: "hidden",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  "@media (max-width: 820px)": {
    height: "42vh",
  },
});

export const DetailGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 300px",
  gap: "34px",
  padding: "32px 0 70px",
  "@media (max-width: 820px)": {
    gridTemplateColumns: "1fr",
  },
});

export const DetailCopy = styled("article")({
  fontSize: "17px",
  lineHeight: 1.75,
  color: "#DCE5EC",
});

export const DetailGallery = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
  marginTop: "24px",
  "& img": {
    width: "100%",
    aspectRatio: "4/3",
    objectFit: "cover",
    borderRadius: "14px",
    background: "var(--surface)",
  },
  "@media (max-width: 820px)": {
    gridTemplateColumns: "1fr 1fr",
  },
});

export const Facts = styled("aside")({
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "18px",
  padding: "18px",
  height: "max-content",
  position: "sticky",
  top: "24px",
  "@media (max-width: 820px)": {
    position: "static",
  },
});

export const Fact = styled("div")({
  padding: "10px 0",
  borderBottom: "1px solid var(--line)",
  "&:last-child": {
    borderBottom: 0,
  },
  "& b": {
    display: "block",
    fontSize: "12px",
    color: "var(--muted)",
    marginBottom: "4px",
  },
});
