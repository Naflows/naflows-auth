import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server : {
    host: '0.0.0.0',
    port: 8080
  },

  define: {
    'process.env': {
      'DUMMY_API_URL_DEV': "http://localhost:3005",
      'STRIPE_API_PUBLIC_KEY': "pk_test_51S9m2OLiJo83k1CounymnaDfJJnyJfZCthqDbScBLEjoStuBC4cOnE9m4a7rDeSZi36wigl7ME3IA2c5s1Q9ucGm00RhYbrNy6"
    }
  }
})
