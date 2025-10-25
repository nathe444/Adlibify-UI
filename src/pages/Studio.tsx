import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button-variants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { videoTemplates, mockN8n } from '@/lib/mockData';
import { toast } from 'sonner';
import { Sparkles, Upload, Send, Loader2 } from 'lucide-react';
import { GenerationHistory } from '@/types';

interface StudioProps {
  onInsufficientCredits: () => void;
}

export default function Studio({ onInsufficientCredits }: StudioProps) {
  const { user, updateCredits } = useAuth();
  const [activeTab, setActiveTab] = useState<'ugc-product' | 'service-business' | 'software-ui'>('ugc-product');
  const [generating, setGenerating] = useState(false);
  const [sendingWebhook, setSendingWebhook] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  
  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const filteredTemplates = videoTemplates.filter(t => 
    activeTab === 'software-ui' ? 
      t.category === 'software-ui' : 
      t.category === activeTab
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      toast.success(`Logo uploaded: ${file.name}`);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMediaFiles(prev => [...prev, ...files]);
      toast.success(`${files.length} file(s) uploaded`);
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

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description');
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
      title,
      description,
      template: videoTemplates[0],
      thumbnail: videoTemplates[0].thumbnail,
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

    const payload = {
      userId: user.id,
      projectId: Math.random().toString(36).substr(2, 9),
      title,
      description,
      templateId: selectedTemplate || '',
      workflow,
    };

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

  const renderTabContent = (type: string, description: string) => (
    <div className="space-y-6">
      <div className="glass-luxury p-6 rounded-lg">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-luxury border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your video content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="glass-luxury border-primary/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call-to-Action</Label>
            <Input
              id="cta"
              placeholder="e.g., Learn More, Shop Now"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="glass-luxury border-primary/20"
            />
          </div>

          {activeTab === 'software-ui' && (
            <div className="space-y-2">
              <Label htmlFor="logo">Brand Logo</Label>
              <input
                ref={logoInputRef}
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="glass-luxury border-primary/20 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                {logoFile ? (
                  <p className="text-sm text-primary">{logoFile.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Click to upload logo</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Product/Media Upload</Label>
            <input
              ref={mediaInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
            <div 
              onClick={() => mediaInputRef.current?.click()}
              className="glass-luxury border-primary/20 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {mediaFiles.length > 0 ? (
                <p className="text-sm text-primary">{mediaFiles.length} file(s) selected</p>
              ) : (
                <p className="text-sm text-muted-foreground">Drag & drop files or click to browse</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Templates & Preview */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Template</Label>
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative glass-luxury rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-3">
                    <p className="text-xs font-semibold">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="glass-luxury rounded-lg aspect-video overflow-hidden">
              {selectedTemplate ? (
                <img 
                  src={filteredTemplates.find(t => t.id === selectedTemplate)?.thumbnail} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Select a template to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="luxury" 
          size="lg" 
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1"
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
        <h1 className="text-4xl md:text-5xl font-display font-bold">Video Studio</h1>
        <p className="text-xl text-muted-foreground">Create professional videos in three powerful workflows</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-luxury h-auto p-1 mb-8">
          <TabsTrigger 
            value="ugc-product" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
          >
            <div className="text-center">
              <p className="font-semibold">UGC Product</p>
              <p className="text-xs opacity-80">User-generated content</p>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="service-business"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
          >
            <div className="text-center">
              <p className="font-semibold">Service Business</p>
              <p className="text-xs opacity-80">Professional services</p>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="software-ui"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
          >
            <div className="text-center">
              <p className="font-semibold">Software UI + Logo</p>
              <p className="text-xs opacity-80">Product walkthroughs</p>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ugc-product">
          {renderTabContent(
            'UGC Product',
            'Create authentic user-generated content style product advertisements that drive engagement and conversions.'
          )}
        </TabsContent>

        <TabsContent value="service-business">
          {renderTabContent(
            'Service Business',
            'Generate professional service-style videos that showcase your expertise and build trust with potential clients.'
          )}
        </TabsContent>

        <TabsContent value="software-ui">
          {renderTabContent(
            'Software UI + Logo',
            'Produce sleek software product demonstrations and logo animations that impress your audience.'
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
