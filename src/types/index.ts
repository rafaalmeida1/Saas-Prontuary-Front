export interface Paciente {
    id: string | number;
    nome: string;
    genero: string;
    raca: string;
    data_entrada_clinica: string;
    data_nascimento: string;
    imagem_url: string;
  }
  
  export interface Prontuario {
    id: string;
    paciente_id: string;
    historico_saude: string;
    historico_nutricional: string;
    observacoes: string;
    nivel_assistencia_nutricao: string;
    condicao_fisica: string;
    presenca_edema: boolean;
    localizacao_edema: string;
    avaliacao_subjetiva: string;
    apresenta_lipodistrofia: boolean;
    localizacao_lipodistrofia: string;
    frequencia_defecacao: string;
    caracteristicas_fezes: string;
    frequencia_miccao: string;
    caracteristicas_urina: string;
    qualidade_sono: string;
    hora_dormir: string;
    hora_acordar: string;
    sinais_e_sintomas: string;
    historico_atual_patologias: string;
    medicacoes_atuais: string;
    dificuldade_engolir: string;
    classificacao_apetite: string;
    ingestao_alimentar: string;
    tipo_dieta_atual: string;
    alimentos_preferidos: string;
    alimentos_menos_preferidos: string;
    alergias: boolean;
    alergia_detalhes: string;
    queixas_reclamacoes: string;
    periodo_avaliacao: string;
    mes: string;
    evolucao_dietoterapica: string;
    alteracoes_patologicas_farmacologicas: string;
    tipo_prescricao: string;
    prescricao_detalhada: string;
  }
  
  export interface Acompanhamento {
    id: string;
    prontuario_id: string;
    data: string;
    peso_direito: number;
    altura_direita: number;
    imc_direito: number;
    porcentagem_gordura_direita: number;
    altura_joelho_direito: number;
    braco_direito: number;
    punho_direito: number;
    panturrilha_direita: number;
    circunferencia_abdomen_direito: number;
    circunferencia_pescoco_direito: number;
    peso_esquerdo: number;
    altura_esquerda: number;
    imc_esquerdo: number;
    porcentagem_gordura_esquerda: number;
    altura_joelho_esquerdo: number;
    braco_esquerdo: number;
    punho_esquerdo: number;
    panturrilha_esquerda: number;
    circunferencia_abdomen_esquerda: number;
    circunferencia_pescoco_esquerdo: number;
  }