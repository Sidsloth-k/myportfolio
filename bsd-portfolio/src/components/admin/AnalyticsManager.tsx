import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, MessageSquare, Download, Calendar, Globe, Smartphone } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';

const AnalyticsManager: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const timeRanges = [
    { id: '7d', label: 'Last 7 days' },
    { id: '30d', label: 'Last 30 days' },
    { id: '90d', label: 'Last 3 months' },
    { id: '365d', label: 'Last year' }
  ];

  const overviewStats = [
    { label: 'Total Views', value: '15,420', change: '+23.5%', icon: Eye, color: 'text-blue-600' },
    { label: 'Unique Visitors', value: '3,247', change: '+18.2%', icon: Users, color: 'text-green-600' },
    { label: 'Project Views', value: '856', change: '+45.1%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Contact Forms', value: '24', change: '+12.3%', icon: MessageSquare, color: 'text-orange-600' }
  ];

  const topPages = [
    { page: 'Home', views: 4820, percentage: 31 },
    { page: 'Projects', views: 3240, percentage: 21 },
    { page: 'Skills', views: 2890, percentage: 19 },
    { page: 'About', views: 2470, percentage: 16 },
    { page: 'Contact', views: 2000, percentage: 13 }
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 68, count: '2,208' },
    { device: 'Mobile', percentage: 28, count: '909' },
    { device: 'Tablet', percentage: 4, count: '130' }
  ];

  const geographyData = [
    { country: 'Japan', visitors: 1240, percentage: 38 },
    { country: 'United States', visitors: 650, percentage: 20 },
    { country: 'South Korea', visitors: 420, percentage: 13 },
    { country: 'Germany', visitors: 320, percentage: 10 },
    { country: 'Others', visitors: 617, percentage: 19 }
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
          Analytics Dashboard
        </motion.h1>
        <p className="hierarchy-secondary">
          Monitor portfolio performance, visitor behavior, and engagement metrics.
        </p>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:anime-shadow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm hierarchy-tertiary mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold hierarchy-primary">{stat.value}</p>
                  <div className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Pages */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold hierarchy-primary mb-6">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <motion.div
                key={page.page}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="hierarchy-primary font-medium">{page.page}</span>
                    <span className="hierarchy-tertiary text-sm">{page.views} views</span>
                  </div>
                  <Progress value={page.percentage} className="h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Device Analytics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold hierarchy-primary mb-6">Device Analytics</h3>
          <div className="space-y-4">
            {deviceStats.map((device, index) => (
              <motion.div
                key={device.device}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {device.device === 'Mobile' ? (
                    <Smartphone className="w-4 h-4 hierarchy-tertiary" />
                  ) : (
                    <Globe className="w-4 h-4 hierarchy-tertiary" />
                  )}
                  <span className="hierarchy-primary">{device.device}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-muted/30 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ delay: 0.2 * index, duration: 1 }}
                      className="h-2 rounded-full bg-primary"
                    />
                  </div>
                  <div className="text-right min-w-[60px]">
                    <div className="hierarchy-primary font-semibold text-sm">{device.percentage}%</div>
                    <div className="hierarchy-tertiary text-xs">{device.count}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Data */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold hierarchy-primary mb-6">Top Countries</h3>
          <div className="space-y-4">
            {geographyData.map((country, index) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <div className="hierarchy-primary font-medium">{country.country}</div>
                  <div className="hierarchy-tertiary text-sm">{country.visitors} visitors</div>
                </div>
                <div className="text-right">
                  <div className="hierarchy-primary font-semibold">{country.percentage}%</div>
                  <div className="w-16 bg-muted rounded-full h-1 mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                      className="h-1 rounded-full bg-accent"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold hierarchy-primary mb-6">Performance Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold hierarchy-primary">4m 32s</div>
              <div className="text-sm hierarchy-tertiary">Avg. Session</div>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold hierarchy-primary">32%</div>
              <div className="text-sm hierarchy-tertiary">Bounce Rate</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="hierarchy-secondary">Page Load Speed</span>
              <span className="hierarchy-primary font-semibold">1.2s</span>
            </div>
            <div className="flex justify-between">
              <span className="hierarchy-secondary">Core Web Vitals</span>
              <span className="text-green-600 font-semibold">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="hierarchy-secondary">SEO Score</span>
              <span className="hierarchy-primary font-semibold">94/100</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default AnalyticsManager;