// api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // This securely reads the key from Vercel (we will set this up in Step 3)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!RESEND_API_KEY) {
        return res.status(503).json({ error: 'Email service is not configured yet.' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: 'Jzyrus10@gmail.com', // Your email address
                subject: subject || `New message from ${name}`,
                reply_to: email,
                html: `<p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Message:</strong> ${message}</p>`
            })
        });

        if (response.ok) return res.status(200).json({ success: true });
        return res.status(500).json({ error: 'Failed to send email' });

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}