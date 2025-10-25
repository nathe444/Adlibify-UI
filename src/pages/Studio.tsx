import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button-variants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockN8n } from '@/lib/mockData';
import { toast } from 'sonner';
import { Sparkles, Upload, Send, Loader2, Globe } from 'lucide-react';
import { GenerationHistory } from '@/types';

interface StudioProps {
  onInsufficientCredits: () => void;
}

export default function Studio({ onInsufficientCredits }: StudioProps) {
  const { user, updateCredits } = useAuth();
  const [activeTab, setActiveTab] = useState<'ugc-product' | 'service-business' | 'software-ui'>('ugc-product');
  const [generating, setGenerating] = useState(false);
  const [sendingWebhook, setSendingWebhook] = useState(false);

  // Form state for UGC Product
  const [productName, setProductName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  
  // Form state for Service Business
  const [businessWebsiteUrl, setBusinessWebsiteUrl] = useState('');
  
  // Form state for Software UI
  const [companyName, setCompanyName] = useState('');
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [uiScreenshot, setUiScreenshot] = useState<File | null>(null);
  
  // File input refs
  const productImageInputRef = useRef<HTMLInputElement>(null);
  const logoImageInputRef = useRef<HTMLInputElement>(null);
  const uiScreenshotInputRef = useRef<HTMLInputElement>(null);

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      toast.success(`Product image uploaded: ${file.name}`);
    }
  };

  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImage(file);
      toast.success(`Logo uploaded: ${file.name}`);
    }
  };

  const handleUiScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUiScreenshot(file);
      toast.success(`UI screenshot uploaded: ${file.name}`);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please sign in to generate videos');
      return;
    }

    if (user.credits < 1) {
      onInsufficientCredits();
      return;
    }

    // Validate required fields based on active tab
    if (activeTab === 'ugc-product' && (!productName.trim() || !websiteUrl.trim())) {
      toast.error('Please fill in product name and website URL');
      return;
    }

    if (activeTab === 'service-business' && !businessWebsiteUrl.trim()) {
      toast.error('Please fill in business website URL');
      return;
    }

    if (activeTab === 'software-ui' && (!companyName.trim())) {
      toast.error('Please fill in company name');
      return;
    }

    setGenerating(true);

    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Deduct credit
    updateCredits(user.credits - 1);

    // Save to history (in real app, would save to database)
    const history: GenerationHistory = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      title: activeTab === 'ugc-product' ? productName : 
             activeTab === 'software-ui' ? companyName : 'Service Business Video',
      description: activeTab === 'ugc-product' ? `Product: ${productName}` : 
                   activeTab === 'software-ui' ? `Company: ${companyName}` : `Business: ${businessWebsiteUrl}`,
      template: {
        id: 'default',
        name: 'Default Template',
        thumbnail: '',
        category: activeTab,
        duration: 30,
      },
      thumbnail: '',
      createdAt: new Date(),
      creditsUsed: 1,
      status: 'completed',
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('generation_history') || '[]');
    localStorage.setItem('generation_history', JSON.stringify([history, ...existingHistory]));

    setGenerating(false);
    toast.success('Video generated successfully!');
  };

  const handleSendWebhook = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setSendingWebhook(true);

    const workflow = activeTab === 'ugc-product' ? 'ugc-product' : 
                     activeTab === 'service-business' ? 'service-business' : 
                     'software-ui-logo';

    let payload: any = {
      userId: user.id,
      projectId: Math.random().toString(36).substr(2, 9),
      workflow,
    };

    // Add tab-specific fields to payload
    if (activeTab === 'ugc-product') {
      payload = {
        ...payload,
        productName,
        websiteUrl,
        productImage: productImage ? productImage.name : null,
      };
    } else if (activeTab === 'service-business') {
      payload = {
        ...payload,
        businessWebsiteUrl,
      };
    } else if (activeTab === 'software-ui') {
      payload = {
        ...payload,
        companyName,
        logoImage: logoImage ? logoImage.name : null,
        uiScreenshot: uiScreenshot ? uiScreenshot.name : null,
      };
    }

    const result = await mockN8n.sendWebhook(workflow, payload);
    setSendingWebhook(false);

    if (result.success) {
      toast.success(`Webhook sent to ${result.webhookUrl}`, {
        description: `Response ID: ${result.response.id}`,
      });
    } else {
      toast.error('Failed to send webhook');
    }
  };

  const renderUgcProductTab = () => (
    <div className="space-y-6">
      <div className="glass-luxury p-4 md:p-6 rounded-lg">
        <h3 className="text-xl font-display font-bold mb-3">UGC Product Details</h3>
        <p className="text-sm text-muted-foreground mb-4">Create authentic user-generated content style product advertisements that drive engagement and conversions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product-name" className="text-sm">Product Name</Label>
            <Input
              id="product-name"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="glass-luxury border-border/40 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website-url" className="text-sm">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website-url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="glass-luxury border-border/40 focus:border-primary pl-10"
                />
              </div>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="product-image" className="text-sm">Product Image</Label>
          <input
            ref={productImageInputRef}
            type="file"
            id="product-image"
            accept="image/*"
            onChange={handleProductImageUpload}
            className="hidden"
          />
          <div 
            onClick={() => productImageInputRef.current?.click()}
            className="glass-luxury border-border/40 focus-within:border-primary border-2 border-dashed rounded-lg p-4 md:p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            {productImage ? (
              <p className="text-sm text-primary">{productImage.name}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Click to upload product image</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or GIF</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          variant="luxury" 
          size="lg" 
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 w-full py-3"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Video (1 Credit)
            </>
          )}
        </Button>
        <Button 
          variant="outline-gold"
          size="lg"
          onClick={handleSendWebhook}
          disabled={sendingWebhook}
          className="w-full py-3"
        >
          {sendingWebhook ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send to n8n
        </Button>
      </div>
    </div>
  );

  const renderServiceBusinessTab = () => (
    <div className="space-y-6">
      <div className="glass-luxury p-4 md:p-6 rounded-lg">
        <h3 className="text-xl font-display font-bold mb-3">Service Business Details</h3>
        <p className="text-sm text-muted-foreground mb-4">Generate professional service-style videos that showcase your expertise and build trust with potential clients.</p>
        
        <div className="space-y-2">
          <Label htmlFor="business-website-url" className="text-sm">Business Website URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="business-website-url"
              placeholder="https://yourbusiness.com"
              value={businessWebsiteUrl}
              onChange={(e) => setBusinessWebsiteUrl(e.target.value)}
              className="glass-luxury border-border/40 focus:border-primary pl-10"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          variant="luxury" 
          size="lg" 
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 w-full py-3"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Video (1 Credit)
            </>
          )}
        </Button>
        <Button 
          variant="outline-gold"
          size="lg"
          onClick={handleSendWebhook}
          disabled={sendingWebhook}
          className="w-full py-3"
        >
          {sendingWebhook ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send to n8n
        </Button>
      </div>
    </div>
  );

  const renderSoftwareUiTab = () => (
    <div className="space-y-6">
      <div className="glass-luxury p-4 md:p-6 rounded-lg">
        <h3 className="text-xl font-display font-bold mb-3">Software UI Details</h3>
        <p className="text-sm text-muted-foreground mb-4">Produce sleek software product demonstrations and logo animations that impress your audience.</p>
        
        <div className="space-y-2">
          <Label htmlFor="company-name" className="text-sm">Company Name</Label>
          <Input
            id="company-name"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="glass-luxury border-border/40 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="logo-image" className="text-sm">Upload Logo Image</Label>
            <input
              ref={logoImageInputRef}
              type="file"
              id="logo-image"
              accept="image/*"
              onChange={handleLogoImageUpload}
              className="hidden"
            />
            <div 
              onClick={() => logoImageInputRef.current?.click()}
              className="glass-luxury border-border/40 focus-within:border-primary border-2 border-dashed rounded-lg p-4 md:p-6 text-center hover:border-primary/40 transition-colors cursor-pointer h-full flex flex-col justify-center"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {logoImage ? (
                <p className="text-sm text-primary">{logoImage.name}</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Click to upload logo</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or SVG</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-8 md:mt-0">
            <Label htmlFor="ui-screenshot" className="text-sm">Upload UI Screenshot</Label>
            <input
              ref={uiScreenshotInputRef}
              type="file"
              id="ui-screenshot"
              accept="image/*"
              onChange={handleUiScreenshotUpload}
              className="hidden"
            />
            <div 
              onClick={() => uiScreenshotInputRef.current?.click()}
              className="glass-luxury border-border/40 focus-within:border-primary border-2 border-dashed rounded-lg p-4 md:p-6 text-center hover:border-primary/40 transition-colors cursor-pointer h-full flex flex-col justify-center"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {uiScreenshot ? (
                <p className="text-sm text-primary">{uiScreenshot.name}</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or GIF</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          variant="luxury" 
          size="lg" 
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 w-full py-3"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Video (1 Credit)
            </>
          )}
        </Button>
        <Button 
          variant="outline-gold"
          size="lg"
          onClick={handleSendWebhook}
          disabled={sendingWebhook}
          className="w-full py-3"
        >
          {sendingWebhook ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send to n8n
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center space-y-2 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">Video Studio</h1>
        <p className="text-base sm:text-xl text-muted-foreground px-4">Create professional videos in three powerful workflows</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-luxury h-auto p-1 mb-8">
          <TabsTrigger 
            value="ugc-product" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 md:py-4 px-2"
          >
            <div className="text-center">
              <p className="font-semibold text-xs sm:text-sm md:text-base">UGC Product</p>
              <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 hidden sm:block">User-generated</p>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="service-business"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 md:py-4 px-2"
          >
            <div className="text-center">
              <p className="font-semibold text-xs sm:text-sm md:text-base">Service Business</p>
              <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 hidden sm:block">Professional</p>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="software-ui"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 md:py-4 px-2"
          >
            <div className="text-center">
              <p className="font-semibold text-xs sm:text-sm md:text-base">Software UI</p>
              <p className="text-[0.6rem] sm:text-xs opacity-80 mt-1 hidden sm:block">Walkthroughs</p>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ugc-product" className="mt-6">
          {renderUgcProductTab()}
        </TabsContent>

        <TabsContent value="service-business" className="mt-6">
          {renderServiceBusinessTab()}
        </TabsContent>

        <TabsContent value="software-ui" className="mt-6">
          {renderSoftwareUiTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}