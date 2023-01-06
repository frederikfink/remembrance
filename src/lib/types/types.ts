import type { Database } from "./database.types";

export type Item = Database['public']['Tables']['items']['Row'];
export type Testing = Database['public']['Tables']['test']['Row'];