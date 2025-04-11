import { Paciente, Prontuario, Acompanhamento } from '@/types'

const API_URL = 'https://saas-prontuary-production.up.railway.app/api'
// const API_URL = 'http://localhost:3333/api'

// Custom error class for API errors with specific error types and status codes
export class ApiError extends Error {
  public status: number;
  public errorCode: string;
  public details?: any;

  constructor(message: string, status: number, errorCode: string = 'UNKNOWN_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

// Helper function to handle API responses and extract error information
async function handleResponse(response: Response) {
  if (response.status === 401 || response.status === 403) {
    // If token is expired or invalid, handle auth issues
    localStorage.removeItem('token');
    
    // Instead of redirecting immediately, throw an auth error that can be handled by the UI
    throw new ApiError(
      'Autenticação necessária. Faça login novamente.',
      response.status,
      'AUTH_REQUIRED'
    );
  }

  if (!response.ok) {
    // Try to parse error message from response
    let errorMessage = 'Algo deu errado';
    let errorDetails;
    let errorCode = 'API_ERROR';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData.details || undefined;
      errorCode = errorData.code || errorCode;
    } catch (e) {
      // If we can't parse JSON, use the statusText
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new ApiError(errorMessage, response.status, errorCode, errorDetails);
  }
  
  return await response.json();
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
  
  try {
    const response = await fetch(`${API_URL}${url}`, { 
      ...options, 
      headers,
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network errors or other unexpected errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      'NETWORK_ERROR'
    );
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await handleResponse(response);
    return data.token;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle specific login errors with more helpful messages
    throw new ApiError(
      'Falha no login. Verifique suas credenciais e tente novamente.',
      401,
      'LOGIN_FAILED'
    );
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role: 'user' }),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle specific registration errors
    throw new ApiError(
      'Falha no cadastro. Tente novamente com credenciais diferentes.',
      400,
      'REGISTRATION_FAILED'
    );
  }
}

// Paciente APIs with enhanced error handling
export async function getPacientes(): Promise<Paciente[]> {
  try {
    return await fetchWithAuth('/pacientes');
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar pacientes', 500, 'FETCH_PATIENTS_FAILED');
  }
}

export async function createPaciente(pacienteData: Paciente): Promise<Paciente> {
  try {
    return await fetchWithAuth('/pacientes', {
      method: 'POST',
      body: JSON.stringify(pacienteData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao criar paciente', 500, 'CREATE_PATIENT_FAILED');
  }
}

export async function getPaciente(id: string): Promise<Paciente> {
  try {
    return await fetchWithAuth(`/pacientes/${id}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar detalhes do paciente', 500, 'FETCH_PATIENT_FAILED');
  }
}

export async function updatePaciente(id: string, pacienteData: Paciente): Promise<Paciente> {
  try {
    return await fetchWithAuth(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pacienteData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao atualizar paciente', 500, 'UPDATE_PATIENT_FAILED');
  }
}

export async function deletePaciente(id: string): Promise<void> {
  try {
    return await fetchWithAuth(`/pacientes/${id}`, { method: 'DELETE' });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao excluir paciente', 500, 'DELETE_PATIENT_FAILED');
  }
}

// Prontuario APIs
export async function createProntuario(prontuarioData: Prontuario): Promise<Prontuario> {
  try {
    return await fetchWithAuth('/prontuario', {
      method: 'POST',
      body: JSON.stringify(prontuarioData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao criar prontuário', 500, 'CREATE_PRONTUARIO_FAILED');
  }
}

export async function getProntuario(id: string): Promise<Prontuario> {
  try {
    return await fetchWithAuth(`/prontuario/${id}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar prontuário', 500, 'FETCH_PRONTUARIO_FAILED');
  }
}

export async function getProntuarioByPatientId(id: string): Promise<Prontuario> {
  try {
    return await fetchWithAuth(`/prontuario/paciente/${id}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar prontuário do paciente', 500, 'FETCH_PATIENT_PRONTUARIO_FAILED');
  }
}

export async function updateProntuario(id: string, prontuarioData: Prontuario): Promise<Prontuario> {
  try {
    return await fetchWithAuth(`/prontuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prontuarioData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao atualizar prontuário', 500, 'UPDATE_PRONTUARIO_FAILED');
  }
}

export async function deleteProntuario(id: string): Promise<void> {
  try {
    return await fetchWithAuth(`/prontuario/${id}`, { method: 'DELETE' });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao excluir prontuário', 500, 'DELETE_PRONTUARIO_FAILED');
  }
}

// Acompanhamento APIs
export async function createAcompanhamento(acompanhamentoData: Acompanhamento): Promise<Acompanhamento> {
  try {
    return await fetchWithAuth(`/prontuario/${acompanhamentoData.prontuario_id}/acompanhamento`, {
      method: 'POST',
      body: JSON.stringify(acompanhamentoData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao criar acompanhamento', 500, 'CREATE_ACOMPANHAMENTO_FAILED');
  }
}

export async function getAcompanhamento(id: string): Promise<Acompanhamento> {
  try {
    return await fetchWithAuth(`/prontuario/acompanhamento/${id}`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar acompanhamento', 500, 'FETCH_ACOMPANHAMENTO_FAILED');
  }
}

export async function updateAcompanhamento(id: string, acompanhamentoData: Acompanhamento): Promise<Acompanhamento> {
  try {
    return await fetchWithAuth(`/prontuario/acompanhamento/${id}`, {
      method: 'PUT',
      body: JSON.stringify(acompanhamentoData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao atualizar acompanhamento', 500, 'UPDATE_ACOMPANHAMENTO_FAILED');
  }
}

export async function deleteAcompanhamento(id: string): Promise<void> {
  try {
    return await fetchWithAuth(`/prontuario/acompanhamento/${id}`, { method: 'DELETE' });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao excluir acompanhamento', 500, 'DELETE_ACOMPANHAMENTO_FAILED');
  }
}

export async function getAcompanhamentosByProntuario(prontuarioId: string): Promise<Acompanhamento[]> {
  try {
    return await fetchWithAuth(`/prontuario/${prontuarioId}/acompanhamentos`);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar acompanhamentos', 500, 'FETCH_ACOMPANHAMENTOS_FAILED');
  }
}

// User profile APIs
export async function getUserProfile(): Promise<any> {
  try {
    return await fetchWithAuth('/auth/profile');
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar perfil do usuário', 500, 'FETCH_PROFILE_FAILED');
  }
}

export async function updateUserProfile(userData: { username: string }): Promise<any> {
  try {
    return await fetchWithAuth('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao atualizar perfil do usuário', 500, 'UPDATE_PROFILE_FAILED');
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<any> {
  try {
    return await fetchWithAuth('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao alterar senha', 500, 'CHANGE_PASSWORD_FAILED');
  }
}

// Funções para o dashboard
export async function getProntuarios(): Promise<Prontuario[]> {
  try {
    return await fetchWithAuth('/prontuario/todos');
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar todos os prontuários', 500, 'FETCH_ALL_PRONTUARIOS_FAILED');
  }
}

export async function getAcompanhamentoStats(): Promise<{
  total: number;
  ultimaConsulta: string | null;
  porMes: Record<string, number>;
}> {
  try {
    return await fetchWithAuth('/prontuario/acompanhamentos/stats');
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Falha ao buscar estatísticas de acompanhamento', 500, 'FETCH_ACCOMPANIMENT_STATS_FAILED');
  }
}