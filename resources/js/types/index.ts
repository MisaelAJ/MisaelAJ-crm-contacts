export interface Contact {
    id?: number;
    user_id?: number;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    tags?: string[] | string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}