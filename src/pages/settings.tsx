'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/common/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/common/card';

import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Button } from '@/components/common/button';
import { Switch } from '@/components/common/switch';
import { Separator } from '@/components/common/separator';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/common/avatar';
import { ArrowLeft, Bell, Moon, Shield, User } from 'lucide-react';
import Header from '@/components/layout/header';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header onMenuClick={() => {}} />

      <div className="container mx-auto pt-20 pb-10 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Settings Navigation */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-none h-12 text-base flex items-center gap-3 transition-all ${activeTab === 'account' ? 'bg-gray-100 dark:bg-gray-800 font-semibold border-l-4 border-gray-900 dark:border-gray-100' : 'pl-2 text-gray-900 dark:text-gray-100'}`}
                    onClick={() => setActiveTab('account')}
                    aria-current={activeTab === 'account' ? 'page' : undefined}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-none h-12 text-base flex items-center gap-3 transition-all ${activeTab === 'notifications' ? 'bg-gray-100 dark:bg-gray-800 font-semibold border-l-4 border-gray-900 dark:border-gray-100' : 'pl-2 text-gray-900 dark:text-gray-100'}`}
                    onClick={() => setActiveTab('notifications')}
                    aria-current={
                      activeTab === 'notifications' ? 'page' : undefined
                    }
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-none h-12 text-base flex items-center gap-3 transition-all ${activeTab === 'appearance' ? 'bg-gray-100 dark:bg-gray-800 font-semibold border-l-4 border-gray-900 dark:border-gray-100' : 'pl-2 text-gray-900 dark:text-gray-100'}`}
                    onClick={() => setActiveTab('appearance')}
                    aria-current={
                      activeTab === 'appearance' ? 'page' : undefined
                    }
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Appearance
                  </Button>
                  <Button
                    variant="ghost"
                    className={`justify-start rounded-none h-12 text-base flex items-center gap-3 transition-all ${activeTab === 'security' ? 'bg-gray-100 dark:bg-gray-800 font-semibold border-l-4 border-gray-900 dark:border-gray-100' : 'pl-2 text-gray-900 dark:text-gray-100'}`}
                    onClick={() => setActiveTab('security')}
                    aria-current={activeTab === 'security' ? 'page' : undefined}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Settings Content */}
          <div className="space-y-6">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and how it appears on
                      your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src="/placeholder.svg?height=80&width=80"
                          alt="Profile picture"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-medium">Profile Picture</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Upload new
                          </Button>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-2">
                      <Label htmlFor="name">
                        What is your name?{' '}
                        <span className="text-red-600">(required)</span>
                      </Label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your Hebrew name. If you don't have a Hebrew name,
                        then enter your English first name.
                      </span>
                      <Input
                        id="name"
                        name="name"
                        required
                        defaultValue=""
                        aria-label="Name"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Public
                      </span>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="nickname">
                        Nickname{' '}
                        <span className="text-red-600">(required)</span>
                      </Label>
                      <Input
                        id="nickname"
                        name="nickname"
                        required
                        defaultValue=""
                        aria-label="Nickname"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Public
                      </span>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="church-location">
                        Church Location{' '}
                        <span className="text-red-600">(required)</span>
                      </Label>
                      <Input
                        id="church-location"
                        name="church-location"
                        required
                        defaultValue=""
                        aria-label="Church Location"
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Public
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline">Save changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Manage your email address and phone number
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="jane.doe@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Add a phone number"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline">Save changes</Button>
                  </CardFooter>
                </Card>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-comments">
                          Comments on your posts
                        </Label>
                        <Switch id="email-comments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-tags">When you're tagged</Label>
                        <Switch id="email-tags" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-follows">New followers</Label>
                        <Switch id="email-follows" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-messages">Direct messages</Label>
                        <Switch id="email-messages" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-comments">
                          Comments on your posts
                        </Label>
                        <Switch id="push-comments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-tags">When you're tagged</Label>
                        <Switch id="push-tags" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-follows">New followers</Label>
                        <Switch id="push-follows" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-messages">Direct messages</Label>
                        <Switch id="push-messages" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">Save preferences</Button>
                </CardFooter>
              </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how SocialApp looks for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-md p-2 cursor-pointer bg-white">
                          <div className="w-full h-24 bg-white rounded-md border border-gray-200"></div>
                        </div>
                        <span className="text-sm">Light</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-md p-2 cursor-pointer bg-gray-950">
                          <div className="w-full h-24 bg-gray-950 rounded-md border border-gray-800"></div>
                        </div>
                        <span className="text-sm">Dark</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="border border-gray-200 dark:border-gray-800 rounded-md p-2 cursor-pointer bg-gradient-to-b from-white to-gray-950">
                          <div className="w-full h-24 bg-gradient-to-b from-white to-gray-950 rounded-md border border-gray-300"></div>
                        </div>
                        <span className="text-sm">System</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">Save preferences</Button>
                </CardFooter>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">
                      Confirm new password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline">Update password</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
