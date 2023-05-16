const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const uploadServiceImg = (req, res) => {
  try {
    // Image upload successful, respond with the filename
    res.json({ filename: req.file.filename });
  } catch (error) {
    // Error occurred during upload
    console.error(error);
    res.status(500).json({ error: "Failed to upload image." });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ managerId: req.id }).populate(
      "managerId",
      "name"
    );
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllProductsByShopName = async (req, res) => {
  try {
    const products = await Product.find({
      shopName: req.query.shopName,
    });
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProductImg = (req, res) => {
  const filename = req.params.filename;
  console.log("filename ", filename);
  const filePath = path.resolve("uploads/products", filename);
  console.log("filePath ", filePath);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, async (err) => {
      if (err) {
        // Error occurred while deleting the file
        return res.status(500).json({ error: "Failed to delete the file" });
      }

      try {
        // Delete the productImg property from the Product collection
        const id = req.id;
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: id },
          { productImg: "" },
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({ error: "Product not found" });
        }

        return res.json({
          message: "File deleted successfully",
          product: updatedProduct,
        });
      } catch (err) {
        // Error occurred while updating the database
        return res.status(500).json({ error: "Failed to update the database" });
      }
    });
  });
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  uploadServiceImg,
  getAllProductsByShopName,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductImg,
  deleteProduct,
};
