# Khrystyna Skotte Photography Website

A modern photography portfolio website with contact form functionality.

## Features

- **Portfolio Gallery**: Showcase of photography work organized by categories
- **Contact Form**: Working email contact form with automatic responses
- **Responsive Design**: Mobile-friendly layout
- **Professional Styling**: Clean, modern design focused on photography

## Contact Form Setup

The contact form uses Vercel serverless functions to send emails via Gmail SMTP.

### Email Configuration

1. **Gmail Setup**:
   - Enable 2-factor authentication on your Gmail account
   - Generate an "App Password" for this application
   - Use the app password (not your regular Gmail password)

2. **Environment Variables**:
   In your Vercel dashboard, add these environment variables:
   ```
   EMAIL_USER=khrystynaskotte@gmail.com
   EMAIL_PASS=your-app-specific-password
   ```

3. **Local Development**:
   - Copy `.env.example` to `.env.local`
   - Fill in your actual Gmail credentials
   - Run `vercel dev` to test locally

### Deployment to Vercel

1. **Connect Repository**:
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect the configuration

2. **Set Environment Variables**:
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add `EMAIL_USER` and `EMAIL_PASS` with your Gmail credentials

3. **Deploy**:
   - Push to your main branch
   - Vercel will automatically deploy your changes

### Features of the Contact Form

- **Validation**: Client-side and server-side validation
- **Auto-Response**: Automatic confirmation email to sender
- **Professional Formatting**: Well-formatted emails with contact details
- **Loading States**: Visual feedback during form submission
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive**: Works on all device sizes

### Email Templates

- **To Khrystyna**: Professional notification with all contact details
- **To Sender**: Friendly auto-response confirming message receipt

## File Structure

```
├── api/
│   └── send-email.js       # Serverless function for email sending
├── css/                    # Stylesheets
├── img/                    # Images and photos
├── js/                     # JavaScript files
├── contact.html           # Contact page with form
├── index.html             # Homepage
├── about.html             # About page
├── services.html          # Services page
├── portfolio.html         # Portfolio page
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
└── .env.example          # Environment variables template
```

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Email**: Nodemailer with Gmail SMTP
- **Hosting**: Vercel
- **Domain**: Custom domain supported

## Support

For technical issues with the contact form:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure Gmail app password is correct
4. Check spam folders for test emails