import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import ExplosionCanvas from "./modules/AnimatedBackground/ComponentCanvas";
import { ParticleBackground } from "./modules/ParticlesBackground";

export const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<article className="flex min-h-screen  flex-col items-center justify-center py-2">
				<Outlet />
				<ExplosionCanvas />
				<ParticleBackground />
			</article>
		</QueryClientProvider>
	);
}

export default App;
