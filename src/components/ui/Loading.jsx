import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-1 h-6 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-5 h-5 bg-gray-200 rounded border animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded-full w-12 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;