import 'src/global.css';

// // ----------------------------------------------------------------------
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'sonner';
// import IPInfo from 'ip-info-react';
import { Router } from 'src/routes/sections';

// import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

// import { ThemeProvider } from 'src/theme/theme-provider';

// import { ProgressBar } from 'src/components/progress-bar';
// import { MotionLazy } from 'src/components/animate/motion-lazy';
// import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

// import { AuthProvider } from 'src/auth/context/jwt';
// import { I18nProvider, LocalizationProvider } from './locales';

// // ----------------------------------------------------------------------

// // Create a client with better error handling for iOS
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 2,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// // Safe IPInfo wrapper for iOS compatibility
// function SafeIPInfo({ children }) {
//   try {
//     return <IPInfo>{children}</IPInfo>;
//   } catch (error) {
//     console.warn('IPInfo failed to load, continuing without it:', error);
//     return <>{children}</>;
//   }
// }

// export default function App() {
//   useScrollToTop();

//   // Debug logging for iOS
//   if (typeof window !== 'undefined') {
//     console.log('[App] Rendering App component');
//     console.log('[App] User Agent:', navigator.userAgent);
//     console.log('[App] Is iOS:', /iPad|iPhone|iPod/.test(navigator.userAgent));
//   }

//   return (
//     <QueryClientProvider client={queryClient}>
//       <SafeIPInfo>
//         <Toaster position="top-right" />
//         <I18nProvider>
//           <LocalizationProvider>
//             <AuthProvider>
//               <SettingsProvider settings={defaultSettings}>
//                 <ThemeProvider>
//                   <MotionLazy>
//                     <ProgressBar />
//                     <SettingsDrawer />
//                     <Router />
//                   </MotionLazy>
//                 </ThemeProvider>
//               </SettingsProvider>
//             </AuthProvider>
//           </LocalizationProvider>
//         </I18nProvider>
//       </SafeIPInfo>
//     </QueryClientProvider>
//   );
// }

export default function App() {
  return <Router />;
}