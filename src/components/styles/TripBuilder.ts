import styled from "@emotion/styled";

export const TripPanel = styled("section")({
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  overflow: "auto",
  paddingRight: "3px",
  "@media (max-width: 820px)": {
    maxHeight: "48vh",
  },
});

export const TripSummary = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "7px",
  "& > div": {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: "12px",
    padding: "10px",
  },
  "& strong": {
    display: "block",
    fontSize: "20px",
  },
  "& span": {
    fontSize: "10px",
    color: "var(--muted)",
  },
});

export const TripStatistics = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px 12px",
  marginTop: "8px",
  color: "var(--muted)",
  fontSize: "10px",
});

export const TripHeading = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
  margin: "18px 0 10px",
  "& h3": {
    margin: 0,
    fontSize: "16px",
  },
  "& p": {
    margin: "4px 0 0",
    color: "var(--muted)",
    fontSize: "11px",
    lineHeight: 1.45,
  },
});

export const IconButton = styled("button")({
  width: "34px",
  height: "34px",
  border: "1px solid var(--line)",
  borderRadius: "10px",
  background: "var(--surface2)",
  color: "var(--text)",
  fontSize: "20px",
});

export const DayList = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const DayCard = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  border: "1px solid var(--line)",
  borderRadius: "12px",
  background: "var(--surface)",
  overflow: "hidden",
  position: "relative",
  "&.selected": {
    borderColor: "rgba(155, 215, 255, 0.62)",
    background: "#122230",
  },
});

export const DayMain = styled("button")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  border: 0,
  background: "transparent",
  color: "var(--text)",
  padding: "10px 11px",
  textAlign: "left",
});

export const DayName = styled("span")({
  fontWeight: 750,
  fontSize: "12px",
});

export const DayCount = styled("span")({
  display: "grid",
  placeItems: "center",
  width: "24px",
  height: "24px",
  borderRadius: "8px",
  background: "var(--surface2)",
  fontSize: "10px",
});

export const DayActions = styled("div")({
  display: "flex",
  paddingRight: "6px",
  "& button": {
    border: 0,
    background: "transparent",
    color: "var(--muted)",
    padding: "6px",
  },
  "& button:hover": {
    color: "var(--text)",
  },
});

export const DayRename = styled("input")({
  gridColumn: "1/-1",
  margin: "0 7px 7px",
  background: "#081018",
  border: "1px solid var(--line)",
  color: "var(--text)",
  borderRadius: "8px",
  padding: "8px",
});

export const ActiveDayDetail = styled("div")({
  marginTop: "12px",
});

export const RouteStats = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "6px",
  "& > div": {
    background: "rgba(255, 255, 255, 0.035)",
    border: "1px solid var(--line)",
    borderRadius: "10px",
    padding: "9px",
  },
  "& b": {
    display: "block",
    fontSize: "12px",
  },
  "& span": {
    fontSize: "9px",
    color: "var(--muted)",
  },
});

export const TripStops = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginTop: "10px",
});

export const TripStop = styled("div")({
  display: "grid",
  gridTemplateColumns: "22px 1fr auto",
  gap: "6px",
  alignItems: "center",
  padding: "7px 5px",
  borderBottom: "1px solid var(--line)",
  cursor: "grab",
  "&.dragging": { opacity: 0.4 },
});

export const StopIndex = styled("span")({
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "var(--surface2)",
  color: "var(--muted)",
  fontSize: "9px",
});

export const TripStopName = styled("button")({
  border: 0,
  background: "transparent",
  color: "var(--text)",
  textAlign: "left",
  padding: "4px",
  fontSize: "11px",
});

export const StopMove = styled("div")({
  "& button": {
    border: 0,
    background: "transparent",
    color: "var(--muted)",
    padding: "6px",
  },
  "& button:hover": {
    color: "var(--text)",
  },
  display: "flex",
  "& button:disabled": {
    opacity: 0.25,
    cursor: "default",
  },
});

export const EmptyTrip = styled("p")({
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--muted)",
  padding: "8px 2px",
});

export const TripActions = styled("div")({
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
  marginBottom: "10px",
  "& button": {
    border: "1px solid var(--line)",
    borderRadius: "9px",
    background: "var(--surface2)",
    color: "var(--text)",
    padding: "7px 9px",
    fontSize: "10px",
  },
});

export const DayEndpoints = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6px",
  marginBottom: "8px",
  "& label": { color: "var(--muted)", fontSize: "10px" },
  "& select": {
    display: "block",
    width: "100%",
    marginTop: "4px",
    background: "var(--surface2)",
    color: "var(--text)",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "6px",
    fontSize: "10px",
  },
  "& input": {
    display: "block",
    width: "100%",
    marginTop: "4px",
    boxSizing: "border-box",
    background: "var(--surface2)",
    color: "var(--text)",
    border: "1px solid var(--line)",
    borderRadius: "8px",
    padding: "6px",
    fontSize: "10px",
  },
});

export const DaylightSummary = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px 12px",
  marginTop: "10px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(155, 215, 255, 0.08)",
  color: "var(--muted)",
  fontSize: "10px",
});

export const FeasibilitySummary = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  marginTop: "6px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(143, 223, 173, 0.14)",
  fontSize: "10px",
  "&.feasibility-full": { background: "rgba(244, 201, 93, 0.16)" },
  "&.feasibility-unrealistic": { background: "rgba(255, 143, 143, 0.16)" },
  "& span": { color: "var(--muted)" },
});

export const RiskSummary = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  marginTop: "8px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(155, 215, 255, 0.08)",
  fontSize: "10px",
  "&.risk-caution": { background: "rgba(244, 201, 93, 0.16)" },
  "&.risk-danger": { background: "rgba(255, 143, 143, 0.16)" },
});

export const RouteWeatherSummary = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  marginTop: "8px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(155, 215, 255, 0.08)",
  fontSize: "10px",
  "& span": { color: "var(--muted)" },
});

export const AuroraSummary = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  marginTop: "6px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(164, 132, 255, 0.14)",
  fontSize: "10px",
  "&.aurora-unlikely": { background: "rgba(255, 143, 143, 0.12)" },
  "&.aurora-good": { background: "rgba(143, 223, 173, 0.14)" },
  "& span": { color: "var(--muted)" },
});

export const BudgetSummary = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  marginTop: "8px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(244, 201, 93, 0.12)",
  fontSize: "10px",
  "& > span": { color: "var(--muted)" },
  "& > span button": {
    marginLeft: "6px",
    border: 0,
    background: "transparent",
    color: "var(--muted)",
  },
});

export const BudgetForm = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 70px auto",
  gap: "4px",
  "& select, & input": {
    minWidth: 0,
    background: "var(--surface2)",
    color: "var(--text)",
    border: "1px solid var(--line)",
    borderRadius: "7px",
    padding: "5px",
    fontSize: "10px",
  },
  "& button": {
    border: "1px solid var(--line)",
    borderRadius: "7px",
    background: "var(--surface2)",
    color: "var(--text)",
    padding: "5px 7px",
    fontSize: "10px",
  },
});

export const TripTimeline = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  marginTop: "6px",
  padding: "8px",
  borderRadius: "9px",
  background: "rgba(155, 215, 255, 0.08)",
  fontSize: "10px",
  "& span": { color: "var(--muted)" },
});
