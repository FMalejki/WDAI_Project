const express = require('express');
const { sequelize, User, Product, Order, Review } = require('./models/index.ts');
const dotenv = require('dotenv')

dotenv.config();
const app = express();
app.use(express.json()); // Parsowanie JSON w requestach

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Zmienna środowiskowa na klucz JWT

// Middleware do weryfikacji tokenu JWT
const authenticateJWT = (req, res, next) => {
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
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, email });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logowanie użytkownika
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
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
app.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body, { include: ['products'] });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: ['products'] });
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

// Inicjalizacja serwera
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: true }); // Reset bazy danych przy starcie
    console.log(`Database synced and server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
});
