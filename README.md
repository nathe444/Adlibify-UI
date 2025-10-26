# adlibify - Premium Video Generation Platform

A luxury AI-powered video generation SaaS with three powerful workflows: UGC Product, Service Business, and Software UI + Logo.

## 🚀 Features

- **Three Generation Workflows**
  - UGC Product: User-generated content style product ads
  - Service Business: Professional service-style videos
  - Software UI + Logo: Sleek software demonstrations

- **Authentication System**
  - Email/password sign-in and sign-up
  - Mock phone verification (Twilio integration ready)
  - Session management with localStorage

- **Credit-Based System**
  - New users start with 5 free credits
  - Mock Stripe integration for purchasing credit packs
  - Real-time credit tracking

- **Generation History & CRM**
  - Track all generated videos
  - Lead management dashboard
  - Quick re-run and download actions

- **n8n Webhook Integration**
  - Send generation data to n8n workflows
  - Three webhook endpoints (one per workflow type)
  - JSON payload inspection

## 🎨 Design System

The app uses a luxury design aesthetic with:
- **Fonts**: Playfair Display (headings), Inter (body)
- **Colors**: Luxury Gold (#D4AF37), Deep Black (#0A0A0A)
- **Effects**: Glassmorphism, gold glows, smooth animations
- **Responsive**: Mobile-first approach

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State**: React Context API
- **Animations**: CSS transitions

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔑 Mock Integrations

### Supabase (Mock)
Located in `src/lib/mockData.ts`:
- `mockSupabase.auth.signUp()` - Create new user
- `mockSupabase.auth.signIn()` - Authenticate user
- `mockSupabase.auth.signOut()` - Sign out user
- `mockSupabase.auth.getUser()` - Get current user

**To replace with real Supabase:**
1. Install `@supabase/supabase-js`
2. Create Supabase client with your keys
3. Replace mock functions in `src/contexts/AuthContext.tsx`

### Stripe (Mock)
Located in `src/lib/mockData.ts`:
- `mockStripe.checkout(packId)` - Process payment

**To replace with real Stripe:**
1. Install `@stripe/stripe-js`
2. Add your Stripe publishable key
3. Update `src/components/PaywallModal.tsx` to use Stripe Checkout
4. Set up webhook for payment confirmation

### Twilio (Mock)
Located in `src/lib/mockData.ts`:
- `mockTwilio.sendVerificationCode(phone)` - Send SMS code
- `mockTwilio.verifyCode(phone, code)` - Verify code

**Test code**: `123456`

**To replace with real Twilio:**
1. Install `twilio` package (for backend)
2. Add Twilio credentials to environment variables
3. Create API endpoint for SMS sending
4. Update `src/components/AuthModal.tsx`

### n8n Webhooks (Mock)
Located in `src/lib/mockData.ts`:
- `mockN8n.sendWebhook(workflow, payload)` - Send to webhook

**Webhook URLs:**
- UGC Product: `https://example-n8n.webhook/ugc-product`
- Service Business: `https://example-n8n.webhook/service-business`
- Software UI + Logo: `https://example-n8n.webhook/software-ui-logo`

**To replace with real n8n:**
1. Create n8n workflows
2. Get webhook URLs from n8n
3. Update URLs in `src/lib/mockData.ts`
4. Add authentication if needed

## 👤 Test Accounts

**Demo Account:**
- Email: `demo@luxevideo.test`
- Password: `Password123!`
- Credits: 5

**Create New Account:**
Any email/password combination will work in mock mode. New accounts receive 5 free credits.

## 📁 Project Structure

```
src/
├── assets/              # Images and static files
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── AuthModal.tsx   # Login/signup modal
│   └── PaywallModal.tsx # Credit purchase modal
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/                # Utilities
│   ├── mockData.ts     # Mock integrations
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Studio.tsx      # Video generation studio
│   └── History.tsx     # Generation history & CRM
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
└── App.tsx             # Main app component
```

## 🎯 Acceptance Criteria

✅ App runs locally with luxury design system  
✅ Three generator tabs with functional inputs  
✅ Login/SignUp modal with phone verification  
✅ Paywall modal with credit purchase  
✅ Credit-based generation system  
✅ n8n webhook simulation  
✅ History & CRM UI  
✅ Responsive design  
✅ Accessible (keyboard navigation, ARIA labels)  
✅ Mock integrations documented  

## 🔄 Next Steps (Milestone 2+)

1. **Backend Integration**
   - Connect real Supabase database
   - Implement actual Stripe payments
   - Add Twilio SMS verification
   - Set up n8n workflows

2. **Video Processing**
   - Implement actual video generation
   - Add video preview player
   - Enable video downloads

3. **Advanced Features**
   - Advanced template customization
   - Batch video generation
   - Analytics dashboard
   - Team collaboration

## 📚 Documentation

- **Design System**: See `src/index.css` for all design tokens
- **Components**: All components use semantic design tokens
- **API Integration**: Check `src/lib/mockData.ts` for integration points

## 🤝 Contributing

This is Milestone 1 - front-end prototype. For production:
1. Replace all mock integrations with real services
2. Add proper error handling
3. Implement rate limiting
4. Add comprehensive testing
5. Set up CI/CD pipeline

## 📄 License

MIT License - See LICENSE file for details

---

Built with ❤️ using Lovable.dev
