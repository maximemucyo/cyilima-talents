import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'job' | 'candidate' | 'screening' | 'shortlist';
}

const typeStyles = {
  job: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  candidate: { bg: 'bg-green-500/10', text: 'text-green-500' },
  screening: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  shortlist: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch('/api/activities');
        const data = await res.json();
        if (data.success) {
          setActivities(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted rounded-md" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground text-sm">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((item) => {
              const styles = typeStyles[item.type] || typeStyles.job;
              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                      <Badge
                        variant="secondary"
                        className={`${styles.bg} ${styles.text} border-0 text-xs capitalize`}
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
