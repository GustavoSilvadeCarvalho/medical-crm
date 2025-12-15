import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Save, Settings } from "lucide-react";
import { resetDatabase } from "@/lib/actions/settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-slate-700" /> Configurações
        </h1>
        <p className="text-slate-500">
          Gerencie as informações da sua clínica e preferências do sistema.
        </p>
      </div>
      
      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Clínica</CardTitle>
            <CardDescription>
              Estes dados aparecerão nos cabeçalhos dos documentos impressos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="clinicName">Nome da Clínica</Label>
              <Input id="clinicName" defaultValue="Dr. Gustavo Silva - Cardiologia" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone Comercial</Label>
                    <Input id="phone" defaultValue="(11) 99999-0000" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" defaultValue="Av. Paulista, 1000 - Sala 42" />
                </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-card px-6 py-4">
            <Button>
                <Save className="h-4 w-4 mr-2" /> Salvar Alterações
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam os dados do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-slate-500 mb-4">
                Se você deseja reiniciar o sistema para uma apresentação ou testes, use o botão abaixo. 
                Isso apagará <strong>todos</strong> os pacientes, consultas e prontuários.
             </p>

             <form action={resetDatabase}>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="h-4 w-4 mr-2" /> Resetar Banco de Dados
                </Button>
             </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}