import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import styled from "styled-components";
import { PhotoProvider } from "./contexts/PhotoContext";
import ErrorBoundary from "./shared/components/ErrorBoundary";

// Lazy load route components for better performance
const PhotoGridPage = lazy(() => import("./features/photoGrid/PhotoGridPage"));
const PhotoDetailPage = lazy(() => import("./features/photoDetail/PhotoDetailPage"));

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  return (
    <ErrorBoundary>
      <PhotoProvider>
        <AppContainer>
          <Routes>
            <Route 
              path="/" 
              element={
                <Suspense fallback={<div />}>
                  <PhotoGridPage />
                </Suspense>
              } 
            />
            <Route 
              path="/photo/:id" 
              element={
                <Suspense fallback={<div />}>
                  <PhotoDetailPage />
                </Suspense>
              } 
            />
          </Routes>
        </AppContainer>
      </PhotoProvider>
    </ErrorBoundary>
  );
}

export default App;
