import Contact from '../models/Contact.js';

/**
 * @desc    Submit a contact inquiry
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message.'
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our concierge will get back to you shortly.',
      contact
    });
  } catch (error) {
    next(error);
  }
};
