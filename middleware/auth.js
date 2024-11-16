// middleware/auth.js
// import { useAuthStore } from '@pinia/nuxt'  // Remove this line

// Update your middleware to include store setup
export default defineNuxtRouteMiddleware(async (to) => {
    if (process.client) {  // Add this check for client-side execution
        const token = localStorage.getItem('adminToken');
        
        // If there's no token and trying to access protected route
        if (!token && to.path !== '/') {
            return navigateTo('/');
        }

        // If has token and trying to access login page
        if (token && to.path === '/') {
            return navigateTo('/dashboard');
        }
    }
});