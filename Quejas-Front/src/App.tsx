import { RouterProvider } from 'react-router-dom';
import { router } from '../src/app/routes/router';
import { AuthProvider } from '../src/features/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}