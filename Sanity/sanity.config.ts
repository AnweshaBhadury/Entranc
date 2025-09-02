import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Entranc',

  projectId: '1u2ieuhr',
  dataset: 'entranc',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
