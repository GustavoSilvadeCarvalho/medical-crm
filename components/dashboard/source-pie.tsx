"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Props {
    data: { name: string; value: number }[];
    height?: number;
}

const COLORS: Record<string, string> = {
    GOOGLE: '#34d399',
    INSTAGRAM: '#ec4899',
    FACEBOOK: '#3b82f6',
    TIKTOK: '#ef4444',
    FRIEND_REFERRAL: '#f59e0b',
    DOCTOR_REFERRAL: '#8b5cf6',
    INSURANCE: '#06b6d4',
    PASSING_BY: '#94a3b8',
    OTHER: '#9ca3af',
};

const DEFAULT_PALETTE = [
    '#60a5fa', '#34d399', '#f97316', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#94a3b8', '#fb7185', '#a3e635'
];

function hashString(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

export default function SourcePie({ data, height = 250 }: Props) {
    const palette = data.map((d, i) => {
        const norm = (d.name ?? 'OTHER').toString().trim().toUpperCase();
        if (COLORS[norm]) return COLORS[norm];
        const idx = hashString(norm + i) % DEFAULT_PALETTE.length;
        return DEFAULT_PALETTE[idx];
    });

    const legendPayload = data.map((d, i) => ({ value: d.name, type: 'square', color: palette[i] }));

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={palette[index]} stroke={palette[index]} strokeWidth={2} />
                    ))}
                </Pie>

                <Tooltip formatter={(value: any) => [`${value}`, 'Pacientes']} />
                <Legend payload={legendPayload as any} />
            </PieChart>
        </ResponsiveContainer>
    );
}