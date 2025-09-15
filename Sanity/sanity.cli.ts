import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId:process.env.SANITY_STUDIO_PROJECT_ID,
    dataset:process.env.SANITY_STUDIO_DATASET
  },
  studioHost: 'entranc',  // <= this line stops the prompt
  autoUpdates: true,         // CLI will keep your studio dependencies updated
})
