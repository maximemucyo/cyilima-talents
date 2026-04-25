'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Bell, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();
  
  // Split name if possible
  const fullName = session?.user?.name || 'Admin User';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || 'Admin';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application settings</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card border-border">
            <TabsTrigger value="account" className="text-foreground data-[state=active]:bg-primary">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-foreground data-[state=active]:bg-primary"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="text-foreground data-[state=active]:bg-primary"
            >
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="text-foreground data-[state=active]:bg-primary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Account Information</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      defaultValue={firstName}
                      className="mt-2 bg-muted border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      defaultValue={lastName}
                      className="mt-2 bg-muted border-border text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={session?.user?.email || 'admin@cyilimatalents.com'}
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-foreground">
                    Company
                  </Label>
                  <Input
                    id="company"
                    defaultValue="Cyilima Team"
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Email Notifications</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose what you want to be notified about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded">
                  <Label className="text-foreground cursor-pointer flex-1">
                    Screening Completed
                  </Label>
                  <Switch defaultChecked className="ml-2" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded">
                  <Label className="text-foreground cursor-pointer flex-1">
                    New Candidates Added
                  </Label>
                  <Switch defaultChecked className="ml-2" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded">
                  <Label className="text-foreground cursor-pointer flex-1">
                    Job Filled
                  </Label>
                  <Switch defaultChecked={false} className="ml-2" />
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded">
                  <Label className="text-foreground cursor-pointer flex-1">
                    Weekly Summary
                  </Label>
                  <Switch defaultChecked className="ml-2" />
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-foreground">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-foreground">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">API Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage your API keys and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="apiKey" className="text-foreground">
                    API Key
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="apiKey"
                      type="password"
                      value="sk_live_1234567890abcdef"
                      readOnly
                      className="bg-muted border-border text-foreground"
                    />
                    <Button variant="outline" className="border-border">
                      Copy
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="border-border text-destructive hover:bg-destructive/10 w-full"
                >
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download or delete all your data
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted flex-1"
                  >
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10 flex-1"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
