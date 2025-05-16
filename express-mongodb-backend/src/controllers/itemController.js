class ItemController {
    constructor(ItemModel) {
        this.ItemModel = ItemModel;
    }

    async createItem(req, res) {
        try {
            const newItem = new this.ItemModel(req.body);
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getItem(req, res) {
        try {
            const item = await this.ItemModel.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteItem(req, res) {
        try {
            const deletedItem = await this.ItemModel.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ItemController;