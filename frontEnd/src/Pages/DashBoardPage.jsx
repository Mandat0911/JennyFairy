import { CategoryItem } from "../Components/CategoryItem.jsx";
import {categories} from "../Utils/Category.js";
import {motion} from "framer-motion";

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
	  opacity: 1,
	  y: 0,
	  transition: { staggerChildren: 0.2, ease: "easeOut", duration: 0.6 },
	},
  };
  
  const itemVariants = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

const DashboardPage = () => {
	return (
		<motion.div 
		  initial="hidden" 
		  animate="visible" 
		  variants={containerVariants} 
		  className="mt-4 relative min-h-screen text-white overflow-hidden"
		>
		  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
			<motion.h1 
			  initial={{ opacity: 0, y: -20 }} 
			  animate={{ opacity: 1, y: 0 }} 
			  transition={{ duration: 0.8, ease: "easeOut" }} 
			  className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4"
			>
			  Explore Our New Collections
			</motion.h1>
	  
			<motion.p 
			  initial={{ opacity: 0 }} 
			  animate={{ opacity: 1 }} 
			  transition={{ duration: 1, ease: "easeOut" }} 
			  className="text-center text-xl text-white mb-5"
			>
			  Discover the latest trends
			</motion.p>
	  
			<motion.div 
			  variants={containerVariants} 
			  initial="hidden" 
			  animate="visible" 
			  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
			>
			  {categories.map((category) => (
				<motion.div key={category.name} variants={itemVariants}>
				  <CategoryItem category={category} />
				</motion.div>
			  ))}
			</motion.div>
		  </div>
		</motion.div>
	  );
};
export default DashboardPage;