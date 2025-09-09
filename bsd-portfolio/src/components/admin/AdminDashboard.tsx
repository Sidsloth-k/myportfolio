import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Image, 
  Code,
  Star,
  Clock,
  Activity,
  Globe,
  Smartphone
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalViews: 15420,
    uniqueVisitors: 3247,
    projectClicks: 856,
    contactForms: 24,
    avgSessionTime: '4m 32s',
    bounceRate: '32%'
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'view', message: 'New visitor from Tokyo, Japan', time: '2 minutes ago', icon: Eye },
    { id: 2, type: 'contact', message: 'Contact form submitted', time: '15 minutes ago', icon: MessageSquare },
    { id: 3, type: 'project', message: 'Project "Detective System" viewed', time: '1 hour ago', icon: Code },
    { id: 4, type: 'view', message: 'Skills section popular today', time: '2 hours ago', icon: TrendingUp },
    { id: 5, type: 'view', message: 'New visitor from Seoul, Korea', time: '3 hours ago', icon: Globe }
  ]);

  const quickStats = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      change: '+23.5%',
      icon: Eye,
      color: 'blue',
      trending: 'up'
    },
    {
      title: 'Unique Visitors',
      value: stats.uniqueVisitors.toLocaleString(),
      change: '+18.2%',
      icon: Users,
      color: 'green',
      trending: 'up'
    },
    {
      title: 'Project Views',
      value: stats.projectClicks.toLocaleString(),
      change: '+45.1%',
      icon: Code,
      color: 'purple',
      trending: 'up'
    },
    {
      title: 'Contact Forms',
      value: stats.contactForms.toLocaleString(),
      change: '+12.3%',
      icon: MessageSquare,
      color: 'orange',
      trending: 'up'
    }
  ];

  const contentStats = [
    { label: 'Published Projects', value: 7, total: 10, icon: Code },
    { label: 'Media Files', value: 45, total: 50, icon: Image },
    { label: 'Pages', value: 5, total: 5, icon: FileText },
    { label: 'Reviews', value: 12, total: 15, icon: Star }
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 68, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 28, color: 'bg-green-500' },
    { device: 'Tablet', percentage: 4, color: 'bg-purple-500' }
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
          className="text-3xl font-bold text-foreground mb-2"
        >
          Dashboard Overview
        </motion.h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:anime-shadow transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className={`text-sm ${
                    stat.trending === 'up' ? 'text-green-600' : 'text-red-600'
                  } flex items-center mt-1`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <activity.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Content Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Content Status</h3>
            
            <div className="space-y-4">
              {contentStats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      {item.value}/{item.total}
                    </div>
                    <Progress 
                      value={(item.value / item.total) * 100} 
                      className="w-16 h-2 mt-1"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Performance Metrics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-foreground">{stats.avgSessionTime}</div>
                <div className="text-sm text-muted-foreground">Avg. Session</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-foreground">{stats.bounceRate}</div>
                <div className="text-sm text-muted-foreground">Bounce Rate</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Device Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Device Analytics</h3>
            
            <div className="space-y-4">
              {deviceStats.map((device, index) => (
                <motion.div
                  key={device.device}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: '100%' }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {device.device === 'Mobile' ? (
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-foreground">{device.device}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-muted/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${device.percentage}%` }}
                        transition={{ delay: 0.2 * index, duration: 1 }}
                        className={`h-2 rounded-full ${device.color}`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-8">
                      {device.percentage}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">New Post</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Image className="w-5 h-5" />
              <span className="text-sm">Upload Media</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <Code className="w-5 h-5" />
              <span className="text-sm">Add Project</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex-col space-y-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;