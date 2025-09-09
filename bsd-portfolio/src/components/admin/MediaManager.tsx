import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Edit, Download, Search, Grid, List, Image as ImageIcon, File, Video } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const MediaManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All Media', count: 24 },
    { id: 'images', label: 'Images', count: 18 },
    { id: 'videos', label: 'Videos', count: 3 },
    { id: 'documents', label: 'Documents', count: 3 }
  ];

  const mediaFiles = [
    {
      id: '1',
      name: 'dazai-hero-banner.jpg',
      type: 'image',
      size: '2.4 MB',
      dimensions: '1920x1080',
      category: 'images',
      uploadDate: '2024-01-15',
      alt: 'Dazai Osamu hero banner'
    },
    {
      id: '2',
      name: 'detective-dashboard-screenshot.png',
      type: 'image',
      size: '1.8 MB',
      dimensions: '1440x900',
      category: 'images',
      uploadDate: '2024-01-14',
      alt: 'Detective system dashboard'
    },
    {
      id: '3',
      name: 'project-showcase-video.mp4',
      type: 'video',
      size: '15.6 MB',
      duration: '2:34',
      category: 'videos',
      uploadDate: '2024-01-13',
      alt: 'Project showcase video'
    },
    {
      id: '4',
      name: 'skills-icons-collection.svg',
      type: 'image',
      size: '256 KB',
      dimensions: 'Vector',
      category: 'images',
      uploadDate: '2024-01-12',
      alt: 'Skills icons collection'
    },
    {
      id: '5',
      name: 'character-arc-illustration.jpg',
      type: 'image',
      size: '3.2 MB',
      dimensions: '2048x1536',
      category: 'images',
      uploadDate: '2024-01-11',
      alt: 'Character development arc'
    },
    {
      id: '6',
      name: 'portfolio-documentation.pdf',
      type: 'document',
      size: '1.2 MB',
      pages: 24,
      category: 'documents',
      uploadDate: '2024-01-10',
      alt: 'Portfolio documentation'
    }
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'document': return File;
      default: return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'video': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'document': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredFiles.map((file, index) => {
        const FileIcon = getFileIcon(file.type);
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
              isSelected ? 'border-primary anime-shadow' : 'border-border hover:border-accent/50'
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            {/* File Preview */}
            <div className="aspect-video bg-muted/30 flex items-center justify-center relative">
              {file.type === 'image' ? (
                <ImageWithFallback
                  src=""
                  alt={file.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileIcon className="w-12 h-12 text-muted-foreground" />
              )}
              
              {/* Selection Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm">✓</span>
                  </div>
                </div>
              )}

              {/* File Type Badge */}
              <div className="absolute top-2 right-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${getFileTypeColor(file.type)}`}
                >
                  {file.type.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* File Info */}
            <div className="p-4">
              <h4 className="font-medium hierarchy-primary truncate mb-2">
                {file.name}
              </h4>
              <div className="space-y-1 text-sm hierarchy-tertiary">
                <div>Size: {file.size}</div>
                {file.dimensions && <div>Dimensions: {file.dimensions}</div>}
                {file.duration && <div>Duration: {file.duration}</div>}
                {file.pages && <div>Pages: {file.pages}</div>}
                <div>Uploaded: {file.uploadDate}</div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                <Button size="sm" variant="outline" className="text-xs">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const ListView = () => (
    <div className="space-y-3">
      {filteredFiles.map((file, index) => {
        const FileIcon = getFileIcon(file.type);
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`flex items-center justify-between p-4 bg-card border rounded-lg cursor-pointer transition-all duration-300 ${
              isSelected ? 'border-primary anime-shadow' : 'border-border hover:border-accent/50'
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            <div className="flex items-center space-x-4">
              {/* Selection Checkbox */}
              <div className={`w-5 h-5 border-2 rounded transition-colors ${
                isSelected ? 'bg-primary border-primary' : 'border-border'
              }`}>
                {isSelected && (
                  <span className="text-primary-foreground text-xs flex items-center justify-center">✓</span>
                )}
              </div>

              {/* File Icon */}
              <div className="w-10 h-10 bg-muted/30 rounded-lg flex items-center justify-center">
                <FileIcon className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium hierarchy-primary truncate">{file.name}</h4>
                <div className="text-sm hierarchy-tertiary">
                  {file.type.toUpperCase()} • {file.size} • {file.uploadDate}
                </div>
              </div>

              {/* File Metadata */}
              <div className="text-sm hierarchy-tertiary text-right hidden md:block">
                {file.dimensions && <div>{file.dimensions}</div>}
                {file.duration && <div>{file.duration}</div>}
                {file.pages && <div>{file.pages} pages</div>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

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
          Media Library
        </motion.h1>
        <p className="hierarchy-secondary">
          Manage images, videos, and documents used throughout the portfolio.
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Upload Button */}
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none border-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none border-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-border flex items-center justify-between"
          >
            <span className="hierarchy-secondary">
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Selected
              </Button>
              <Button size="sm" variant="outline" className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Media Grid/List */}
      <Card className="p-6">
        {viewMode === 'grid' ? <GridView /> : <ListView />}
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold hierarchy-primary mb-2">No files found</h3>
            <p className="hierarchy-secondary">
              {searchTerm ? 'No files match your search criteria.' : 'Upload some files to get started.'}
            </p>
          </div>
        )}
      </Card>

      {/* Storage Info */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold hierarchy-primary mb-4">Storage Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold hierarchy-primary mb-1">24.6 GB</div>
            <div className="hierarchy-secondary">Used</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold hierarchy-primary mb-1">75.4 GB</div>
            <div className="hierarchy-secondary">Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold hierarchy-primary mb-1">100 GB</div>
            <div className="hierarchy-secondary">Total</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm hierarchy-tertiary mb-2">
            <span>Storage Used</span>
            <span>24.6%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '24.6%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MediaManager;