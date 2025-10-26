import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button-variants';
import { GenerationHistory, Lead } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RefreshCw, Sparkles, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  useEffect(() => {
    // Load from localStorage (in real app, would fetch from API)
    const storedHistory = localStorage.getItem('generation_history');
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory);
      // Convert date strings back to Date objects
      const historyWithDates = parsed.map((h: any) => ({
        ...h,
        createdAt: new Date(h.createdAt)
      }));
      setHistory(historyWithDates);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center space-y-2 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold">History & CRM</h1>
        <p className="text-xl text-muted-foreground">Track your generations and manage leads</p>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="w-full  glass-luxury h-auto p-1 mb-8">
          <TabsTrigger
            value="history"
            className="w-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
          >
            Generation History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {history.length === 0 ? (
            <div className="glass-luxury p-12 text-center space-y-4">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No generations yet. Start creating in the Studio!</p>
              <Link to="/studio">
                <Button variant="luxury">Go to Studio</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((item) => (
                <div key={item.id} className="glass-luxury p-6 transition-all hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-display font-bold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-primary">
                          <Sparkles className="h-4 w-4" />
                          <span>{item.creditsUsed} credit</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      <Button variant="outline-gold" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="glass" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-run
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
