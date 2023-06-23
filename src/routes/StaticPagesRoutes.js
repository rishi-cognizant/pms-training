import { Routes, Route} from "react-router-dom";

import Prehome from "../screens/Prehome";

const StaticPagesRoutes = () => {
  return (
    <>
      <Routes>
        
        <Route path="/prehome" element={<Prehome />} />
        
      </Routes>
    </>
  );
};

export default (StaticPagesRoutes);
