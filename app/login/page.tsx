"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authenticate } from "@/lib/actions/login";
import { Building2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        const result = await authenticate(formData);
        if (result?.error) {
            setErrorMessage(result.error);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg border">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                        <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Medical CRM</h1>
                    <p className="text-sm text-slate-500">Faça login para acessar</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" name="email" type="email" placeholder="medico@crm.com" required />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                    )}

                    <LoginButton />
                </form>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
        </Button>
    );
}