module.exports = {
    async headers() {
      return [
        {
          source: '/api/serviceValidate',
          headers: [
            {
              key: 'Content-Type',
              value: 'text/xml',
            }
          ],
        },
        {
            source: '/api/proxyValidate',
            headers: [
              {
                key: 'Content-Type',
                value: 'text/xml',
              }
            ],
          },
      ]
    },
    async rewrites() {
        return [
          {
            source: '/api/proxyValidate',
            destination: '/api/serviceValidate',
          },
        ]
      },
  }