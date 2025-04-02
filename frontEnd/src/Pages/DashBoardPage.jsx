import CollectionCard from "../Components/Collection/CollectionCard.jsx";
import { useGetAllCollection } from "../Store/API/Collection.API.js";
import { motion } from "framer-motion";

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
  const { data: collections } = useGetAllCollection();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mt-8 relative min-h-screen text-white overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1
          className="text-center text-4xl sm:text-5xl mt-4 md:mt-6 lg:mt-8  font-semibold uppercase tracking-wide text-gray-900"
        >
          Explore Our New Collections
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center text-lg sm:text-xl text-gray-500 mt-3 mb-8"
        >
          Discover the latest trends in fashion
        </motion.p>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {collections?.map((collection, index) => (
            <motion.div
              key={collection.id || index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl shadow-lg bg-gray-50"
            >
              <CollectionCard collection={collection} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
