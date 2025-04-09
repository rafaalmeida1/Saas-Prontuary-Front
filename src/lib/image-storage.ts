interface ImageStorageOptions {
  maxSizeKB?: number;
  defaultImage?: string;
}

/**
 * Utilitário para armazenamento local de imagens em base64
 */
export class ImageStorage {
  private readonly storagePrefix: string;
  private readonly maxSizeKB: number;
  public readonly defaultImage: string;

  /**
   * @param storagePrefix - Prefixo para as chaves de armazenamento
   * @param options - Opções de configuração
   */
  constructor(
    storagePrefix: string = 'app_image_',
    options: ImageStorageOptions = {}
  ) {
    this.storagePrefix = storagePrefix;
    this.maxSizeKB = options.maxSizeKB || 500; // 500KB por padrão
    this.defaultImage = options.defaultImage || '/placeholder.png';
  }

  /**
   * Converte um arquivo de imagem para string base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Verificar tamanho máximo
      if (file.size > this.maxSizeKB * 1024) {
        reject(new Error(`Imagem muito grande. Tamanho máximo é ${this.maxSizeKB}KB`));
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Salva uma imagem base64 no localStorage
   */
  saveImage(key: string, base64Image: string): void {
    try {
      localStorage.setItem(`${this.storagePrefix}${key}`, base64Image);
    } catch (error) {
      console.error('Erro ao salvar imagem no localStorage:', error);
      throw new Error('Falha ao armazenar imagem. Verifique o espaço disponível.');
    }
  }

  /**
   * Salva um arquivo de imagem no localStorage
   */
  async saveImageFile(key: string, file: File): Promise<string> {
    try {
      const base64 = await this.fileToBase64(file);
      this.saveImage(key, base64);
      return base64;
    } catch (error) {
      console.error('Erro ao processar e salvar imagem:', error);
      throw error;
    }
  }

  /**
   * Recupera uma imagem do localStorage
   */
  getImage(key: string): string {
    try {
      const image = localStorage.getItem(`${this.storagePrefix}${key}`);
      return image || this.defaultImage;
    } catch (error) {
      console.error('Erro ao recuperar imagem do localStorage:', error);
      return this.defaultImage;
    }
  }

  /**
   * Remove uma imagem do localStorage
   */
  removeImage(key: string): void {
    try {
      localStorage.removeItem(`${this.storagePrefix}${key}`);
    } catch (error) {
      console.error('Erro ao remover imagem do localStorage:', error);
    }
  }

  /**
   * Comprime uma imagem base64 para reduzir seu tamanho
   * Método simples que pode ser expandido com uma biblioteca de compressão
   */
  async compressImage(base64Image: string, maxWidthHeight: number = 800): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Image;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionar mantendo a proporção
        if (width > height && width > maxWidthHeight) {
          height = Math.round((height * maxWidthHeight) / width);
          width = maxWidthHeight;
        } else if (height > maxWidthHeight) {
          width = Math.round((width * maxWidthHeight) / height);
          height = maxWidthHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Falha ao criar contexto de canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85)); // Qualidade 0.85
      };
      
      img.onerror = () => {
        reject(new Error('Falha ao carregar imagem para compressão'));
      };
    });
  }
}

// Criar e exportar uma instância padrão
export const imageStorage = new ImageStorage('patient_image_', {
  maxSizeKB: 500,
  defaultImage: '/placeholder.svg'
}); 