# Clean Code & Coding Patterns Guide

A comprehensive reference for writing clean, maintainable, and high-quality code following industry best practices.

---

## Table of Contents
1. [Core Principles](#core-principles)
2. [Naming Conventions](#naming-conventions)
3. [Function Design](#function-design)
4. [Code Structure & Organization](#code-structure--organization)
5. [Comments & Documentation](#comments--documentation)
6. [Error Handling](#error-handling)
7. [SOLID Principles](#solid-principles)
8. [Code Smells to Avoid](#code-smells-to-avoid)
9. [Testing Best Practices](#testing-best-practices)
10. [Language-Specific Guidelines](#language-specific-guidelines)

---

## Core Principles

### DRY (Don't Repeat Yourself)
Every piece of knowledge should have a single, authoritative representation within a system.

**Bad:**
```javascript
function calculateUserDiscount(user) {
  if (user.age > 65) return 0.2;
  if (user.isPremium) return 0.15;
  return 0.1;
}

function displayUserDiscount(user) {
  if (user.age > 65) return "20% discount";
  if (user.isPremium) return "15% discount";
  return "10% discount";
}
```

**Good:**
```javascript
const DISCOUNT_RATES = {
  senior: 0.2,
  premium: 0.15,
  standard: 0.1
};

function getUserDiscountType(user) {
  if (user.age > 65) return 'senior';
  if (user.isPremium) return 'premium';
  return 'standard';
}

function calculateUserDiscount(user) {
  return DISCOUNT_RATES[getUserDiscountType(user)];
}
```

### KISS (Keep It Simple, Stupid)
Simplicity should be a key goal in design. Avoid unnecessary complexity.

**Bad:**
```javascript
const result = arr.reduce((acc, val) => [...acc, val * 2], []);
```

**Good:**
```javascript
const result = arr.map(val => val * 2);
```

### YAGNI (You Aren't Gonna Need It)
Don't add functionality until it's necessary. Avoid premature optimization.

**Bad:**
```javascript
class User {
  constructor(name) {
    this.name = name;
    this.futureFeature1 = null;  // Not needed yet
    this.futureFeature2 = null;  // Not needed yet
  }
}
```

**Good:**
```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}
```

---

## Naming Conventions

### General Rules
- **Use intention-revealing names**: Names should tell you why it exists, what it does, and how it's used
- **Use pronounceable names**: Avoid abbreviations like `genYmdHms` (use `generateTimestamp`)
- **Use searchable names**: Single-letter names and numeric constants are hard to locate
- **Avoid mental mapping**: Readers shouldn't have to translate your names into other names

### Variables

**Use nouns for variables:**
```javascript
// Bad
const d; // elapsed time in days
const list;

// Good
const elapsedTimeInDays;
const activeUsers;
const shoppingCart;
```

**Boolean variables should ask a question:**
```javascript
// Bad
const open;
const write;
const fruit;

// Good
const isOpen;
const canWrite;
const hasFruit;
const shouldUpdate;
```

### Functions

**Use verbs for functions:**
```javascript
// Bad
function data() { }
function user() { }

// Good
function getData() { }
function createUser() { }
function validateEmail() { }
function calculateTotal() { }
```

**Common verb prefixes:**
- `get` - retrieve data
- `set` - assign data
- `create` - instantiate new object
- `update` - modify existing data
- `delete` / `remove` - eliminate data
- `is` / `has` / `can` - return boolean
- `validate` - check validity
- `calculate` / `compute` - perform calculation
- `fetch` - retrieve from external source
- `handle` - event handler
- `on` - event listener

### Classes

**Use PascalCase for classes:**
```javascript
// Bad
class userAccount { }
class http_request { }

// Good
class UserAccount { }
class HttpRequest { }
class ShoppingCart { }
```

### Constants

**Use UPPER_SNAKE_CASE for constants:**
```javascript
// Bad
const maxretries = 3;
const apiurl = 'https://api.example.com';

// Good
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
```

### Case Styles by Language

| Language | Variables/Functions | Classes | Constants | Files |
|----------|-------------------|---------|-----------|-------|
| JavaScript/TypeScript | camelCase | PascalCase | UPPER_SNAKE_CASE | kebab-case |
| Python | snake_case | PascalCase | UPPER_SNAKE_CASE | snake_case |
| Java/C# | camelCase | PascalCase | UPPER_SNAKE_CASE | PascalCase |
| Go | camelCase | PascalCase | PascalCase | snake_case |
| Ruby | snake_case | PascalCase | UPPER_SNAKE_CASE | snake_case |

---

## Function Design

### Single Responsibility Principle
A function should do one thing and do it well.

**Bad:**
```javascript
function processUserAndSendEmail(user) {
  // Validate user
  if (!user.email) throw new Error('Invalid email');
  
  // Save to database
  database.save(user);
  
  // Send email
  emailService.send(user.email, 'Welcome!');
  
  // Log activity
  logger.log(`User ${user.id} processed`);
}
```

**Good:**
```javascript
function validateUser(user) {
  if (!user.email) throw new Error('Invalid email');
}

function saveUser(user) {
  return database.save(user);
}

function sendWelcomeEmail(user) {
  return emailService.send(user.email, 'Welcome!');
}

function logUserActivity(user) {
  logger.log(`User ${user.id} processed`);
}

async function processUser(user) {
  validateUser(user);
  await saveUser(user);
  await sendWelcomeEmail(user);
  logUserActivity(user);
}
```

### Function Size
- Keep functions small (ideally 10-20 lines)
- If a function is too long, break it into smaller functions
- Each function should have one level of abstraction

### Function Parameters
- Limit to 3 parameters maximum
- Use object destructuring for multiple parameters
- Avoid boolean flags as parameters

**Bad:**
```javascript
function createUser(name, email, age, address, phone, isActive) {
  // ...
}
```

**Good:**
```javascript
function createUser({ name, email, age, address, phone, isActive }) {
  // ...
}
```

### Pure Functions
Prefer pure functions that don't have side effects.

**Bad:**
```javascript
let total = 0;
function addToTotal(value) {
  total += value;  // Side effect
  return total;
}
```

**Good:**
```javascript
function add(a, b) {
  return a + b;  // No side effects
}
```

---

## Code Structure & Organization

### File Organization
```
project/
├── src/
│   ├── components/     # UI components
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   ├── types/          # Type definitions
│   ├── constants/      # Constants
│   ├── hooks/          # Custom hooks (React)
│   └── config/         # Configuration
├── tests/
└── docs/
```

### Import Order
1. External libraries
2. Internal modules
3. Relative imports
4. Types/Interfaces
5. Styles

```javascript
// External
import React from 'react';
import axios from 'axios';

// Internal
import { apiService } from '@/services/api';
import { formatDate } from '@/utils/date';

// Relative
import { Button } from './Button';
import { Header } from '../Header';

// Types
import type { User } from '@/types';

// Styles
import './styles.css';
```

### Code Grouping
Group related code together and separate with blank lines.

```javascript
// Bad
const name = 'John';
function greet() { }
const age = 30;
function calculate() { }

// Good
const name = 'John';
const age = 30;

function greet() { }

function calculate() { }
```

---

## Comments & Documentation

### When to Comment
- **Comment WHY, not WHAT**: Code shows what happens; comments explain why
- **Explain complex algorithms**: If it's not immediately obvious
- **Document workarounds**: Explain why you did something unusual
- **Add TODOs**: Mark incomplete or temporary code

### When NOT to Comment
- Don't state the obvious
- Don't comment bad code - rewrite it
- Don't leave commented-out code

**Bad:**
```javascript
// Increment counter by 1
counter++;

// Loop through array
for (let i = 0; i < arr.length; i++) {
  // ...
}
```

**Good:**
```javascript
// Using binary search instead of linear for O(log n) performance
const index = binarySearch(sortedArray, target);

// WORKAROUND: API returns null instead of empty array
// TODO: Remove this check when API is fixed (ticket #1234)
const items = response.data || [];
```

### JSDoc for Functions
```javascript
/**
 * Calculates the total price including tax and discount
 * @param {number} basePrice - The original price before calculations
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param {number} [discount=0] - Optional discount as decimal
 * @returns {number} The final price after tax and discount
 * @throws {Error} If basePrice or taxRate is negative
 * @example
 * calculateTotal(100, 0.1, 0.2) // Returns 88
 */
function calculateTotal(basePrice, taxRate, discount = 0) {
  if (basePrice < 0 || taxRate < 0) {
    throw new Error('Price and tax rate must be positive');
  }
  return basePrice * (1 + taxRate) * (1 - discount);
}
```

---

## Error Handling

### Use Try-Catch for Async Operations
```javascript
// Bad
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Good
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error(`Unable to fetch user ${id}: ${error.message}`);
  }
}
```

### Create Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

// Usage
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}
```

### Error Handling Patterns
```javascript
// Pattern 1: Early return
function processData(data) {
  if (!data) {
    console.error('No data provided');
    return null;
  }
  
  if (!data.isValid) {
    console.error('Invalid data');
    return null;
  }
  
  return transformData(data);
}

// Pattern 2: Error boundaries (React)
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Pattern 3: Result objects
function divide(a, b) {
  if (b === 0) {
    return { success: false, error: 'Division by zero' };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

---

## SOLID Principles

### S - Single Responsibility Principle
A class should have only one reason to change.

```javascript
// Bad
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  save() {
    // Database logic
  }
  
  sendEmail() {
    // Email logic
  }
}

// Good
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    // Database logic
  }
}

class EmailService {
  sendWelcomeEmail(user) {
    // Email logic
  }
}
```

### O - Open/Closed Principle
Open for extension, closed for modification.

```javascript
// Bad
class PaymentProcessor {
  processPayment(type, amount) {
    if (type === 'credit') {
      // Credit card logic
    } else if (type === 'paypal') {
      // PayPal logic
    }
  }
}

// Good
class PaymentProcessor {
  constructor(paymentMethod) {
    this.paymentMethod = paymentMethod;
  }
  
  process(amount) {
    return this.paymentMethod.pay(amount);
  }
}

class CreditCardPayment {
  pay(amount) {
    // Credit card logic
  }
}

class PayPalPayment {
  pay(amount) {
    // PayPal logic
  }
}
```

### L - Liskov Substitution Principle
Derived classes must be substitutable for their base classes.

```javascript
// Bad
class Bird {
  fly() {
    return 'Flying';
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly');
  }
}

// Good
class Bird {
  move() {
    return 'Moving';
  }
}

class FlyingBird extends Bird {
  fly() {
    return 'Flying';
  }
}

class Penguin extends Bird {
  swim() {
    return 'Swimming';
  }
}
```

### I - Interface Segregation Principle
Clients should not be forced to depend on interfaces they don't use.

```javascript
// Bad
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() { }
  eat() { throw new Error('Robots don\'t eat'); }
  sleep() { throw new Error('Robots don\'t sleep'); }
}

// Good
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Robot implements Workable {
  work() { }
}

class Human implements Workable, Eatable, Sleepable {
  work() { }
  eat() { }
  sleep() { }
}
```

### D - Dependency Inversion Principle
Depend on abstractions, not concretions.

```javascript
// Bad
class MySQLDatabase {
  save(data) { }
}

class UserService {
  constructor() {
    this.database = new MySQLDatabase();
  }
}

// Good
class UserService {
  constructor(database) {
    this.database = database;  // Inject dependency
  }
  
  saveUser(user) {
    this.database.save(user);
  }
}

// Can now use any database
const mysqlDb = new MySQLDatabase();
const userService = new UserService(mysqlDb);
```

---

## Code Smells to Avoid

### 1. Magic Numbers
```javascript
// Bad
if (user.age > 65) { }

// Good
const RETIREMENT_AGE = 65;
if (user.age > RETIREMENT_AGE) { }
```

### 2. Deep Nesting
```javascript
// Bad
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // Do something
    }
  }
}

// Good
if (!user || !user.isActive || !user.hasPermission) {
  return;
}
// Do something
```

### 3. Long Parameter Lists
```javascript
// Bad
function createUser(name, email, age, address, phone, city, country) { }

// Good
function createUser(userData) {
  const { name, email, age, address, phone, city, country } = userData;
}
```

### 4. Duplicate Code
```javascript
// Bad
function calculatePriceWithTax(price) {
  return price * 1.1;
}

function calculateDiscountedPrice(price) {
  return price * 0.9;
}

// Good
function applyMultiplier(price, multiplier) {
  return price * multiplier;
}

const TAX_MULTIPLIER = 1.1;
const DISCOUNT_MULTIPLIER = 0.9;
```

### 5. God Objects
Avoid classes that do too much. Break them into smaller, focused classes.

---

## Testing Best Practices

### Test Naming
```javascript
// Bad
test('test1', () => { });

// Good
test('should return user when valid ID is provided', () => { });
test('should throw error when user is not found', () => { });
```

### AAA Pattern (Arrange, Act, Assert)
```javascript
test('should calculate total with tax', () => {
  // Arrange
  const price = 100;
  const taxRate = 0.1;
  
  // Act
  const result = calculateTotal(price, taxRate);
  
  // Assert
  expect(result).toBe(110);
});
```

### Test One Thing
```javascript
// Bad
test('user operations', () => {
  expect(createUser()).toBeDefined();
  expect(updateUser()).toBeTruthy();
  expect(deleteUser()).toBeNull();
});

// Good
test('should create user successfully', () => {
  expect(createUser()).toBeDefined();
});

test('should update user successfully', () => {
  expect(updateUser()).toBeTruthy();
});

test('should delete user successfully', () => {
  expect(deleteUser()).toBeNull();
});
```

---

## Language-Specific Guidelines

### JavaScript/TypeScript
- Use `const` by default, `let` when reassignment is needed, avoid `var`
- Use arrow functions for callbacks
- Use template literals instead of string concatenation
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer `async/await` over `.then()` chains

```javascript
// Good
const user = await fetchUser(id);
const name = user?.profile?.name ?? 'Anonymous';
```

### Python
- Follow PEP 8 style guide
- Use list comprehensions when appropriate
- Use context managers (`with` statement) for resources
- Use type hints for function parameters and return values

```python
# Good
def calculate_total(prices: list[float]) -> float:
    return sum(prices)

with open('file.txt', 'r') as file:
    content = file.read()
```

### Java
- Follow Oracle's Java Code Conventions
- Use meaningful package names
- Prefer composition over inheritance
- Use interfaces for abstraction

### Go
- Follow Effective Go guidelines
- Use short variable names in small scopes
- Handle errors explicitly
- Use defer for cleanup

---

## Quick Reference Checklist

✅ **Naming**
- [ ] Variables use nouns (camelCase)
- [ ] Functions use verbs (camelCase)
- [ ] Classes use PascalCase
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] Booleans start with is/has/can

✅ **Functions**
- [ ] Do one thing only
- [ ] Are small (< 20 lines)
- [ ] Have 3 or fewer parameters
- [ ] Have no side effects (when possible)

✅ **Code Quality**
- [ ] No duplicate code (DRY)
- [ ] Simple and straightforward (KISS)
- [ ] No unnecessary features (YAGNI)
- [ ] Follows SOLID principles

✅ **Comments**
- [ ] Explain WHY, not WHAT
- [ ] No obvious comments
- [ ] No commented-out code
- [ ] JSDoc for public APIs

✅ **Error Handling**
- [ ] All async operations wrapped in try-catch
- [ ] Custom error classes for specific errors
- [ ] Meaningful error messages
- [ ] Errors logged appropriately

✅ **Testing**
- [ ] Tests are readable and maintainable
- [ ] One assertion per test
- [ ] Tests follow AAA pattern
- [ ] Edge cases covered

---

## Resources & Further Reading

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring by Martin Fowler](https://refactoring.com/)
- [Google Style Guides](https://google.github.io/styleguide/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [PEP 8 - Python Style Guide](https://peps.python.org/pep-0008/)

---

**Last Updated:** May 2026  
**Version:** 1.0

*This guide is a living document. Keep it updated as you learn new patterns and best practices.*
