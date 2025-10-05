"use client";

import DashboardHeader from "./dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, FileText, Search, TrendingUp, ArrowRight, BookOpen, Zap, ExternalLink } from "lucide-react";
import ResearcherQuery from "@/components/query/researcher-query";

interface ResearcherDashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "Learner" | "Researcher" | null;
  };
}

export default function ResearcherDashboard({
  user,
}: ResearcherDashboardProps) {
  return (
    <>
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section with Quick Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2 flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Welcome back, {user?.name || "Researcher"}!
              </h1>
              <p className="text-lg text-gray-300">
                Access comprehensive space biology data and publications from NASA's Open Science Data System
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-blue-500/30">
                <Zap className="w-4 h-4" />
                New Query
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm font-medium backdrop-blur-sm">
                <BookOpen className="w-4 h-4" />
                Tutorial
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Publications",
                value: "2,847",
                description: "Total in database",
                icon: FileText,
                color: "text-blue-400",
                trend: "+12% this month",
                bgGradient: "from-blue-500/10 to-blue-600/5"
              },
              {
                title: "Experiments",
                value: "1,523",
                description: "Documented studies",
                icon: Database,
                color: "text-emerald-400",
                trend: "89 active",
                bgGradient: "from-emerald-500/10 to-emerald-600/5"
              },
              {
                title: "Recent Additions",
                value: "43",
                description: "Published this year",
                icon: TrendingUp,
                color: "text-amber-400",
                trend: "2024 publications",
                bgGradient: "from-amber-500/10 to-amber-600/5"
              },
              {
                title: "Organisms",
                value: "89",
                description: "Species studied",
                icon: Search,
                color: "text-purple-400",
                trend: "12 new species",
                bgGradient: "from-purple-500/10 to-purple-600/5"
              },
            ].map((stat, index) => (
              <Card 
                key={index}
                className={`bg-gradient-to-br ${stat.bgGradient} border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 cursor-pointer group hover:scale-105`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                  <p className="text-xs text-emerald-400 font-medium">{stat.trend}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Query Interface - Prominent Placement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Bio-Data Synthesizer</h2>
            </div>
            <Card className="bg-gradient-to-br from-blue-900/10 to-cyan-700/5 border border-cyan-500/20 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  Query Interface
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Build structured queries to extract and analyze space biology research data
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResearcherQuery />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Publications Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Publications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Recent Publications
                </h3>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors">
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  {
                    title: "Microgravity Effects on Arabidopsis Root Growth Patterns",
                    experiment: "ISS-APEX-07",
                    year: 2024,
                    system: "Plant",
                    status: "Published",
                    reads: "1.2k",
                    statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  },
                  {
                    title: "Bone Density Loss Mitigation Through Exercise Protocols",
                    experiment: "HRP-47134",
                    year: 2024,
                    system: "Human",
                    status: "Published",
                    reads: "2.4k",
                    statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  },
                  {
                    title: "Bacterial Biofilm Formation in Simulated Martian Conditions",
                    experiment: "MARS-BIO-23",
                    year: 2023,
                    system: "Microbial",
                    status: "Peer Review",
                    reads: "856",
                    statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  },
                ].map((pub, i) => (
                  <Card 
                    key={i}
                    className="bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group hover:bg-white/10"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-sm leading-relaxed text-white group-hover:text-cyan-300 transition-colors">
                            {pub.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/5">
                              {pub.experiment}
                            </span>
                            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
                              {pub.system}
                            </span>
                            <span className="text-gray-400">{pub.year}</span>
                            <span className={`px-2 py-1 rounded border ${pub.statusColor} text-xs`}>
                              {pub.status}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{pub.reads} reads</span>
                        <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Access & Tools */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 text-amber-400" />
                Quick Access
              </h3>
              
              <div className="grid gap-3">
                {[
                  {
                    title: "Data Visualization Tools",
                    description: "Interactive charts and graphs",
                    icon: TrendingUp,
                    action: "Explore",
                    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  },
                  {
                    title: "Advanced Search",
                    description: "Filter by organism, experiment type",
                    icon: Search,
                    action: "Search",
                    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  },
                  {
                    title: "API Documentation",
                    description: "Integration guides and examples",
                    icon: Database,
                    action: "View Docs",
                    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                  },
                  {
                    title: "Research Methodology",
                    description: "Experimental protocols and standards",
                    icon: BookOpen,
                    action: "Learn",
                    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  },
                ].map((tool, i) => (
                  <Card 
                    key={i}
                    className="bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 cursor-pointer group hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className={`p-2 rounded-lg border ${tool.color}`}>
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-white group-hover:text-cyan-300 transition-colors">
                          {tool.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {tool.description}
                        </p>
                      </div>
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                        {tool.action}
                      </button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* System Status */}
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-green-500/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <h4 className="font-medium text-sm text-white">All Systems Operational</h4>
                      <p className="text-xs text-gray-400">NASA OSD connected & synced</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}