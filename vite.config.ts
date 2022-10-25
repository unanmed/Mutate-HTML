import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        legacy({ targets: ['defaults', 'not IE 11'] }),
        Components({
            resolvers: [AntDesignVueResolver()]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    antdv: ['ant-design-vue', '@ant-design/icons-vue']
                }
            }
        }
    },
    base: 'Mutate'
});
