import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import deskStructure from './desk/structure'
import schemas from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Sandes',

  projectId: '89ztrc1x',
  dataset: 'production',

  plugins: [structureTool({structure: deskStructure}), visionTool()],

  schema: {
    types: schemas,
  },
})
