import { Route, Routes } from "react-router-dom";

import { Atlas, PlaceDetail } from "@/components";
import { useLanguage } from "@/hooks";

const App = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <Routes>
      <Route
        path="/"
        element={<Atlas language={language} setLanguage={setLanguage} />}
      />
      <Route path="/place/:id" element={<PlaceDetail language={language} />} />
      <Route
        path="*"
        element={<Atlas language={language} setLanguage={setLanguage} />}
      />
    </Routes>
  );
};

export default App;
