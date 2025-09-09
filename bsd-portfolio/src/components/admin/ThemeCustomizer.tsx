import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, Upload, RotateCcw, Eye, Sun, Moon, Layers } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { 
  currentLightTheme, 
  currentDarkTheme, 
  currentLightGradients, 
  currentDarkGradients,
  updateTheme,
  type ColorTheme,
  type GradientTheme
} from '../../styles/colorSystem';

const ThemeCustomizer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('light');
  const [lightColors, setLightColors] = useState<ColorTheme>(currentLightTheme);
  const [darkColors, setDarkColors] = useState<ColorTheme>(currentDarkTheme);
  const [lightGradients, setLightGradients] = useState<GradientTheme>(currentLightGradients);
  const [darkGradients, setDarkGradients] = useState<GradientTheme>(currentDarkGradients);
  const [previewMode, setPreviewMode] = useState(false);

  const currentColors = activeMode === 'light' ? lightColors : darkColors;
  const currentGradients = activeMode === 'light' ? lightGradients : darkGradients;

  const handleColorChange = (colorKey: keyof ColorTheme, value: string) => {
    if (activeMode === 'light') {
      setLightColors(prev => ({ ...prev, [colorKey]: value }));
    } else {
      setDarkColors(prev => ({ ...prev, [colorKey]: value }));
    }
  };

  const handleGradientChange = (gradientKey: keyof GradientTheme, value: string) => {
    if (activeMode === 'light') {
      setLightGradients(prev => ({ ...prev, [gradientKey]: value }));
    } else {
      setDarkGradients(prev => ({ ...prev, [gradientKey]: value }));
    }
  };

  const applyChanges = () => {
    updateTheme(lightColors, darkColors, lightGradients, darkGradients);
    setPreviewMode(false);
  };

  const resetToDefaults = () => {
    // Reset to original defaults
    setLightColors(currentLightTheme);
    setDarkColors(currentDarkTheme);
    setLightGradients(currentLightGradients);
    setDarkGradients(currentDarkGradients);
    updateTheme();
  };

  const exportTheme = () => {
    const themeData = {
      lightColors,
      darkColors,
      lightGradients,
      darkGradients
    };
    
    const dataStr = JSON.stringify(themeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-theme.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        
        if (themeData.lightColors) setLightColors(themeData.lightColors);
        if (themeData.darkColors) setDarkColors(themeData.darkColors);
        if (themeData.lightGradients) setLightGradients(themeData.lightGradients);
        if (themeData.darkGradients) setDarkGradients(themeData.darkGradients);
        
        updateTheme(themeData.lightColors, themeData.darkColors, themeData.lightGradients, themeData.darkGradients);
      } catch (error) {
        console.error('Failed to import theme:', error);
      }
    };
    reader.readAsText(file);
  };

  const ColorPicker = ({ colorKey, label, value }: { colorKey: keyof ColorTheme; label: string; value: string }) => (
    <div className="space-y-2">
      <Label htmlFor={colorKey} className="text-sm font-medium hierarchy-primary">
        {label}
      </Label>
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg border border-border cursor-pointer hover:scale-110 transition-transform"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`${colorKey}-input`)?.click()}
        />
        <Input
          id={`${colorKey}-input`}
          type="color"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="sr-only"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="flex-1 font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const GradientEditor = ({ gradientKey, label, value }: { gradientKey: keyof GradientTheme; label: string; value: string }) => (
    <div className="space-y-2">
      <Label htmlFor={gradientKey} className="text-sm font-medium hierarchy-primary">
        {label}
      </Label>
      <div className="space-y-2">
        <div 
          className="w-full h-10 rounded-lg border border-border"
          style={{ background: value }}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => handleGradientChange(gradientKey, e.target.value)}
          className="font-mono text-sm"
          placeholder="linear-gradient(...)"
        />
      </div>
    </div>
  );

  const colorCategories = [
    {
      title: 'Core Colors',
      colors: [
        { key: 'background' as keyof ColorTheme, label: 'Background' },
        { key: 'foreground' as keyof ColorTheme, label: 'Foreground' },
        { key: 'primary' as keyof ColorTheme, label: 'Primary' },
        { key: 'secondary' as keyof ColorTheme, label: 'Secondary' },
        { key: 'accent' as keyof ColorTheme, label: 'Accent' },
        { key: 'muted' as keyof ColorTheme, label: 'Muted' }
      ]
    },
    {
      title: 'Dazai Theme Colors',
      colors: [
        { key: 'dazaiBrown' as keyof ColorTheme, label: 'Dazai Brown' },
        { key: 'dazaiBeige' as keyof ColorTheme, label: 'Dazai Beige' },
        { key: 'dazaiGold' as keyof ColorTheme, label: 'Dazai Gold' },
        { key: 'dazaiCream' as keyof ColorTheme, label: 'Dazai Cream' }
      ]
    },
    {
      title: 'Interface Colors',
      colors: [
        { key: 'card' as keyof ColorTheme, label: 'Card Background' },
        { key: 'border' as keyof ColorTheme, label: 'Border' },
        { key: 'input' as keyof ColorTheme, label: 'Input' },
        { key: 'ring' as keyof ColorTheme, label: 'Focus Ring' }
      ]
    }
  ];

  const gradientCategories = [
    {
      title: 'Primary Gradients',
      gradients: [
        { key: 'heroGradient' as keyof GradientTheme, label: 'Hero Section' },
        { key: 'cardGradient' as keyof GradientTheme, label: 'Card Background' },
        { key: 'buttonGradient' as keyof GradientTheme, label: 'Button' },
        { key: 'accentGradient' as keyof GradientTheme, label: 'Accent' }
      ]
    },
    {
      title: 'Character Gradients',
      gradients: [
        { key: 'dazaiGradient' as keyof GradientTheme, label: 'Dazai' },
        { key: 'akutagawaGradient' as keyof GradientTheme, label: 'Akutagawa' },
        { key: 'atsushiGradient' as keyof GradientTheme, label: 'Atsushi' },
        { key: 'chuuyaGradient' as keyof GradientTheme, label: 'Chuuya' }
      ]
    },
    {
      title: 'Effect Gradients',
      gradients: [
        { key: 'glowGradient' as keyof GradientTheme, label: 'Glow Effect' },
        { key: 'shadowGradient' as keyof GradientTheme, label: 'Shadow' },
        { key: 'animeBorderGradient' as keyof GradientTheme, label: 'Anime Border' }
      ]
    }
  ];

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
          Theme Customizer
        </motion.h1>
        <p className="hierarchy-secondary">
          Customize colors, gradients, and visual elements across the entire portfolio.
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-4">
            <Label className="text-sm font-medium">Theme Mode:</Label>
            <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveMode('light')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
                  activeMode === 'light' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setActiveMode('dark')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
                  activeMode === 'dark' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={previewMode}
                onCheckedChange={setPreviewMode}
                id="preview-mode"
              />
              <Label htmlFor="preview-mode" className="text-sm">Live Preview</Label>
            </div>
            
            <Button variant="outline" onClick={exportTheme}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" onClick={() => document.getElementById('import-input')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              id="import-input"
              type="file"
              accept=".json"
              onChange={importTheme}
              className="sr-only"
            />
            
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button onClick={applyChanges} className="bg-primary hover:bg-primary/90">
              <Eye className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Editor */}
      <Tabs defaultValue="colors" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="colors" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="gradients" className="flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>Gradients</span>
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-8">
          {colorCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold hierarchy-primary mb-6">
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.colors.map((colorDef) => (
                    <ColorPicker
                      key={colorDef.key}
                      colorKey={colorDef.key}
                      label={colorDef.label}
                      value={currentColors[colorDef.key]}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Gradients Tab */}
        <TabsContent value="gradients" className="space-y-8">
          {gradientCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold hierarchy-primary mb-6">
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.gradients.map((gradientDef) => (
                    <GradientEditor
                      key={gradientDef.key}
                      gradientKey={gradientDef.key}
                      label={gradientDef.label}
                      value={currentGradients[gradientDef.key]}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Color Palette Preview */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold hierarchy-primary mb-6">
          Color Palette Preview - {activeMode === 'light' ? 'Light' : 'Dark'} Mode
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {Object.entries(currentColors).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.1, y: -4 }}
              className="aspect-square rounded-lg border border-border relative group cursor-pointer"
              style={{ backgroundColor: value }}
              title={`${key}: ${value}`}
            >
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-mono text-center px-1">
                  {key}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Gradient Preview */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold hierarchy-primary mb-6">
          Gradient Preview - {activeMode === 'light' ? 'Light' : 'Dark'} Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(currentGradients).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02, y: -2 }}
              className="h-20 rounded-lg border border-border relative group cursor-pointer overflow-hidden"
              style={{ background: value }}
              title={`${key}: ${value}`}
            >
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium text-center px-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default ThemeCustomizer;