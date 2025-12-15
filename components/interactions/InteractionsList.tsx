"use client";

import InteractionItem from "./InteractionItem";

interface Props {
    interactions: any[];
}

export default function InteractionsList({ interactions }: Props) {
    if (!interactions || interactions.length === 0) return (
        <p className="text-center text-slate-500 py-4">Nenhuma interação registrada.</p>
    );

    return (
        <div className="space-y-3">
            {interactions.map((it) => (
                <InteractionItem key={it.id} interaction={it} />
            ))}
        </div>
    );
}
