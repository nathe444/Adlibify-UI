import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button-variants';
import { Sparkles, Video, Zap, Users, Play } from 'lucide-react';
import heroImage from '@/assets/hero-background.jpg';
import { videoTemplates } from '@/lib/mockData';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional video production" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-luxury">
            <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
            <span className="text-sm font-semibold">AI-Powered Video Generation</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight">
            Create Stunning Videos
            <br />
            <span className="text-primary">In Seconds</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional UGC, service, and software videos with our luxury AI platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/studio">
              <Button variant="luxury" size="xl" className="group">
                Start Creating
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Link to="/studio">
              <Button variant="outline-gold" size="xl">
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Three Powerful Workflows
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional video generation tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-luxury p-8 space-y-4 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold">UGC Product</h3>
              <p className="text-muted-foreground">
                Create authentic user-generated content style product advertisements that convert
              </p>
            </div>

            <div className="glass-luxury p-8 space-y-4 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold">Service Business</h3>
              <p className="text-muted-foreground">
                Professional service-style videos that build trust and showcase your expertise
              </p>
            </div>

            <div className="glass-luxury p-8 space-y-4 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold">Software UI</h3>
              <p className="text-muted-foreground">
                Sleek software walkthroughs and logo animations that impress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Videos Showcase */}
      <section className="py-24 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Professional Video Examples
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See the quality and style of videos you can create
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTemplates.map((template) => (
              <div
                key={template.id}
                className="group glass-luxury rounded-xl overflow-hidden transition-all hover:-translate-y-2"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                      <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display font-semibold text-lg">{template.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{template.duration}s</span>
                    <span className="capitalize">{template.category.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="glass-luxury p-12 md:p-16 text-center space-y-8 rounded-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-bold">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start with 5 free credits when you sign up today
            </p>
            <Link to="/studio">
              <Button variant="luxury" size="xl">
                Get Started Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
