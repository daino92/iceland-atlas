import styled from "@emotion/styled";

export const MapCanvas = styled("div")({
  width: "100%",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  "& .leaflet-control-attribution": {
    fontSize: "10px !important",
  },
  "& .leaflet-control-zoom a": {
    background: "#111B25 !important",
    color: "#FFF !important",
    borderColor: "var(--line) !important",
  },
  "& .leaflet-control-zoom": {
    border: "1px solid var(--line) !important",
  },
  "& .category-marker-wrap": {
    background: "transparent !important",
    border: "0 !important",
  },
  "& .cluster-marker-wrap": {
    background: "transparent !important",
    border: "0 !important",
  },
  "& .category-marker": {
    width: "30px",
    height: "34px",
    borderRadius: "15px 15px 15px 5px",
    transform: "rotate(-45deg)",
    display: "grid",
    placeItems: "center",
    background: "#0B83C9",
    border: "2px solid rgba(255, 255, 255, 0.95)",
    boxShadow: "0 8px 18px rgba(0, 0, 0, 0.34)",
  },
  "& .category-marker span": {
    transform: "rotate(45deg)",
    fontSize: "13px",
    fontWeight: 900,
    color: "white",
  },
  "& .category-marker.selected": {
    background: "#F4C95D",
    transform: "rotate(-45deg) scale(1.15)",
    boxShadow:
      "0 0 0 4px rgba(244, 201, 93, 0.18),\n      0 10px 22px rgba(0, 0, 0, 0.4)",
  },
  "& .cat-waterfall": {
    background: "#168BD2",
  },
  "& .cat-thermal": {
    background: "#C85B35",
  },
  "& .cat-glacier": {
    background: "#6AA8C8",
  },
  "& .cat-beach": {
    background: "#457C91",
  },
  "& .cat-viewpoint": {
    background: "#6F62B6",
  },
  "& .cat-parking": {
    background: "#446176",
  },
  "& .cat-stay": {
    background: "#8A5E9C",
  },
  "& .cat-shop": {
    background: "#55865C",
  },
  "& .cat-fuel": {
    background: "#9A7044",
  },
  "& .cat-food": {
    background: "#A55151",
  },
  "& .cluster-marker": {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#071B2A",
    border: "2px solid #D7F5FF",
    color: "#D7F5FF",
    fontSize: "13px",
    fontWeight: 850,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  },
  "& .leaflet-overlay-pane path": {
    vectorEffect: "non-scaling-stroke",
  },
  "& .weather-marker-wrap": {
    background: "transparent !important",
    border: "0 !important",
  },
  "& .weather-marker": {
    width: "66px",
    minHeight: "43px",
    padding: "6px 7px",
    borderRadius: "12px",
    background: "rgba(7, 16, 25, 0.9)",
    border: "1px solid rgba(215, 245, 255, 0.5)",
    boxShadow: "0 8px 22px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(8px)",
    textAlign: "center",
  },
  "& .weather-marker b": {
    display: "block",
    color: "#FFF",
    fontSize: "15px",
    lineHeight: 1,
  },
  "& .weather-marker span": {
    display: "block",
    color: "#B7C9D7",
    fontSize: "8px",
    marginTop: "4px",
  },
});
