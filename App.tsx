
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { HomePage } from "./pages/HomePage";

const EmploymentHistory = lazy(() =>
  import("./pages/EmploymentHistory").then((module) => ({
    default: module.EmploymentHistory,
  }))
);

const ProjectGallery = lazy(() =>
  import("./pages/ProjectGallery").then((module) => ({
    default: module.ProjectGallery,
  }))
);

const routeFallback = (
  <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-mono text-sm text-zinc-500">
    Loading page...
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/experience"
          element={
            <Suspense fallback={routeFallback}>
              <EmploymentHistory />
            </Suspense>
          }
        />
        <Route
          path="/projects"
          element={
            <Suspense fallback={routeFallback}>
              <ProjectGallery />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
