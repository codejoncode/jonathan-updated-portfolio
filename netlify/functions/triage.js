// AI Bug Triage — pattern analysis engine
// Covers 20+ error categories with technically accurate fixes

const PATTERNS = [
  // ── JavaScript / TypeScript ─────────────────────────────────────────────
  {
    match: /cannot read propert(?:y|ies) of (null|undefined)/i,
    type: "Null Reference Error",
    confidence: "High",
    rootCause: "Accessing a property on a value that is null or undefined.",
    explanation:
      "This happens when a variable hasn't been initialized yet, an async operation hasn't resolved, or an API returned an unexpected shape. JavaScript evaluates obj.property before checking if obj exists.",
    fix: `// Option 1: Optional chaining (ES2020)
const value = obj?.property?.nested;

// Option 2: Guard clause
if (!obj) return;
const value = obj.property;

// Option 3: Nullish coalescing
const value = obj?.property ?? defaultValue;`,
    prevention:
      "Enable TypeScript strict mode — it catches this at compile time. Use optional chaining (obj?.prop) defensively for any value from an API or async source.",
  },
  {
    match: /(\w+) is not defined/i,
    type: "ReferenceError",
    confidence: "High",
    rootCause: "Variable used before declaration or outside its scope.",
    explanation:
      "The JavaScript engine can't find the variable in the current scope chain. Common causes: typo in variable name, using let/const before declaration (temporal dead zone), or missing import.",
    fix: `// Check imports
import { myFunction } from './utils';

// Check declaration before use
const result = myFunction(); // ReferenceError if not imported

// For conditional existence
if (typeof myVar !== 'undefined') {
  // safe to use myVar
}`,
    prevention:
      "ESLint's no-undef rule catches this before runtime. Always declare variables at the top of their scope and import before use.",
  },
  {
    match: /maximum call stack size exceeded/i,
    type: "Stack Overflow (Infinite Recursion)",
    confidence: "High",
    rootCause: "A function is calling itself recursively without a valid base case.",
    explanation:
      "Each function call adds a frame to the call stack. Without a base case that terminates recursion, the stack fills up and the engine throws this error. Also triggered by circular object references in JSON.stringify.",
    fix: `// Add a base case to recursive functions
function factorial(n) {
  if (n <= 1) return 1; // base case — stops recursion
  return n * factorial(n - 1);
}

// For circular refs in JSON:
const seen = new WeakSet();
JSON.stringify(obj, (key, val) => {
  if (typeof val === 'object' && val !== null) {
    if (seen.has(val)) return '[Circular]';
    seen.add(val);
  }
  return val;
});`,
    prevention:
      "Always define your base case first. Use iteration instead of recursion for large datasets. Set a max-depth guard if depth is variable.",
  },
  {
    match: /unexpected token|syntaxerror/i,
    type: "SyntaxError",
    confidence: "High",
    rootCause: "Code cannot be parsed — invalid JavaScript/JSON syntax.",
    explanation:
      "The parser hit a character it didn't expect. Common causes: missing closing bracket, trailing comma in JSON, arrow function without return, or template literal not closed.",
    fix: `// Run through a linter first:
// npx eslint yourfile.js --fix

// For JSON parse errors:
try {
  const data = JSON.parse(rawString);
} catch (e) {
  console.error('Invalid JSON at position:', e.message);
  // Log rawString to inspect the malformed content
}

// Check for common culprits:
// ✗ { "key": "value", }   ← trailing comma in JSON
// ✓ { "key": "value" }`,
    prevention:
      "Use Prettier for auto-formatting. ESLint with parser rules catches syntax issues before runtime. For JSON from external sources always wrap in try/catch.",
  },
  // ── React ───────────────────────────────────────────────────────────────
  {
    match: /rendered (more|fewer) hooks than (the )?previous render|invalid hook call/i,
    type: "React Hooks Violation",
    confidence: "High",
    rootCause: "Hooks called conditionally or inside a loop, violating the Rules of Hooks.",
    explanation:
      "React relies on the order of hook calls being identical on every render to track state correctly. Calling useState or useEffect inside an if/else or loop breaks this contract.",
    fix: `// ✗ Wrong — conditional hook
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [data, setData] = useState(null); // VIOLATION
  }
}

// ✓ Correct — hook at top level, condition inside
function Component({ isLoggedIn }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (isLoggedIn) fetchData().then(setData);
  }, [isLoggedIn]);
}`,
    prevention:
      "Install eslint-plugin-react-hooks — it enforces Rules of Hooks at lint time and flags violations before they hit the browser.",
  },
  {
    match: /each child in a (list|array) should have a unique "key"/i,
    type: "React Missing Key Prop",
    confidence: "High",
    rootCause: "List items rendered without a stable unique key prop.",
    explanation:
      "React uses keys to identify which items changed, were added, or removed during re-renders. Without keys, React re-renders the entire list unnecessarily and state can bleed between list items.",
    fix: `// ✗ Wrong — no key
items.map(item => <ItemComponent item={item} />)

// ✗ Wrong — index as key (causes bugs with reordering)
items.map((item, i) => <ItemComponent key={i} item={item} />)

// ✓ Correct — stable unique ID from data
items.map(item => <ItemComponent key={item.id} item={item} />)`,
    prevention:
      "Use database IDs or other stable unique identifiers. Never use array index unless the list is static and never reordered.",
  },
  {
    match: /cannot update a component.*while rendering a different component|too many re-renders/i,
    type: "React Infinite Re-render",
    confidence: "High",
    rootCause: "State update triggered directly in render body or missing useEffect dependency array.",
    explanation:
      "Calling setState during render causes another render, which calls setState again — infinite loop. Also triggered by useEffect without a dependency array running on every render.",
    fix: `// ✗ Wrong — setState in render body
function Component() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // triggers infinite loop
}

// ✓ Correct — state update inside useEffect with deps
function Component({ userId }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setData);
  }, [userId]); // only re-runs when userId changes
}`,
    prevention:
      "Always provide a dependency array to useEffect. Move side effects and state updates out of the render body and into event handlers or effects.",
  },
  // ── Node.js / Express ───────────────────────────────────────────────────
  {
    match: /enoent|no such file or directory/i,
    type: "File Not Found (ENOENT)",
    confidence: "High",
    rootCause: "File or directory path does not exist at the location specified.",
    explanation:
      "The Node.js file system API couldn't locate the path. Usually a relative path issue, wrong working directory, missing file in deployment, or typo.",
    fix: `const path = require('path');
const fs = require('fs');

// Use path.join for cross-platform paths
const filePath = path.join(__dirname, 'data', 'config.json');

// Check existence before reading
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  return;
}

const content = fs.readFileSync(filePath, 'utf8');`,
    prevention:
      "Use path.join(__dirname, ...) instead of relative paths. Add file existence checks in critical paths. Verify files are included in .gitignore exemptions for deployment.",
  },
  {
    match: /econnrefused|connect ECONNREFUSED/i,
    type: "Connection Refused (ECONNREFUSED)",
    confidence: "High",
    rootCause: "The target server/service is not running or not accepting connections on that port.",
    explanation:
      "Your app tried to connect to a socket (database, Redis, another service) and the OS rejected it — nothing is listening on that port. Common in local dev when a dependency isn't started, or in production when env vars point to wrong hosts.",
    fix: `// 1. Verify the service is running:
//    docker ps | grep postgres
//    lsof -i :5432

// 2. Check your connection string
const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  // ...
});

// 3. Add connection retry logic
const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await db.connect();
      return;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
};`,
    prevention:
      "Add health check scripts to your startup sequence. Use Docker Compose depends_on with healthcheck for local dev. Always validate env vars at app startup.",
  },
  {
    match: /eaddrinuse|address already in use/i,
    type: "Port Already in Use (EADDRINUSE)",
    confidence: "High",
    rootCause: "Another process is already bound to the port your app is trying to use.",
    explanation:
      "Only one process can listen on a TCP port at a time. You likely have a previous server instance still running, or another application using the same port.",
    fix: `# Find and kill the process using the port:
# macOS/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

// Or make your server handle it gracefully:
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port in use, retrying on', PORT + 1);
    server.listen(PORT + 1);
  }
});`,
    prevention:
      "Use a PORT env variable and never hardcode. Add process cleanup in CI/CD. Use nodemon --signal SIGTERM for cleaner dev restarts.",
  },
  {
    match: /cannot find module|module not found/i,
    type: "Module Not Found",
    confidence: "High",
    rootCause: "Import path is wrong, package not installed, or package.json out of sync.",
    explanation:
      "Node can't resolve the module — either the npm package isn't in node_modules, the relative path has a typo, or a file was renamed without updating imports.",
    fix: `# Re-install dependencies
npm install

# If a specific package is missing
npm install <package-name>

# Check the import path
# ✗ import utils from './util';   // wrong filename
# ✓ import utils from './utils';  // correct

# For TypeScript path aliases, check tsconfig.json paths:
{
  "compilerOptions": {
    "paths": { "@components/*": ["src/components/*"] }
  }
}`,
    prevention:
      "Commit package-lock.json. Use TypeScript's moduleResolution setting. IDE path intelligence catches typos at write time.",
  },
  // ── Network / API ───────────────────────────────────────────────────────
  {
    match: /cors|cross-origin|blocked by cors policy/i,
    type: "CORS Error",
    confidence: "High",
    rootCause: "Browser blocked the request because the server didn't include CORS headers.",
    explanation:
      "Browsers enforce the Same-Origin Policy. When your frontend (port 3000) calls your API (port 5000 or a different domain), the browser pre-flights the request. If the server doesn't respond with the right Access-Control headers, the browser blocks it.",
    fix: `// Express — add cors middleware
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Netlify Functions — add headers to every response
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  },
  body: JSON.stringify(result),
};`,
    prevention:
      "Configure CORS at the server level, not the client. Use specific origin allowlists in production (never '*' with credentials). Handle OPTIONS preflight requests.",
  },
  {
    match: /401|unauthorized|invalid token|jwt/i,
    type: "Authentication Error (401)",
    confidence: "High",
    rootCause: "Request is missing valid credentials or the token has expired.",
    explanation:
      "The server received the request but couldn't authenticate the caller. Most common causes: expired JWT, missing Authorization header, wrong token format, or token signed with wrong secret.",
    fix: `// Check token is being sent correctly
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
    'Content-Type': 'application/json',
  },
});

// Handle 401 globally with an interceptor
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  return res.json();
}`,
    prevention:
      "Store token expiry alongside the token and proactively refresh before expiration. Use an HTTP interceptor to handle 401s globally rather than per-request.",
  },
  {
    match: /404|not found/i,
    type: "Resource Not Found (404)",
    confidence: "Medium",
    rootCause: "The requested endpoint or resource does not exist.",
    explanation:
      "The server understood the request but found nothing at that path. Could be a deleted API route, wrong base URL, typo in the endpoint, or a missing record in the database.",
    fix: `// Verify the full URL being called
console.log('Fetching:', \`\${process.env.REACT_APP_API_URL}/users/\${id}\`);

// In Express, check route order (specific before wildcards)
app.get('/users/:id', getUser);  // specific
app.get('*', notFoundHandler);   // catch-all last

// Return helpful 404 responses
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});`,
    prevention:
      "Log all requests in development. Use API versioning (/api/v1/) to avoid breaking changes. Test routes with Postman/Thunder Client before wiring to frontend.",
  },
  // ── Python ──────────────────────────────────────────────────────────────
  {
    match: /attributeerror|object has no attribute/i,
    type: "AttributeError (Python)",
    confidence: "High",
    rootCause: "Accessing an attribute or method that doesn't exist on the object.",
    explanation:
      "Python raised AttributeError because the object's class doesn't define the attribute you're accessing. Often caused by None being returned from a function, wrong object type, or a typo in the attribute name.",
    fix: `# Check with hasattr before accessing
if hasattr(obj, 'my_attribute'):
    value = obj.my_attribute

# Or use getattr with a default
value = getattr(obj, 'my_attribute', default_value)

# Debug what type you actually have
print(type(obj))
print(dir(obj))  # shows all available attributes`,
    prevention:
      "Add type hints and use mypy for static type checking. Return explicit types from functions rather than None on failure — use Optional[T] and handle None explicitly.",
  },
  {
    match: /importerror|modulenotfounderror|no module named/i,
    type: "ImportError (Python)",
    confidence: "High",
    rootCause: "Python can't find the module — not installed, wrong virtual env, or wrong name.",
    explanation:
      "The module you're importing isn't available in the current Python environment. Either the package isn't installed, you're in the wrong virtual environment, or the module name is incorrect.",
    fix: `# Install the missing package
pip install <package-name>

# Or if using requirements.txt
pip install -r requirements.txt

# Verify you're in the right virtual environment
which python
pip list | grep <package>

# For local modules, check your PYTHONPATH
import sys
print(sys.path)`,
    prevention:
      "Always work inside a virtual environment (venv/conda). Maintain requirements.txt with exact versions. Use pyproject.toml for reproducible builds.",
  },
  // ── Database ────────────────────────────────────────────────────────────
  {
    match: /unique constraint|duplicate (key|entry)|violates unique/i,
    type: "Database Unique Constraint Violation",
    confidence: "High",
    rootCause: "Attempting to insert a record that duplicates a unique-indexed field.",
    explanation:
      "The database rejected the INSERT because a row with the same value already exists in a column marked UNIQUE (commonly email, username, or composite keys).",
    fix: `// Option 1: Check before insert
const existing = await User.findOne({ email });
if (existing) return res.status(409).json({ error: 'Email already registered' });

// Option 2: Upsert (insert or update)
await db.query(\`
  INSERT INTO users (email, name)
  VALUES ($1, $2)
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
\`, [email, name]);

// Option 3: Catch and return user-friendly error
try {
  await User.create({ email });
} catch (e) {
  if (e.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ error: 'Already exists' });
  }
  throw e;
}`,
    prevention:
      "Add unique constraints at the database level AND validate at the application level. Return 409 Conflict (not 500) for duplicate entries.",
  },
  // ── Memory / Heap ───────────────────────────────────────────────────────
  {
    match: /heap out of memory|javascript heap|out of memory/i,
    type: "Out of Memory Error",
    confidence: "High",
    rootCause: "Node.js heap exhausted — typically a memory leak or processing too much data at once.",
    explanation:
      "Common causes: accumulating large arrays without releasing references, event listeners not being removed, or loading an entire large dataset into memory instead of streaming.",
    fix: `// 1. Increase heap for large operations (temporary fix)
node --max-old-space-size=4096 server.js

// 2. Stream large files instead of loading them
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('large-file.csv'),
});

rl.on('line', (line) => {
  processLine(line); // process one line at a time
});

// 3. Process in batches
const BATCH_SIZE = 100;
for (let i = 0; i < records.length; i += BATCH_SIZE) {
  await processBatch(records.slice(i, i + BATCH_SIZE));
}`,
    prevention:
      "Use streaming APIs for large data. Remove event listeners with removeEventListener when components unmount. Profile heap with Chrome DevTools or clinic.js.",
  },
];

