const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
  const schema = mongoose.Schema(
    {
      name: { type: String, unique: true },
      mainApp: { type: String, default: 'mikro16', enum: ['mikro16', 'mikro17', 'mikro16_workdata', 'mikro17_workdata'] },
      connector: {
        clientId: { type: String, default: '', index: true },
        clientPass: { type: String, default: '', index: true },
        connectionType: { type: String, enum: ['mssql', 'mysql', 'pg', 'fs', 'excel', 'rest'], default: 'mssql', index: true },
        mssql: {
          server: { type: String, default: '' },
          port: { type: Number, default: 1433 },
          user: { type: String, default: 'sa' },
          password: { type: String, default: '' },
          database: { type: String, default: '' },
          dialect: { type: String, default: 'mssql' },
          dialectOptions: {
            instanceName: { type: String, default: 'SQLExpress' }
          },
          options: {
            // 'encrypt': { type: Boolean, default: false },
            trustServerCertificate: { type: Boolean, default: true },
          },
        },
        // mysql: {
        //   host: { type: String, default: '' },
        //   port: { type: Number, default: 1433 },
        //   user: { type: String, default: 'sa' },
        //   password: { type: String, default: '' },
        //   database: { type: String, default: '' },
        // },
        // pg: {
        //   host: { type: String, default: '' },
        //   port: { type: Number, default: 1433 },
        //   user: { type: String, default: 'sa' },
        //   password: { type: String, default: '' },
        //   database: { type: String, default: '' },
        // },
        // fs: {
        //   filePath: { type: String, default: '' },
        //   encoding: { type: String, default: 'base64' },
        // },
        // excel: {
        //   filePath: { type: String, default: '' },
        // }
      },
      passive: { type: Boolean, default: false, index: true }
    },
    { versionKey: false, timestamps: true }
  )

  schema.pre('save', async function (next) {
    const doc = this
    doc.fullName = (doc.firstName || '') + ' ' + (doc.lastName || '')
    next()
  })
  schema.pre('remove', (next) => next())
  schema.pre('remove', true, (next, done) => next())
  schema.on('init', (model) => { })
  schema.plugin(mongoosePaginate)

  let model = dbModel.conn.model(collectionName, schema, collectionName)

  model.removeOne = (member, filter) => sendToTrash(dbModel, collectionName, member, filter)
  return model
}
