export function useAuth() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const isAdmin = user.role === 'Administrateur';
  const isSupport = user.role === 'Support';
  const isLecteur = user.role === 'Lecteur';
  const canEdit = isAdmin || isSupport;

  return { user, isAdmin, isSupport, isLecteur, canEdit };
}