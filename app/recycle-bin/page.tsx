'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  RotateCcw, 
  Trash, 
  AlertTriangle,
  Briefcase,
  Users,
  Zap,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function RecycleBinPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recycle-bin');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch deleted items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRestore = async (id: string, type: string) => {
    try {
      const res = await fetch('/api/recycle-bin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Item restored successfully');
        fetchItems();
      } else {
        toast.error(data.error || 'Failed to restore item');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handlePermanentDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure? This action is permanent and cannot be undone.')) return;
    
    try {
      const res = await fetch('/api/recycle-bin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Item permanently deleted');
        fetchItems();
      } else {
        toast.error(data.error || 'Failed to delete item');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'candidate': return <Users className="h-4 w-4" />;
      case 'screening': return <Zap className="h-4 w-4" />;
      case 'user': return <UserIcon className="h-4 w-4" />;
      default: return <Trash2 className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-blue-500/10 text-blue-500';
      case 'candidate': return 'bg-green-500/10 text-green-500';
      case 'screening': return 'bg-purple-500/10 text-purple-500';
      case 'user': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Recycle Bin</h1>
          <p className="text-muted-foreground">Recently deleted items. They can be restored or permanently deleted.</p>
        </div>

        {items.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-center gap-3 text-yellow-500">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">Items in the recycle bin will be permanently removed after 30 days.</p>
          </div>
        )}

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <Card key={item.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] uppercase border-border">
                          {item.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Deleted on {new Date(item.deletedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-500 hover:bg-green-500/10 gap-2"
                      onClick={() => handleRestore(item.id, item.type)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 gap-2"
                      onClick={() => handlePermanentDelete(item.id, item.type)}
                    >
                      <Trash className="h-4 w-4" />
                      Permanent Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>The recycle bin is empty</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
