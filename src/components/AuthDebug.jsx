import { useAuthStore } from '../store/authStore';

const AuthDebug = () => {
  const { user, token, isAuthenticated, checkAuth } = useAuthStore();
  
  const handleCheckAuth = () => {
    checkAuth();
  };

  const handleCheckLocalStorage = () => {
    const token = localStorage.getItem('auth_token');
    console.log('LocalStorage token:', token);
  };

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-2 text-sm">
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>User: {user ? JSON.stringify(user, null, 2) : 'None'}</div>
        <div>Token: {token ? 'Present' : 'None'}</div>
        <div>LocalStorage Token: {localStorage.getItem('auth_token') ? 'Present' : 'None'}</div>
      </div>
      <div className="mt-4 space-x-2">
        <button 
          onClick={handleCheckAuth}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Check Auth
        </button>
        <button 
          onClick={handleCheckLocalStorage}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Check LocalStorage
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
