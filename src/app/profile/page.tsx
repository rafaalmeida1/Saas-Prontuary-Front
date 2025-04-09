"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile, updateUserProfile, changePassword } from "@/lib/api";
import { toastService } from "@/lib/toast-service";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, KeyRound } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        setUsername(data.username);
      } catch (error) {
        toastService.handleError(error, "Não foi possível carregar o perfil do usuário");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      await updateUserProfile({ username });
      
      // Update local state with new data
      if (profile) {
        setProfile({
          ...profile,
          username
        });
      }
      
      toastService.success("Perfil atualizado com sucesso");
    } catch (error) {
      toastService.handleError(error, "Não foi possível atualizar o perfil");
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toastService.error("As senhas não coincidem");
      return;
    }
    
    try {
      setChangingPassword(true);
      await changePassword(currentPassword, newPassword);
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toastService.success("Senha alterada com sucesso");
    } catch (error) {
      toastService.handleError(error, "Não foi possível alterar a senha");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Configurações de Conta</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações de conta e preferências
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <KeyRound className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações de conta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <Label>Função</Label>
                  <div className="flex items-center gap-2 py-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium capitalize">{profile?.role || 'Usuário'}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label>Data de Criação</Label>
                  <div className="py-2">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <ButtonWithLoading
                  type="submit"
                  isLoading={updating}
                  loadingText="Salvando..."
                  disabled={updating || username === profile?.username}
                >
                  Salvar Alterações
                </ButtonWithLoading>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Atualize sua senha para manter sua conta segura
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {newPassword !== confirmPassword && confirmPassword !== "" && (
                    <p className="text-xs text-destructive mt-1">
                      As senhas não coincidem
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <ButtonWithLoading
                  type="submit"
                  isLoading={changingPassword}
                  loadingText="Alterando..."
                  disabled={
                    changingPassword || 
                    !currentPassword || 
                    !newPassword || 
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                >
                  Alterar Senha
                </ButtonWithLoading>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 