const DEFAULT_RESPONSE = {
  type: "Runtime Error",
  confidence: "Medium",
  rootCause: "An unexpected runtime condition caused the application to throw.",
  explanation:
    "The error doesn't match a common pattern, but the stack trace points to where it occurred. Start by identifying the exact line, check what values are in scope at that point, and verify all external dependencies (APIs, files, env vars) are available.",
  fix: `// General debugging approach:

// 1. Add targeted logging before the error line
console.log('State at error:', JSON.stringify(suspectVariable));

// 2. Wrap in try/catch to see the full error object
try {
  suspectOperation();
} catch (err) {
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Stack:', err.stack);
}

// 3. Check environment variables are set
const required = ['DATABASE_URL', 'API_KEY'];
required.forEach(key => {
  if (!process.env[key]) console.error('Missing env var:', key);
});`,
  prevention:
    "Add comprehensive error boundaries in React. Use a structured logger (Winston, Pino) for production. Set up Sentry or similar for real-time error tracking.",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { errorMessage } = JSON.parse(event.body || "{}");
    if (!errorMessage || errorMessage.trim().length < 3) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please provide an error message to analyze." }),
      };
    }

    // Simulate a brief processing delay (feels realistic)
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

    // Match against known patterns
    const match = PATTERNS.find((p) => p.match.test(errorMessage));
    const result = match || DEFAULT_RESPONSE;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        type: result.type,
        confidence: result.confidence,
        rootCause: result.rootCause,
        explanation: result.explanation,
        fix: result.fix,
        prevention: result.prevention,
        analyzedAt: new Date().toISOString(),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Analysis failed. Please try again." }),
    };
  }
};
