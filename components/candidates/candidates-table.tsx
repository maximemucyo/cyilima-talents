'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  MapPin,
} from 'lucide-react';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentRole?: string;
  location?: string;
  skills: string[];
  yearsExperience?: number;
  createdAt: string;
}

interface CandidatesTableProps {
  candidates: Candidate[];
  onDelete?: (id: string) => void;
}

export function CandidatesTable({ candidates, onDelete }: CandidatesTableProps) {
  if (candidates.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground mb-4">No candidates found</p>
          <Link href="/candidates/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Add First Candidate
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Current Role</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Experience</TableHead>
              <TableHead className="text-muted-foreground">Skills</TableHead>
              <TableHead className="text-muted-foreground">Added</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                className="border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {candidate.firstName} {candidate.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" />
                    <a
                      href={`mailto:${candidate.email}`}
                      className="hover:text-accent transition-colors"
                    >
                      {candidate.email}
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {candidate.currentRole || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {candidate.location ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {candidate.yearsExperience ? `${candidate.yearsExperience} yrs` : '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex gap-1 flex-wrap max-w-xs">
                    {candidate.skills?.slice(0, 2).map((skill: any, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-accent/10 text-accent rounded"
                      >
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                    {(candidate.skills?.length || 0) > 2 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{(candidate.skills?.length || 0) - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(candidate.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="text-foreground cursor-pointer">
                        <Link
                          href={`/candidates/${candidate.id}`}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground cursor-pointer">
                        <Link
                          href={`/candidates/${candidate.id}/edit`}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => onDelete?.(candidate.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
