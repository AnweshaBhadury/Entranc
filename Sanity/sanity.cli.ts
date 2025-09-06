import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'kn8ctvrb',   // your client’s project ID
    dataset: 'production'    // dataset you’ll work with
  },
  autoUpdates: true,         // CLI will keep your studio dependencies updated
})
