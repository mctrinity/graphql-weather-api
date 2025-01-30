require('dotenv').config(); // Load environment variables

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');
const { typeDefs, resolvers } = require('./schema/weather');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan'); // ✅ Logging
const compression = require('compression'); // ✅ Optimize production performance

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use('/css', express.static(path.join(__dirname, './css'))); // Serve static CSS
app.use(compression()); // Compress responses for better performance
if (NODE_ENV === 'development') {
  app.use(morgan('dev')); // Log requests in development mode
}

// ✅ Helper function to render HTML pages
const renderPage = (title, contentFile) => {
  try {
    const layout = fs.readFileSync(path.join(__dirname, './pages/layout.html'), 'utf-8');
    const content = fs.readFileSync(path.join(__dirname, `./pages/${contentFile}`), 'utf-8');
    return layout.replace('<%= title %>', title).replace('<%= content %>', content);
  } catch (err) {
    console.error(`❌ Error loading page: ${contentFile}`, err);
    return `<h1>Error Loading Page</h1>`;
  }
};

// ✅ Serve static pages
app.get('/', (req, res) => res.send(renderPage('Landing Page', 'landing.html')));
app.get('/about', (req, res) => res.send(renderPage('About Page', 'about.html')));

// ✅ Apollo Server Config
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: NODE_ENV !== 'production', // Disable in production for security
  playground: NODE_ENV !== 'production', // Disable in production
  csrfPrevention: false,
  persistedQueries: false,
  cache: new InMemoryLRUCache({ maxSize: 50 * 1024 * 1024, ttl: 600000 }),
  formatError: (error) => {
    console.error(`❌ GraphQL Error:`, error);
    return error;
  },
});

// ✅ Start Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}/graphql`);
    console.log(`🌐 Landing page: http://localhost:${PORT}/`);
    console.log(`ℹ️ About page: http://localhost:${PORT}/about`);
    console.log(`🔧 Mode: ${NODE_ENV}`);
  });
}

startServer().catch((err) => console.error("❌ Apollo Server Error:", err));
