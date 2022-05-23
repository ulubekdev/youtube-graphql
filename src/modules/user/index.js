import { gql } from 'apollo-server-express'
import path from 'path'
import url from 'url'
import fs from 'fs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const typeDefs = gql`${ fs.readFileSync(path.join(__dirname, 'schema.gql')) }`
const { default: resolvers } = await import('./resolvers.js')

export default {
    typeDefs,
    resolvers
}
