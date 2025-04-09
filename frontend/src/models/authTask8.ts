export function useAuthTask8() {
  const isLoginTask8 = localStorage.getItem('authorization_token');
  return isLoginTask8;
}
