import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CanonicalMedia } from '../lib/types';
import { MediaCard } from '../components/MediaCard';

export default function HomePage() {
  const { data: trending, isLoading, error } = useQuery<CanonicalMedia[]>({
    queryKey: ['trending', 'day'],
    queryFn: async () => {
      const response = await api.get('/media/trending?timeWindow=day');
      return response.data.results;
    }
  });

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">SCENIC</h1>
          <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700"></div>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Trending Today</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-zinc-500 font-medium animate-pulse">Loading intelligence...</p>
            </div>
          ) : error ? (
            <div className="bg-red-950/30 text-red-400 p-4 rounded-xl border border-red-900/50">
              Failed to load trending media. Please try again.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {trending?.map((media) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
