import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'job' | 'candidate' | 'screening' | 'shortlist';
}

const activityItems: ActivityItem[] = [
  {
    id: '1',
    title: 'New Job Posted',
    description: 'Senior Full Stack Developer - Kigali',
    timestamp: '2 hours ago',
    type: 'job',
  },
  {
    id: '2',
    title: 'Screening Completed',
    description: 'AI screening completed for Jean Bosco Mutabazi',
    timestamp: '4 hours ago',
    type: 'screening',
  },
  {
    id: '3',
    title: 'Candidate Added',
    description: 'Marie Claire Umuhoza added to candidate pool',
    timestamp: '6 hours ago',
    type: 'candidate',
  },
  {
    id: '4',
    title: 'Shortlist Created',
    description: 'Top 5 candidates selected for Agricultural Data Analyst role',
    timestamp: '1 day ago',
    type: 'shortlist',
  },
  {
    id: '5',
    title: 'Job Closed',
    description: 'Kigali Innovation Hub position closed',
    timestamp: '2 days ago',
    type: 'job',
  },
];

const typeStyles = {
  job: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  candidate: { bg: 'bg-green-500/10', text: 'text-green-500' },
  screening: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  shortlist: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
};

export function RecentActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.map((item) => {
            const styles = typeStyles[item.type];
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
                  {item.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
