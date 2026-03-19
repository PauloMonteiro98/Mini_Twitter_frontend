export function getLoggedUserId(): number | null {
  const token = localStorage.getItem('@MiniTwitter:token');
  
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    return payload.id || payload.sub || null;
    
  } catch (error) {
    console.error("Erro ao decodificar o token", error);
    return null;
  }
}