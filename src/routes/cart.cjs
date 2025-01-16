// routes/cart.js
const express = require('express');
const router = express.Router();
const { Cart, Product, User } = require('../models'); // Zainportuj modele
const authenticateToken = require('../middleware/authenticateToken'); // Middleware do autoryzacji

// Dodaj produkt do koszyka
router.post('/', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Zakładając, że masz userId w tokenie

  try {
    const existingProductInCart = await Cart.findOne({
      where: { userId, productId },
    });

    if (existingProductInCart) {
      existingProductInCart.quantity += quantity;
      await existingProductInCart.save();
      return res.json(existingProductInCart);
    }

    const newProduct = await Cart.create({
      userId,
      productId,
      quantity,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// Usuwanie produktu z koszyka
router.delete('/:productId', authenticateToken, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
  
    try {
      const cartItem = await Cart.findOne({ where: { userId, productId } });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      await cartItem.destroy();
      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Aktualizacja ilości w koszyku
router.put('/:productId', authenticateToken, async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;
  
    try {
      const cartItem = await Cart.findOne({ where: { userId, productId } });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  