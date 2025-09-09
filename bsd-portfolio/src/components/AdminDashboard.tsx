import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Save, Plus, Edit, Trash2, Image, Link, Type, 
  Users, BarChart3, Eye, EyeOff, Upload, Download, RefreshCw,
  FileText, Palette, Code, TrendingUp, Shield, Key
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - in real implementation, this would come from a backend
  const [contentData, setContentData] = useState({
    hero: {
      title: "Sidney's Portfolio",
      subtitle: "Armed Detective Agency presents",
      description: "Where IT mastery meets creative design, powered by strategic marketing",
      backgroundImage: "",
      ctaButtons: [
        { text: "Explore the Case Files", style: "primary", link: "#projects" },
        { text: "Contact the Detective", style: "secondary", link: "#contact" }
      ]
    },
    about: {
      title: "The Detective's Story",
      description: "Like every character in Bungou Stray Dogs, Sidney has a unique backstory...",
      image: "",
      characteristics: [
        { title: "Strategic Thinking", percentage: 95 },
        { title: "Creative Problem Solving", percentage: 92 },
        { title: "Attention to Detail", percentage: 89 },
        { title: "User Empathy", percentage: 94 }
      ]
    },
    projects: [
      {
        id: 1,
        title: "Detective Case Management System",
        category: "Full-Stack Development",
        description: "A comprehensive case management system...",
        image: "",
        technologies: ["React", "Node.js", "PostgreSQL"],
        links: { live: "", github: "", documentation: "" },
        status: "completed"
      }
    ],
    skills: [
      {
        name: "React",
        category: "Frontend",
        proficiency: 95,
        experience: "4+ years",
        description: "Advanced React development...",
        projects: [1, 4, 2]
      }
    ],
    contact: {
      title: "Request an Investigation",
      subtitle: "Have a digital mystery that needs solving?",
      email: "sidney@detective-agency.dev",
      phone: "+81-045-XXX-XXXX",
      location: "Yokohama, Japan"
    }
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Sidney's Portfolio",
    tagline: "Armed Detective Agency Developer",
    theme: "dazai",
    language: "en",
    analytics: true,
    maintenance: false,
    seo: {
      title: "Sidney - Full-Stack Developer & Designer",
      description: "Anime-inspired portfolio showcasing IT, design, and marketing expertise",
      keywords: "developer, designer, full-stack, anime, bungou stray dogs"
    }
  });

  const ContentEditor = ({ section }: { section: string }) => {
    const data = contentData[section as keyof typeof contentData];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-dazai-brown capitalize">{section} Content</h3>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isPreview} 
              onCheckedChange={setIsPreview}
              id="preview-mode"
            />
            <Label htmlFor="preview-mode">Preview Mode</Label>
          </div>
        </div>

        {section === 'hero' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Main Title</Label>
                <Input 
                  value={(data as any).title} 
                  onChange={(e) => {/* Update logic */}}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input 
                  value={(data as any).subtitle} 
                  onChange={(e) => {/* Update logic */}}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={(data as any).description} 
                  onChange={(e) => {/* Update logic */}}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Background Image</Label>
                <div className="mt-1 border-2 border-dashed border-dazai-gold/30 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-dazai-muted mx-auto mb-2" />
                  <p className="text-sm text-dazai-muted">Drop image here or click to upload</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-dazai-brown">Projects</h4>
              <Button className="bg-dazai-brown hover:bg-dazai-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(data as any[]).map((project: any, index: number) => (
                <Card key={project.id} className="p-4 border-dazai-gold/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-dazai-dark">{project.title}</h5>
                      <Badge variant="outline">{project.category}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-dazai-muted mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech: string) => (
                      <span key={tech} className="px-2 py-1 bg-dazai-beige/30 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2 text-xs">
                    <Badge className={project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {project.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MediaManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-dazai-brown">Media Library</h3>
        <Button className="bg-dazai-brown hover:bg-dazai-dark">
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="relative aspect-square bg-dazai-beige/30 rounded-lg overflow-hidden border border-dazai-gold/30 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-dazai-gold/20 to-dazai-brown/20 flex items-center justify-center">
              <Image className="w-8 h-8 text-dazai-muted" />
            </div>
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <Button size="sm" variant="outline" className="text-white border-white">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-white border-white">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const Analytics = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-dazai-brown">Portfolio Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Views', value: '12,847', change: '+23%', icon: Eye },
          { label: 'Project Clicks', value: '3,241', change: '+18%', icon: BarChart3 },
          { label: 'Contact Forms', value: '147', change: '+45%', icon: Users },
          { label: 'Skill Views', value: '2,856', change: '+12%', icon: Code }
        ].map((metric, index) => (
          <Card key={index} className="p-6 border-dazai-gold/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dazai-muted">{metric.label}</p>
                <p className="text-2xl font-bold text-dazai-dark">{metric.value}</p>
                <p className="text-sm text-green-600">{metric.change}</p>
              </div>
              <metric.icon className="w-8 h-8 text-dazai-gold" />
            </div>
          </Card>
        ))}
      </div>

      {/* Chart placeholder */}
      <Card className="p-6 border-dazai-gold/30">
        <h4 className="text-lg font-semibold text-dazai-brown mb-4">Visitor Trends</h4>
        <div className="h-64 bg-gradient-to-br from-dazai-cream to-dazai-beige rounded-lg flex items-center justify-center">
          <p className="text-dazai-muted">Chart visualization would go here</p>
        </div>
      </Card>
    </div>
  );

  const SettingsPanel = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-dazai-brown">Site Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-dazai-gold/30">
          <h4 className="text-lg font-semibold text-dazai-brown mb-4">General</h4>
          <div className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input value={siteSettings.siteName} className="mt-1" />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input value={siteSettings.tagline} className="mt-1" />
            </div>
            <div>
              <Label>Theme</Label>
              <select className="w-full mt-1 px-3 py-2 border border-input rounded-md">
                <option value="dazai">Dazai Theme</option>
                <option value="akutagawa">Akutagawa Theme</option>
                <option value="atsushi">Atsushi Theme</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-dazai-gold/30">
          <h4 className="text-lg font-semibold text-dazai-brown mb-4">Advanced</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Analytics Enabled</Label>
              <Switch checked={siteSettings.analytics} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Maintenance Mode</Label>
              <Switch checked={siteSettings.maintenance} />
            </div>
            <div className="pt-4 border-t border-dazai-gold/20">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* SEO Settings */}
      <Card className="p-6 border-dazai-gold/30">
        <h4 className="text-lg font-semibold text-dazai-brown mb-4">SEO Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Meta Title</Label>
            <Input value={siteSettings.seo.title} className="mt-1" />
          </div>
          <div>
            <Label>Meta Keywords</Label>
            <Input value={siteSettings.seo.keywords} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Meta Description</Label>
            <Textarea value={siteSettings.seo.description} className="mt-1" rows={3} />
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-hidden"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute right-0 top-0 h-full w-full max-w-7xl bg-background border-l border-dazai-gold/30 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-dazai-brown to-dazai-dark text-white p-6 border-b border-dazai-gold/30 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-dazai-beige">Portfolio Content Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-dazai-brown">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-dazai-brown"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>Media</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Projects</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="space-y-8">
                <ContentEditor section="hero" />
                <ContentEditor section="about" />
                <ContentEditor section="contact" />
              </div>
            </TabsContent>

            <TabsContent value="media">
              <MediaManager />
            </TabsContent>

            <TabsContent value="projects">
              <ContentEditor section="projects" />
            </TabsContent>

            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;