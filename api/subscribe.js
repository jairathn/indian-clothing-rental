// api/subscribe.js
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email required' })
    }

    // Insert email into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email }])
      .select()

    if (error) {
      // Handle duplicate emails
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already registered' })
      }
      throw error
    }

    return res.status(200).json({ 
      message: 'Successfully joined waitlist',
      data 
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return res.status(500).json({ 
      message: 'Error joining waitlist' 
    })
  }
}
