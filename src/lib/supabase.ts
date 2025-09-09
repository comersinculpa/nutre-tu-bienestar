import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://6283360e-6121-47a3-8844-5b3a7700e234.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IjYyODMzNjBlNjEyMTQ3YTM4ODQ0NWIzYTc3MDBlMjM0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTc0ODYsImV4cCI6MjA1Mjk3MzQ4Nn0.dOL0SjWoE7JpUUwg8uZGlY_MNsOTKxFnXlQsX5dh9cQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)