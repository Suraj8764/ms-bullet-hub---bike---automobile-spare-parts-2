import { getSupabaseClient } from '../config/supabase.js';
import { getMongoDb } from '../config/db.js';

export interface SupabasePaymentRecord {
    id?: string;
    order_id: string;
    customer_id?: string;
    amount: number;
    currency?: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
    payment_gateway: string;
    payment_method?: string;
    transaction_id?: string;
    gateway_response?: any;
    created_at?: string;
    updated_at?: string;
}

export interface SupabaseInvoiceRecord {
    id?: string;
    invoice_number: string;
    order_id: string;
    total_amount: number;
    gst_amount?: number;
    status: 'PAID' | 'UNPAID' | 'CANCELLED';
    pdf_url?: string;
    created_at?: string;
}

/**
  * Record a payment entry into Supabase (with MongoDB sync as fallback/dual persistence).
  */
export async function recordPaymentInSupabase(payment: SupabasePaymentRecord) {
    const supabase = getSupabaseClient();
    const timestamp = new Date().toISOString();
    const paymentData = {
        ...payment,
        currency: payment.currency || 'INR',
        created_at: payment.created_at || timestamp,
        updated_at: timestamp,
    };

    let supabaseResult = null;
    let savedInSupabase = false;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('payments')
                .insert([paymentData])
                .select()
                .single();

            if (!error && data) {
                supabaseResult = data;
                savedInSupabase = true;
            } else {
                console.warn('Supabase payment insertion note:', error?.message);
            }
        } catch (e) {
            console.error('Error inserting payment into Supabase:', e);
        }
    }

    // Always mirror/sync into MongoDB for unified admin reporting
    const mongoDb = await getMongoDb();
    if (mongoDb) {
        try {
            await mongoDb.collection('payments').updateOne(
                { orderId: payment.order_id, transactionId: payment.transaction_id },
                {
                    $set: {
                        id: payment.id || `pay-${Date.now()}`,
                        orderId: payment.order_id,
                        customerId: payment.customer_id,
                        amount: payment.amount,
                        currency: payment.currency || 'INR',
                        status: payment.status,
                        paymentGateway: payment.payment_gateway,
                        paymentMethod: payment.payment_method,
                        transactionId: payment.transaction_id,
                        gatewayResponse: payment.gateway_response,
                        savedInSupabase,
                        updatedAt: timestamp,
                    },
                },
                { upsert: true }
            );
        } catch (mErr) {
            console.error('Error syncing payment to MongoDB:', mErr);
        }
    }

    return {
        success: true,
        savedInSupabase,
        payment: supabaseResult || paymentData,
    };
}

/**
  * Fetch payment logs from Supabase (or fallback to MongoDB)
  */
export async function getPaymentsFromSupabase(orderId?: string) {
    const supabase = getSupabaseClient();

    if (supabase) {
        try {
            let query = supabase.from('payments').select('*').order('created_at', { ascending: false });
            if (orderId) {
                query = query.eq('order_id', orderId);
            }
            const { data, error } = await query;
            if (!error && data && data.length > 0) {
                return { source: 'supabase', payments: data };
            }
        } catch (e) {
            console.error('Error fetching payments from Supabase:', e);
        }
    }

    // Fallback to MongoDB if Supabase table or connection is unconfigured
    const mongoDb = await getMongoDb();
    if (mongoDb) {
        try {
            const filter = orderId ? { orderId } : {};
            const payments = await mongoDb.collection('payments').find(filter).sort({ updatedAt: -1 }).toArray();
            return { source: 'mongodb', payments };
        } catch (e) {
            console.error('Error fetching payments from MongoDB:', e);
        }
    }

    return { source: 'none', payments: [] };
}
