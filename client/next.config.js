/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns:[
      {
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  },
  async headers(){
    return [
      {
        source: '/api/music/:id',
        headers: [
          {
            key: 'x-hello',
            value: 'there',
          },
        ],
      },
    ];
  },
  async rewrites(){
    return [
      {
        source: '/api/music/data/:id',
        destination: 'http://localhost:3000/api/music/info/:id?api_key='+process.env.SERVER_API_KEY,
      },
      {
        source: '/api/music/artwork/:id',
        destination: 'http://localhost:3000/api/music/artwork/:id?api_key='+process.env.SERVER_API_KEY,
      },
      {
        source: '/api/music/:id',
        destination: process.env.SERVER_URL+'/api/music/:id?api_key='+process.env.SERVER_API_KEY,
      },
    ];
  },
  
}

module.exports = nextConfig
