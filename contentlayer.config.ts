import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Guide = defineDocumentType(() => ({
  name: 'Guide',
  filePathPattern: 'guides/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Guide],
}) 