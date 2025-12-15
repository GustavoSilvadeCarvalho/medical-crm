import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button"; // Importamos o botão do passo 1

export default async function CertificatePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Buscamos o ID e o Paciente
  const { id } = await params;
  const patient = await db.patient.findUnique({ where: { id } });

  if (!patient) return notFound();

  // 2. Renderizamos a página
  return (
    // Fundo cinza para destacar a "folha de papel"
    <div className="min-h-screen bg-gray-100 flex justify-center p-8 print:p-0 print:bg-white">
      
      {/* A FOLHA DE PAPEL A4 */}
      <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-12 shadow-lg print:shadow-none print:w-full">
        
        {/* Cabeçalho com Botão (O botão some na impressão graças ao print:hidden nele) */}
        <div className="flex justify-between items-start mb-12">
            <div className="text-center w-full">
                <h1 className="text-2xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 inline-block">
                    Atestado Médico
                </h1>
                <p className="text-sm mt-2 text-gray-600">Clínica Dr. Gustavo Silva</p>
                <p className="text-xs text-gray-500">Rua da Medicina, 123 - São Paulo/SP</p>
            </div>
            
            {/* O botão fica flutuando na direita na tela, mas não sai no PDF */}
            <div className="absolute top-8 right-8 print:hidden">
                <PrintButton />
            </div>
        </div>

        {/* Corpo do Texto */}
        <div className="space-y-8 text-lg leading-relaxed font-serif mt-20 px-8 text-justify">
            <p>
                Atesto para os devidos fins de comprovação junto à quem interessar possa que o(a) Sr(a).
            </p>
            
            <div className="text-3xl text-center font-bold my-8 py-2 border-b border-black/20">
                {patient.name}
            </div>

            <p>
                Esteve sob meus cuidados profissionais na data de hoje, necessitando de afastamento 
                de suas atividades laborais e/ou escolares por um período de:
            </p>

            <div className="flex gap-4 items-center justify-center my-6">
                 <span className="text-2xl font-bold border px-4 py-2 rounded">01 (um)</span>
                 <span className="text-lg">dia(s) de repouso.</span>
            </div>
        </div>

        {/* Rodapé / Assinatura */}
        <div className="mt-40 text-center">
            <div className="inline-block w-64 border-t border-black pt-2">
                <p className="font-bold">Dr. Gustavo Silva</p>
                <p className="text-sm">CRM/SP 123.456</p>
            </div>
            <p className="mt-8 text-sm text-gray-400">
                Emitido em: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}
            </p>
        </div>

      </div>
    </div>
  );
}