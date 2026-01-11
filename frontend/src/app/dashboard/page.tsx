'use client'

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { apiCall } from "@/lib/api";
import { Video, Loader2, Sparkles, Plus, History, Clock, AlertTriangle, Play } from "lucide-react";

type Project = {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  video_url?: string;
  error?: string;
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
      fetchProjects();
      startPolling();
    }
    return () => stopPolling();
  }, [isLoaded, user]);

  const startPolling = () => {
    stopPolling();
    // Poll every 3 seconds for faster feedback, but stop after 5 minutes of inactivity if needed
    pollingRef.current = setInterval(fetchProjects, 3000); // 3s interval
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await apiCall('/api/users/me');
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await apiCall('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        
        // Stop polling if nothing is pending/processing to save resources
        const hasActiveJobs = data.some((p: Project) => 
          p.status === 'pending' || p.status === 'processing'
        );
        
        if (!hasActiveJobs && pollingRef.current) {
          console.log("All jobs finished. Stopping polling.");
          stopPolling();
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await apiCall('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      if (response.ok) {
        setPrompt("");
        await fetchProjects();
        startPolling(); // Ensure polling is active
      } else {
        console.error("Generation failed to start");
      }
    } catch (error) {
      console.error('Error starting generation:', error);
    }
    setIsGenerating(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">M</span>
            </div>
            <span className="hidden sm:inline">ManimGen</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{user?.fullName}</span>
              <span className="text-xs text-gray-400 capitalize">{userData?.user_data?.role || 'Creator'}</span>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border border-white/10"
                }
              }}
              afterSignOutUrl="/"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        
        {/* Creation Section */}
        <section className="max-w-4xl mx-auto mb-20 relative z-10">
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 tracking-tight">
              Create Math Magic
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto font-light">
              Describe any concept. We'll generate a narrated animation instantly.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="relative group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex gap-2 bg-black/90 p-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Visualize the area of a circle using sectors..."
                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 px-6 py-4 text-lg font-light tracking-wide outline-none min-w-0"
                disabled={isGenerating}
              />
              <button 
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-8 py-3 bg-white text-black hover:bg-gray-100 font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 fill-current" />}
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </form>
        </section>

        {/* Dashboard Grid */}
        <div className="flex flex-col gap-8">
          
          {/* Recent Projects */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2 tracking-tight">
                <History className="w-5 h-5 text-gray-400" />
                Your Creations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.status !== 'failed').length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed backdrop-blur-sm">
                  <p className="text-lg">No projects yet.</p>
                  <p className="text-sm text-gray-600">Enter a prompt above to create your first math video!</p>
                </div>
              )}

              {projects
                .filter(project => project.status !== 'failed')
                .map((project) => (
                <div key={project.id} className="group relative aspect-video bg-gray-900 rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-2xl shadow-black/50">
                  {/* Status Overlay */}
                  
                  {project.status === 'completed' && project.video_url ? (
                    <video 
                      src={project.video_url} 
                      controls 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/50 backdrop-blur-sm gap-4 p-6 text-center z-10">
                       {project.status === 'pending' || project.status === 'processing' ? (
                          <>
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                              <Loader2 className="w-10 h-10 animate-spin text-blue-400 relative z-10" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-base font-medium text-white/90">
                                {project.status === 'processing' ? 'Animating...' : 'Queued'}
                              </p>
                              <p className="text-xs text-white/40 font-mono uppercase tracking-widest">
                                {project.status === 'processing' ? 'Generating Scenes' : 'Waiting for worker'}
                              </p>
                            </div>
                          </>
                       ) : (
                          <div className="w-full h-full bg-gray-800 animate-pulse" />
                       )}
                    </div>
                  )}

                  {/* Info Overlay (Visible on Hover or while processing) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100 transition-opacity duration-300 pointer-events-none">
                    <h3 className="font-medium truncate text-white drop-shadow-lg pr-8">{project.prompt}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                        <Clock className="w-3 h-3" />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      {project.status === 'completed' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
