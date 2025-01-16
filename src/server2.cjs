const express = require('express');
const { sequelize, User, Product, Order, Review, Cart } = require('./models/index.cjs');
const dotenv = require('dotenv')
const cors = require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // Parsowanie JSON w requestach

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNjk3MzM2NywiaWF0IjoxNzM2OTczMzY3fQ.Qu4kwb4_4jHyyBJ-fl6RetRd1fet9wRxnj7mAK7j-6E'; // Zmienna środowiskowa na klucz JWT

// Middleware do weryfikacji tokenu JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Rejestracja użytkownika
app.post('/register', async (req, res) => {
    const { username, password } = req.body; // Usuwamy email
  
    try {
      // Sprawdzamy, czy użytkownik o danym username już istnieje
      const existingUser = await User.findOne({ where: { username } }); // Sprawdzamy tylko username
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Haszujemy hasło przed zapisaniem
      //const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tworzymy nowego użytkownika
      const newUser = await User.create({ username, password });
  
      // Zwracamy odpowiedź po pomyślnym stworzeniu użytkownika
      res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
      // W przypadku błędu zwracamy 500 z wiadomością błędu
      res.status(500).json({ error: error.message });
    }
  });
  

// Logowanie użytkownika
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const encrPasswd = await bcrypt.hash(password,10)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password', passwd1: password, passwd2: user.password});
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpointy
// Użytkownicy
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Produkty
app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({ include: 'reviews' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Zamówienia
app.post('/orders', authenticateToken, async (req, res) => {
    const { products, date, status } = req.body;
  
    try {
      const order = await Order.create({
        products, // Przekazujemy produkty jako JSON
        date: date || new Date(),
        status: status || 'pending',
      });
  
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

  app.get('/orders', authenticateToken, async (req, res) => {
    try {
      const orders = await Order.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Recenzje
app.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({ include: ['user', 'product'] });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/cart", authenticateToken, async (req, res) => {
    try {
      const cart = await Cart.findAll({
        where: { UserId: req.user.userId },
      });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  app.post("/cart", authenticateToken, async (req, res) => {
    const { title ,description, price, category, image, quantity } = req.body;
  
    try {
      const existingItem = await Cart.findOne({
        where: { UserId: req.user.userId, title },
      });
  
      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        return res.json(existingItem);
      }
  
      const cartItem = await Cart.create({
        UserId: req.user.userId,
        title,
        description,
        price,
        category,
        image,
        quantity,
      });
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  // Trasa usuwania produktu z koszyka
  app.delete("/cart/:title", authenticateToken, async (req, res) => {
    const title = req.params.title;
    console.log(title)
  
    try {
      // Znajdź element w koszyku na podstawie tytułu i ID użytkownika
      const cartItem = await Cart.findOne({
        where: { UserId: req.user.userId, title },
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Usuń element z koszyka
      await cartItem.destroy();
      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  app.put("/cart/:title", authenticateToken, async (req, res) => {
    const title = req.params.title;
    console.log(title)
    const { quantity } = req.body;
  
    try {
      const cartItem = await Cart.findOne({
        where: { UserId: req.user.userId, title },
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Aktualizujemy ilość tylko jeśli jest większa od 0
      if (quantity > 0) {
        cartItem.quantity = quantity;
        await cartItem.save();
        res.status(200).json(cartItem);
      } else {
        // Jeśli ilość jest 0, usuń produkt z koszyka
        await cartItem.destroy();
        res.status(200).json({ message: "Product removed from cart" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Inicjalizacja serwera
app.listen(PORT, async () => {
  try {
    sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Error syncing database:', error));
    await sequelize.sync({ force: true }); // Reset bazy danych przy starcie
    console.log(`Database synced and server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
});
