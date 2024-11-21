import { Twilio } from 'twilio';
import express from 'express';
import { z } from 'zod';

const router = express.Router();

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER!;

router.post('/send-welcome', async (req, res) => {
  try {
    const phoneSchema = z.object({
      phone: z.string().regex(/^\+1\d{10}$/)
    });
    
    const { phone } = phoneSchema.parse(req.body);
    
    const message = await twilioClient.messages.create({
      body: 'Welcome to Sleep Journal! 🌙 Your journey to better sleep starts now.',
      from: FROM_PHONE,
      to: phone
    });

    console.log('Welcome SMS sent successfully:', message.sid);
    
    res.json({
      success: true,
      message: 'Welcome message sent'
    });
  } catch (error: any) {
    console.error('Error sending welcome message:', error);
    
    if (error.code === 21211) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome message'
    });
  }
});

export default router;