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
      ]
    },
  }