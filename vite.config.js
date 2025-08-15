import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import restart from 'vite-plugin-restart'

export default {
    base: '/PinPaws/',
    root: 'src/',
    publicDir: '../public/',
    plugins:
    [
        restart({ restart: [ '../public/**', ] }),

        react(),

        // .js file support as if it was JSX
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id)
            {
                if (!id.match(/src\/.*\.js$/))
                    return null

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
    ],
    server:
    {
        host: true, 
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', 
        emptyOutDir: true, 
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    three: ['@react-three/fiber', '@react-three/drei'],
                    utils: ['@use-gesture/react']
                }
            }
        },
        minify: 'esbuild',
        assetsInlineLimit: 4096, 
        chunkSizeWarningLimit: 1000
    },
}