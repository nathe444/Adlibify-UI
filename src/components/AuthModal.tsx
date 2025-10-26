import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button-variants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { mockTwilio } from '@/lib/mockData';
import { Loader2, Phone } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phoneVerification, setPhoneVerification] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(signInEmail, signInPassword);
      if (error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        toast.success('Welcome back!');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!signUpPhone) {
      toast.error('Please enter a phone number');
      return;
    }
    setLoading(true);
    const result = await mockTwilio.sendVerificationCode(signUpPhone);
    setLoading(false);
    
    if (result.success) {
      setPhoneVerification('sent');
      toast.success('Verification code sent! Use: 123456');
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    const result = await mockTwilio.verifyCode(signUpPhone, verificationCode);
    setLoading(false);
    
    if (result.success) {
      setPhoneVerification('verified');
      toast.success('Phone verified!');
    } else {
      toast.error('Invalid code');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signUp(signUpEmail, signUpPassword, signUpName, signUpPhone);
      if (error) {
        toast.error(error.message || 'Failed to sign up');
      } else {
        toast.success('Account created! You have 5 free credits.');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark:glass-luxury border-primary/20 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">Welcome to adlibify</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Sign in or create an account to start generating videos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2  glass-luxury">
            <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  className="glass-luxury border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  className="glass-luxury border-primary/20"
                />
              </div>
              <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Demo account: demo@luxevideo.test / Password123!
              </p>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  className="glass-luxury border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  className="glass-luxury border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  className="glass-luxury border-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    className="glass-luxury border-primary/20"
                    disabled={phoneVerification !== 'idle'}
                  />
                  {phoneVerification === 'idle' && signUpPhone && (
                    <Button type="button" variant="outline-gold" onClick={handleSendCode} disabled={loading}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {phoneVerification === 'sent' && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Enter code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="glass-luxury border-primary/20"
                    />
                    <Button type="button" variant="outline-gold" onClick={handleVerifyCode} disabled={loading}>
                      Verify
                    </Button>
                  </div>
                )}
                {phoneVerification === 'verified' && (
                  <p className="text-xs text-primary">✓ Phone verified</p>
                )}
              </div>
              <Button type="submit" variant="luxury" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
