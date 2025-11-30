import { motion } from 'framer-motion';
import { Button } from '@base-ui-components/react';

interface SidebarProps {
  handleClick: (id: boolean) => void
}

const Sidebar = ({
  handleClick
}: SidebarProps) => {
	return(
		<>
			<motion.aside
				className="fixed top-0 bottom-0 left-0 bg-white dark:bg-zinc-900 z-20 w-full max-w-sm py-4 px-4 lg:px-6 shadow-xl text-zinc-950 dark:text-white"
				initial={{ opacity: 0, translateX: '-400px' }}
				animate={{ opacity: 1, translateX: 0 }}
				exit={{ opacity: 0, translateX: '-400px' }}
				transition={{ duration: 0.24 }}
			>
				<div className="flex w-full justify-between items-center">
					<h4 className="text-xl">About</h4>
					<Button
						className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-950 rounded-full p-1 border border-zinc-200 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white"
						onClick={() => handleClick(false)}
					>
						<span className="font-medium">Close</span>
					</Button>
				</div>
				<div className="leading-6 text-base mt-4">
					<p className="mb-4">Hey 👋, I’m <a href="https://ryanparag.com" target="_blank" className="transition underline underline-offset-2 text-primary hover:bg-primary/10 rounded hover:no-underline hover:ring-4 ring-primary/10">Ryan Parag</a>, a product designer based in Tampa, FL. I wanted to make a stupidly-simple way to track timezones on my browser.</p>
					<p>I'm always making small updates to this app, but feel free to poke around the&nbsp;
					<a href="https://github.com/ryan-parag/timezones.ryanparag.com" target="_blank" className="transition underline underline-offset-2 text-primary hover:bg-primary/10 rounded hover:no-underline hover:ring-4 ring-primary/10">GitHub Repository</a> if you have feedback or would like to help. Typography set in <a href="https://pangrampangram.com/products/neue-corp" target="_blank" className="transition underline underline-offset-2 text-primary hover:bg-primary/10 rounded hover:no-underline hover:ring-4 ring-primary/10">PP Neue Corp</a>.</p>
				</div>
				
			</motion.aside>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.24, delay: 0.1 }}
				className="fixed z-10 backdrop-blur-sm top-0 bottom-0 left-0 right-0 bg-zinc-950/30 dark:bg-white/30 cursor-pointer"
				onClick={() => handleClick(false)}
			/>
		</>
	)
}

	export default Sidebar;