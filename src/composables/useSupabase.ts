import { createClient } from '@supabase/supabase-js'

// ⚠️ REMPLACE CES VALEURS PAR LES TIENNES
const supabaseUrl = 'https://adcfvfqdkuyqxfvusear.supabase.co' // Ex: https://abcdefg.supabase.co
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkY2Z2ZnFka3V5cXhmdnVzZWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTU1MjAsImV4cCI6MjA2OTYzMTUyMH0.Xbd2zg_sKM5rASxmiVbFeLZV-2xf07gU7dqmPxtPovo' // Ta clé publique

export const supabase = createClient(supabaseUrl, supabaseKey)