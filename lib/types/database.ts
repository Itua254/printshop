export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    category: string
                    name: string
                    description: string | null
                    base_price: number
                    image_url: string | null
                    variants: Json
                    pricing_rules: Json
                    is_active: boolean
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    category: string
                    name: string
                    description?: string | null
                    base_price: number
                    image_url?: string | null
                    variants?: Json
                    pricing_rules?: Json
                    is_active?: boolean
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    category?: string
                    name?: string
                    description?: string | null
                    base_price?: number
                    image_url?: string | null
                    variants?: Json
                    pricing_rules?: Json
                    is_active?: boolean
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            customers: {
                Row: {
                    id: string
                    phone: string
                    name: string | null
                    email: string | null
                    address: string | null
                    notes: string | null
                    total_orders: number
                    total_spent: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    phone: string
                    name?: string | null
                    email?: string | null
                    address?: string | null
                    notes?: string | null
                    total_orders?: number
                    total_spent?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    phone?: string
                    name?: string | null
                    email?: string | null
                    address?: string | null
                    notes?: string | null
                    total_orders?: number
                    total_spent?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    customer_id: string | null
                    customer_name: string | null
                    customer_phone: string
                    customer_email: string | null
                    items: Json
                    subtotal: number
                    discount: number
                    total_amount: number
                    status: string
                    payment_status: string
                    payment_method: string | null
                    whatsapp_sent: boolean
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: string
                    customer_id?: string | null
                    customer_name?: string | null
                    customer_phone: string
                    customer_email?: string | null
                    items: Json
                    subtotal: number
                    discount?: number
                    total_amount: number
                    status?: string
                    payment_status?: string
                    payment_method?: string | null
                    whatsapp_sent?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    customer_id?: string | null
                    customer_name?: string | null
                    customer_phone?: string
                    customer_email?: string | null
                    items?: Json
                    subtotal?: number
                    discount?: number
                    total_amount?: number
                    status?: string
                    payment_status?: string
                    payment_method?: string | null
                    whatsapp_sent?: boolean
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            settings: {
                Row: {
                    key: string
                    value: Json
                    description: string | null
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: Json
                    description?: string | null
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: Json
                    description?: string | null
                    updated_at?: string
                }
            }
        }
        Views: {
            active_products: {
                Row: {
                    id: string
                    category: string
                    name: string
                    description: string | null
                    base_price: number
                    image_url: string | null
                    variants: Json
                    pricing_rules: Json
                    is_active: boolean
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
            }
        }
        Functions: {
            generate_order_number: {
                Args: Record<string, never>
                Returns: string
            }
        }
    }
}

// Helper types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type Setting = Database['public']['Tables']['settings']['Row']

// Product variant types
export interface ProductVariant {
    type: string
    label: string
    price: number
    image?: string
}

// Cart item type
export interface CartItem {
    id: string
    product: Product
    variant?: ProductVariant
    quantity: number
    specifications: Record<string, any>
    total: number
}

// Order item type
export interface OrderItem {
    product_id: string
    product_name: string
    product_category: string
    quantity: number
    unit_price: number
    total_price: number
    specifications: Record<string, any>
}
