import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '../components';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const SessionExpiredNoApp = lazy(() => import('../pages/SessionExpiredNoApp'));
const SessionExpiredHasApp = lazy(() => import('../pages/SessionExpiredHasApp'));

export default function RouterApp() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/session-expired-no-app" element={<SessionExpiredNoApp />} />
            <Route path="/session-expired-has-app" element={<SessionExpiredHasApp />} />
            <Route path="/open-app" element={<SessionExpiredHasApp />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

