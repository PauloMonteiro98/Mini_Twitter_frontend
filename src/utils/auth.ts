export function getLoggedUserId(): number | null {
  const token = localStorage.getItem('@MiniTwitter:token');
  
  if (!token) return null;

  try {
    // O JWT tem 3 partes separadas por ponto. A segunda [1] é o payload (dados)
    const payloadBase64 = token.split('.')[1];
    
    // Converte de Base64 para uma string JSON legível
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    // Retorna o ID (no JWT, costuma vir como 'id' ou 'sub')
    return payload.id || payload.sub || null;
  } catch (error) {
    console.error("Erro ao decodificar o token", error);
    return null;
  }
}