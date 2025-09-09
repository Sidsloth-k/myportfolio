import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, User, Globe, Shield, Bell, Palette, Database } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [openSelects, setOpenSelects] = useState<{ [key: string]: boolean }>({});

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'backup', label: 'Backup', icon: Database }
  ];

  const [settings, setSettings] = useState({
    // General
    siteName: 'Armed Detective Agency Portfolio',
    siteDescription: 'Sidney\'s portfolio showcasing IT, UX, and marketing expertise',
    siteUrl: 'https://sidney-portfolio.com',
    
    // Profile
    name: 'Sidney',
    email: 'sidney@detective-agency.dev',
    bio: 'Detective specializing in digital mysteries and creative solutions',
    location: 'Yokohama, Japan',
    
    // Site Settings
    language: 'en',
    timezone: 'Asia/Tokyo',
    analyticsEnabled: true,
    maintenanceMode: false,
    
    // Security
    twoFactorEnabled: false,
    passwordChangeRequired: false,
    sessionTimeout: '24',
    
    // Notifications
    emailNotifications: true,
    projectUpdates: true,
    adminAlerts: true,
    weeklyReports: false,
    
    // Appearance
    defaultTheme: 'light',
    animationsEnabled: true,
    compactMode: false,
    
    // Backup
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '30'
  });

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSelectOpenChange = (selectKey: string, open: boolean) => {
    setOpenSelects(prev => ({ ...prev, [selectKey]: open }));
  };

  const handleSave = () => {
    // Save settings logic here
    setHasChanges(false);
    console.log('Settings saved:', settings);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={settings.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'site':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleInputChange('language', value)}
                open={openSelects.language}
                onOpenChange={(open) => handleSelectOpenChange('language', open)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleInputChange('timezone', value)}
                open={openSelects.timezone}
                onOpenChange={(open) => handleSelectOpenChange('timezone', open)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics Enabled</Label>
                <p className="text-sm hierarchy-tertiary">Track site usage and performance</p>
              </div>
              <Switch
                checked={settings.analyticsEnabled}
                onCheckedChange={(checked) => handleInputChange('analyticsEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm hierarchy-tertiary">Temporarily disable the site</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm hierarchy-tertiary">Add extra security to your account</p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => handleInputChange('twoFactorEnabled', checked)}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Select 
                value={settings.sessionTimeout} 
                onValueChange={(value) => handleInputChange('sessionTimeout', value)}
                open={openSelects.sessionTimeout}
                onOpenChange={(open) => handleSelectOpenChange('sessionTimeout', open)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Password Change</Label>
                <p className="text-sm hierarchy-tertiary">Force password change on next login</p>
              </div>
              <Switch
                checked={settings.passwordChangeRequired}
                onCheckedChange={(checked) => handleInputChange('passwordChangeRequired', checked)}
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm hierarchy-tertiary">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Project Updates</Label>
                <p className="text-sm hierarchy-tertiary">Get notified about project changes</p>
              </div>
              <Switch
                checked={settings.projectUpdates}
                onCheckedChange={(checked) => handleInputChange('projectUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Admin Alerts</Label>
                <p className="text-sm hierarchy-tertiary">Important system notifications</p>
              </div>
              <Switch
                checked={settings.adminAlerts}
                onCheckedChange={(checked) => handleInputChange('adminAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm hierarchy-tertiary">Receive weekly analytics reports</p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleInputChange('weeklyReports', checked)}
              />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="defaultTheme">Default Theme</Label>
              <Select 
                value={settings.defaultTheme} 
                onValueChange={(value) => handleInputChange('defaultTheme', value)}
                open={openSelects.defaultTheme}
                onOpenChange={(open) => handleSelectOpenChange('defaultTheme', open)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Animations Enabled</Label>
                <p className="text-sm hierarchy-tertiary">Show smooth transitions and effects</p>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => handleInputChange('animationsEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Compact Mode</Label>
                <p className="text-sm hierarchy-tertiary">Use more compact layouts</p>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={(checked) => handleInputChange('compactMode', checked)}
              />
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Backup</Label>
                <p className="text-sm hierarchy-tertiary">Automatically backup data</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
              />
            </div>
            <div>
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select 
                value={settings.backupFrequency} 
                onValueChange={(value) => handleInputChange('backupFrequency', value)}
                open={openSelects.backupFrequency}
                onOpenChange={(open) => handleSelectOpenChange('backupFrequency', open)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
              <Select 
                value={settings.retentionPeriod} 
                onValueChange={(value) => handleInputChange('retentionPeriod', value)}
                open={openSelects.retentionPeriod}
                onOpenChange={(open) => handleSelectOpenChange('retentionPeriod', open)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select retention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold hierarchy-primary mb-2"
        >
          Settings
        </motion.h1>
        <p className="hierarchy-secondary">
          Configure site settings, preferences, and account options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div>
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground anime-shadow'
                      : 'hover:bg-muted/50 hierarchy-primary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold hierarchy-primary">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              {hasChanges && (
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsManager;