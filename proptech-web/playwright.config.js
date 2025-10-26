module.exports = {
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: 'https://habitatprord.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      },
    }
  ]
}
