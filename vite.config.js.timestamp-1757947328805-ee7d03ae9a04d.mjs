// vite.config.js
import path from "path";
import checker from "file:///E:/Abhishek/superadmin-ui/node_modules/vite-plugin-checker/dist/esm/main.js";
import { defineConfig } from "file:///E:/Abhishek/superadmin-ui/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Abhishek/superadmin-ui/node_modules/@vitejs/plugin-react-swc/index.mjs";
var PORT = 3030;
var vite_config_default = defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ["error"] }
      },
      overlay: {
        position: "tl",
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxBYmhpc2hla1xcXFxzdXBlcmFkbWluLXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxBYmhpc2hla1xcXFxzdXBlcmFkbWluLXVpXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9BYmhpc2hlay9zdXBlcmFkbWluLXVpL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5jb25zdCBQT1JUID0gMzAzMDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIGNoZWNrZXIoe1xyXG4gICAgICBlc2xpbnQ6IHtcclxuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCInLFxyXG4gICAgICAgIGRldjogeyBsb2dMZXZlbDogWydlcnJvciddIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG92ZXJsYXk6IHtcclxuICAgICAgICBwb3NpdGlvbjogJ3RsJyxcclxuICAgICAgICBpbml0aWFsSXNPcGVuOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogL15zcmMoLispLyxcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHsgcG9ydDogUE9SVCwgaG9zdDogdHJ1ZSB9LFxyXG4gIHByZXZpZXc6IHsgcG9ydDogUE9SVCwgaG9zdDogdHJ1ZSB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUSxPQUFPLFVBQVU7QUFDcFIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUlsQixJQUFNLE9BQU87QUFFYixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsUUFDYixLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUFBLE1BQzdCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsaUJBQWlCO0FBQUEsTUFDekQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUSxFQUFFLE1BQU0sTUFBTSxNQUFNLEtBQUs7QUFBQSxFQUNqQyxTQUFTLEVBQUUsTUFBTSxNQUFNLE1BQU0sS0FBSztBQUNwQyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
