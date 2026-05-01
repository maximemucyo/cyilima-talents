'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

import { ModeToggle } from '@/components/layout/mode-toggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Login successful');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-xl">
              <img src="/brand-logo.png" alt="Cyilima Talents Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">Sign In</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your email and password to access the Cyilima Talents platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@umurava.rw" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="bg-muted border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="April 2026 Admin Pwd" className="text-foreground">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="bg-muted border-input text-foreground"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
            <p className="text-xs text-primary text-center">
              Demo Admin: admin@umurava.rw / Admin@2026
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
