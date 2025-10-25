import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button-variants';
import { useAuth } from '@/contexts/AuthContext';
import { creditPacks, mockStripe } from '@/lib/mockData';
import { toast } from 'sonner';
import { Check, Loader2, Sparkles, Crown } from 'lucide-react';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

export const PaywallModal = ({ open, onClose }: PaywallModalProps) => {
  const { user, updateCredits } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const handlePurchase = async (packId: string) => {
    setLoading(true);
    setSelectedPack(packId);
    
    try {
      const result = await mockStripe.checkout(packId);
      if (result.success) {
        const newCredits = (user?.credits || 0) + result.credits;
        updateCredits(newCredits);
        toast.success(`${result.credits} credits added to your account!`);
        onClose();
      } else {
        toast.error(result.error || 'Payment failed');
      }
    } finally {
      setLoading(false);
      setSelectedPack(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-luxury border-primary/20 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display text-center flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            Get More Credits
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {user ? (
              <>You have <span className="font-bold text-primary">{user.credits} credits</span> remaining</>
            ) : (
              'Sign in to purchase credits'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`relative glass-luxury p-6 transition-all hover:scale-[1.02] ${
                pack.popular ? 'border-2 border-primary' : ''
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold">{pack.name}</h3>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">{pack.credits}</span>
                    <span className="text-sm text-muted-foreground">credits</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${(pack.price / pack.credits).toFixed(2)} per credit
                  </p>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-3xl font-bold font-display text-foreground">
                    ${pack.price}
                  </div>
                  <Button
                    variant={pack.popular ? "luxury" : "outline-gold"}
                    onClick={() => handlePurchase(pack.id)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading && selectedPack === pack.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Purchase'
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>All video types included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>HD 1080p exports</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Mock Stripe integration. In production, this will use Stripe Checkout.
        </p>
      </DialogContent>
    </Dialog>
  );
};
