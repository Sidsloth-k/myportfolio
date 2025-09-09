import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, FileText, Image as ImageIcon, Link, Quote } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

const ContentManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const contentSections = [
    { id: 'hero', label: 'Hero Section', icon: FileText, count: 4 },
    { id: 'about', label: 'About Page', icon: FileText, count: 6 },
    { id: 'skills', label: 'Skills', icon: FileText, count: 8 },
    { id: 'testimonials', label: 'Testimonials', icon: Quote, count: 5 },
    { id: 'navigation', label: 'Navigation', icon: Link, count: 5 }
  ];

  const [contentData, setContentData] = useState({
    hero: [
      { id: 1, type: 'title', content: 'Armed Detective Agency', editable: true },
      { id: 2, type: 'subtitle', content: 'Solving Digital Mysteries with Detective Precision', editable: true },
      { id: 3, type: 'description', content: 'Welcome to Sidney\'s portfolio, where IT expertise meets literary inspiration...', editable: true },
      { id: 4, type: 'cta', content: 'Begin Investigation', editable: true }
    ],
    about: [
      { id: 1, type: 'title', content: 'Detective Character Arc', editable: true },
      { id: 2, type: 'subtitle', content: 'From Mysterious Past to Digital Mastery', editable: true },
      { id: 3, type: 'description', content: 'Like Dazai Osamu himself, my journey...', editable: true },
      { id: 4, type: 'quote', content: 'Every mystery has a solution waiting to be discovered.', editable: true },
      { id: 5, type: 'skills_intro', content: 'Core Abilities Developed', editable: true },
      { id: 6, type: 'experience', content: '4+ years of solving digital mysteries', editable: true }
    ],
    skills: [
      { id: 1, type: 'section_title', content: 'Detective Arsenal', editable: true },
      { id: 2, type: 'section_description', content: 'Like the diverse abilities of the Armed Detective Agency members...', editable: true },
      { id: 3, type: 'skill_react', content: 'React Development', editable: true },
      { id: 4, type: 'skill_nodejs', content: 'Node.js Backend', editable: true },
      { id: 5, type: 'skill_design', content: 'UI/UX Design', editable: true },
      { id: 6, type: 'skill_marketing', content: 'Marketing Analytics', editable: true },
      { id: 7, type: 'skill_database', content: 'Database Management', editable: true },
      { id: 8, type: 'call_to_action', content: 'Explore Detailed Case Studies', editable: true }
    ],
    testimonials: [
      { id: 1, type: 'client_name', content: 'Inspector Tanaka', editable: true },
      { id: 2, type: 'client_role', content: 'Lead Detective, Yokohama PD', editable: true },
      { id: 3, type: 'testimonial_text', content: 'Sidney\'s work has revolutionized our investigation process...', editable: true },
      { id: 4, type: 'rating', content: '5', editable: true },
      { id: 5, type: 'project_reference', content: 'Detective Case Management System', editable: true }
    ],
    navigation: [
      { id: 1, type: 'nav_home', content: 'Home', editable: true },
      { id: 2, type: 'nav_about', content: 'About', editable: true },
      { id: 3, type: 'nav_skills', content: 'Skills', editable: true },
      { id: 4, type: 'nav_projects', content: 'Projects', editable: true },
      { id: 5, type: 'nav_contact', content: 'Contact', editable: true }
    ]
  });

  const [editForm, setEditForm] = useState({ content: '', type: '' });

  const handleEdit = (itemId: string, content: string, type: string) => {
    setEditingItem(itemId);
    setEditForm({ content, type });
  };

  const handleSave = () => {
    setContentData(prev => ({
      ...prev,
      [activeSection]: prev[activeSection as keyof typeof prev].map((item: any) =>
        item.id.toString() === editingItem
          ? { ...item, content: editForm.content }
          : item
      )
    }));
    setEditingItem(null);
    setEditForm({ content: '', type: '' });
  };

  const handleDelete = (itemId: string) => {
    setContentData(prev => ({
      ...prev,
      [activeSection]: prev[activeSection as keyof typeof prev].filter((item: any) => item.id.toString() !== itemId)
    }));
  };

  const handleAdd = () => {
    const newId = Math.max(...contentData[activeSection as keyof typeof contentData].map((item: any) => item.id)) + 1;
    setContentData(prev => ({
      ...prev,
      [activeSection]: [
        ...prev[activeSection as keyof typeof prev],
        { id: newId, type: 'new_content', content: 'New content item', editable: true }
      ]
    }));
    setShowAddForm(false);
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('title')) return FileText;
    if (type.includes('quote')) return Quote;
    if (type.includes('link') || type.includes('nav')) return Link;
    if (type.includes('image')) return ImageIcon;
    return FileText;
  };

  const getTypeColor = (type: string) => {
    if (type.includes('title')) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (type.includes('quote')) return 'text-purple-600 bg-purple-100 border-purple-300';
    if (type.includes('link') || type.includes('nav')) return 'text-green-600 bg-green-100 border-green-300';
    if (type.includes('description')) return 'text-orange-600 bg-orange-100 border-orange-300';
    return 'text-gray-600 bg-gray-100 border-gray-300';
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
          Content Management
        </motion.h1>
        <p className="hierarchy-secondary">
          Manage all text content, headlines, descriptions, and copy across the portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold hierarchy-primary mb-4">Content Sections</h3>
            <div className="space-y-2">
              {contentSections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground anime-shadow'
                      : 'hover:bg-muted/50 hierarchy-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-4 h-4" />
                    <span className="font-medium">{section.label}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activeSection === section.id 
                        ? 'border-primary-foreground/20 text-primary-foreground' 
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {section.count}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content Items */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold hierarchy-primary">
                {contentSections.find(s => s.id === activeSection)?.label} Content
              </h3>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>

            <div className="space-y-4">
              {contentData[activeSection as keyof typeof contentData]?.map((item: any) => {
                const TypeIcon = getTypeIcon(item.type);
                const isEditing = editingItem === item.id.toString();

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                          <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${getTypeColor(item.type)}`}
                        >
                          {item.type.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSave}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingItem(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item.id.toString(), item.content, item.type)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/20 hover:bg-destructive/10"
                              onClick={() => handleDelete(item.id.toString())}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.type}
                          onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="Content type (e.g., title, description)"
                          className="w-full"
                        />
                        <Textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Content text"
                          className="w-full min-h-[100px]"
                        />
                      </div>
                    ) : (
                      <div className="hierarchy-secondary leading-relaxed">
                        {item.content}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Add Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 border border-accent/20 bg-accent/5 rounded-lg"
              >
                <h4 className="font-semibold hierarchy-primary mb-4">Add New Content Item</h4>
                <div className="space-y-3">
                  <Input placeholder="Content type (e.g., title, description)" />
                  <Textarea placeholder="Content text" className="min-h-[100px]" />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Add Content
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentManager;