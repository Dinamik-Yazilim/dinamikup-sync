const collectionName = path.basename(__filename, '.collection.js')
module.exports = function (dbModel) {
	const schema = mongoose.Schema(
		{
			type: { type: String, index: true, enum: ['color', 'pattern', 'size', 'thickness', 'assortment'] },
			name: { type: String, unique: true },
			factor: { type: Number, default: 1 },
			passive: { type: Boolean, default: false, index: true }
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
	model.relations = { barcodes: 'variant1', barcodes: 'variant2', barcodes: 'variant3', barcodes: 'variant4' }
	return model
}
