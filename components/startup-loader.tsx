// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";

// import SplashScreen from "./CodeLoader";

// interface StartupLoaderProps {
//   minimumDuration?: number;
//   fadeDuration?: number;
//   label?: string;
// }

// export function StartupLoader({
//   minimumDuration = 1200,
//   fadeDuration = 300,
//   label = "Loading",
// }: StartupLoaderProps) {
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setVisible(false);
//     }, minimumDuration);

//     return () => window.clearTimeout(timer);
//   }, [minimumDuration]);

//   return (
//     <AnimatePresence>
//       {visible ? (
//         <motion.div
//           key="startup-loader"
//           className="fixed inset-0 z-50"
//           initial={{ opacity: 1 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: fadeDuration / 1000 }}
//         >
//           <SplashScreen />
//         </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }
