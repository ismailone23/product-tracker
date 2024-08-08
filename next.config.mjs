/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "firebasestorage.googleapis.com"
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
            },
        ],
        domains: ['firebasestorage.googleapis.com', 'localhost']
    }
};

export default nextConfig;
