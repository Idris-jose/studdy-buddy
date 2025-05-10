

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://elhxwcmkgydtgucosdyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaHh3Y21rZ3lkdGd1Y29zZHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTY3MTMsImV4cCI6MjA2MTYzMjcxM30.zutSSxbkplUYp_OhM_K5enGL51nCKRI31V5MCCMLsSA'
export const supabase = createClient(supabaseUrl, supabaseKey)