"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";
import { imageStorage } from "@/lib/image-storage";
import { ButtonWithLoading } from "./button-with-loading";

interface ImageUploadProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  imageClassName?: string;
  buttonClassName?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export function ImageUpload({
  id,
  value = "",
  onChange,
  onError,
  className,
  imageClassName,
  buttonClassName,
  maxWidth = 400,
  maxHeight = 400
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value || imageStorage.getImage(id));
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Processar e armazenar a imagem
      const base64 = await imageStorage.fileToBase64(file);
      const compressed = await imageStorage.compressImage(base64, Math.max(maxWidth, maxHeight));
      
      // Salvar no localStorage
      imageStorage.saveImage(id, compressed);
      
      // Atualizar a visualização e notificar a mudança
      setPreviewUrl(compressed);
      onChange(compressed);
      
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(imageStorage.defaultImage);
    onChange("");
    imageStorage.removeImage(id);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <div 
          className={cn(
            "relative overflow-hidden rounded-lg bg-secondary flex items-center justify-center",
            previewUrl ? "border-2 border-primary/20" : "border-2 border-dashed border-muted-foreground/50",
            imageClassName
          )} 
          style={{ width: maxWidth, height: maxHeight, maxWidth: '100%' }}
        >
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="Imagem carregada"
                width={maxWidth}
                height={maxHeight}
                className="object-contain"
                priority
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <Camera className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Clique para selecionar uma imagem</p>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload de imagem"
      />

      <ButtonWithLoading
        type="button"
        onClick={triggerFileInput}
        className={cn("w-full", buttonClassName)}
        isLoading={isUploading}
        loadingText="Processando..."
      >
        <Upload className="mr-2 h-4 w-4" />
        {previewUrl ? "Alterar imagem" : "Selecionar imagem"}
      </ButtonWithLoading>
    </div>
  );
} 