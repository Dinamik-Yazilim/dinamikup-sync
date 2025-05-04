const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	const schema = mongoose.Schema(
		{
			item: { type: ObjectId, ref: 'items', index: true },
			barcode: { type: String, unique: true },
			factor: { type: Number, default: 1 },
			variant1: { type: ObjectId, ref: 'variants', default: null, index: true },
			variant2: { type: ObjectId, ref: 'variants', default: null, index: true },
			variant3: { type: ObjectId, ref: 'variants', default: null, index: true },
			variant4: { type: ObjectId, ref: 'variants', default: null, index: true },
		},
		{ versionKey: false, timestamps: true }
	)

	schema.pre('save', (next) => next())
	schema.pre('remove', (next) => next())
	schema.pre('remove', true, (next, done) => next())
	schema.on('init', (model) => { })
	schema.plugin(mongoosePaginate)

	let model = dbModel.conn.model(collectionName, schema, collectionName)

	model.removeOne = (session, filter) => sendToTrash(dbModel, collectionName, session, filter)
	// model.relations = { items: 'brand' }
	return model
}
