import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ROUTES } from "../app/routes";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import ResearchWorkspacePage from "../pages/ResearchWorkspacePage";
import ThesisBuilderPage from "../features/thesis/pages/ThesisBuilderPage";

import LoginPage from "../features/auth/pages/LoginPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route
            path={ROUTES.HOME}
            element={<DashboardPage />}
          />

          <Route
            path={ROUTES.RESEARCH_WORKSPACE}
            element={<ResearchWorkspacePage />}
          />

          <Route
            path={ROUTES.THESIS_BUILDER}
            element={<ThesisBuilderPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;