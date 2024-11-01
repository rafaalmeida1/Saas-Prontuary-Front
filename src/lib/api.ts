import { Paciente, Prontuario, Acompanhamento } from '@/types'

const API_URL = 'https://saas-prontuary-production.up.railway.app/api'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }
  const response = await fetch(`${API_URL}${url}`, { ...options, headers })

  // ver se o token está expirado ou inválido

  if (response.status === 401 || response.status === 403) {
    // Se o token estiver expirado ou inválido, faça logout
    localStorage.removeItem('token')
    window.location.href = '/login'
  }


  if (!response.ok) {
    throw new Error('API request failed')
  }
  return await response.json()
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error('Login failed')
  }
  const data = await response.json()
  return data.token
}

export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role: 'user' }),
  })
  if (!response.ok) {
    throw new Error('Registration failed')
  }
  return response.json()
}

export async function getPacientes(): Promise<Paciente[]> {
  return fetchWithAuth('/pacientes')
}

export async function createPaciente(pacienteData: Paciente): Promise<Paciente> {
  return fetchWithAuth('/pacientes', {
    method: 'POST',
    body: JSON.stringify(pacienteData),
  })
}

export async function getPaciente(id: string): Promise<Paciente> {
  return fetchWithAuth(`/pacientes/${id}`)
}

export async function updatePaciente(id: string, pacienteData: Paciente): Promise<Paciente> {
  return fetchWithAuth(`/pacientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pacienteData),
  })
}

export async function deletePaciente(id: string): Promise<void> {
  return fetchWithAuth(`/pacientes/${id}`, { method: 'DELETE' })
}

export async function createProntuario(prontuarioData: Prontuario): Promise<Prontuario> {
  return fetchWithAuth('/prontuario', {
    method: 'POST',
    body: JSON.stringify(prontuarioData),
  })
}

export async function getProntuario(id: string): Promise<Prontuario> {
  return fetchWithAuth(`/prontuario/${id}`)
}

export async function getProntuarioByPatientId(id: string): Promise<Prontuario> {
  return fetchWithAuth(`/prontuario/paciente/${id}`)
}

export async function updateProntuario(id: string, prontuarioData: Prontuario): Promise<Prontuario> {
  return fetchWithAuth(`/prontuario/${id}`, {
    method: 'PUT',
    body: JSON.stringify(prontuarioData),
  })
}

export async function deleteProntuario(id: string): Promise<void> {
  return fetchWithAuth(`/prontuario/${id}`, { method: 'DELETE' })
}

export async function createAcompanhamento(acompanhamentoData: Acompanhamento): Promise<Acompanhamento> {
  return fetchWithAuth(`/prontuario/${acompanhamentoData.prontuario_id}/acompanhamento`, {
    method: 'POST',
    body: JSON.stringify(acompanhamentoData),
  })
}

export async function getAcompanhamento(id: string): Promise<Acompanhamento> {
  return fetchWithAuth(`/prontuario/acompanhamento/${id}`)
}

export async function updateAcompanhamento(id: string, acompanhamentoData: Acompanhamento): Promise<Acompanhamento> {
  return fetchWithAuth(`/prontuario/acompanhamento/${id}`, {
    method: 'PUT',
    body: JSON.stringify(acompanhamentoData),
  })
}

export async function deleteAcompanhamento(id: string): Promise<void> {
  return fetchWithAuth(`/prontuario/acompanhamento/${id}`, { method: 'DELETE' })
}

export async function getAcompanhamentosByProntuario(prontuarioId: string): Promise<Acompanhamento[]> {
  return fetchWithAuth(`/prontuario/${prontuarioId}/acompanhamentos`)
}