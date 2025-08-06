# TypeScript Advanced Patterns: Mastering Type Safety and Design Patterns in 2025

TypeScript has evolved from a simple JavaScript superset to a sophisticated type system that rivals traditional statically-typed languages. As applications grow in complexity, mastering advanced TypeScript patterns becomes crucial for building maintainable, type-safe codebases. This comprehensive guide explores cutting-edge TypeScript techniques that will elevate your code quality and developer experience.

## The Power of TypeScript's Type System

TypeScript's type system is structural, not nominal, which means types are compared based on their structure rather than their names. This fundamental principle enables powerful patterns that would be impossible in many other languages. Understanding this foundation is key to mastering advanced TypeScript.

### Why Advanced TypeScript Matters

In 2025's development landscape, TypeScript proficiency directly impacts:

- **Code reliability**: Catch errors at compile-time instead of runtime
- **Developer productivity**: Better IDE support and autocompletion
- **Refactoring confidence**: Make large-scale changes safely
- **Documentation**: Types serve as inline documentation
- **Team collaboration**: Clear contracts between different parts of code

## Advanced Type Patterns

### Conditional Types

Conditional types enable type-level programming, allowing you to create types that change based on conditions:

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<"hello">; // true
type Test2 = IsString<42>; // false

// Practical example: Extract promise type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Promise<string>;
type Unwrapped = UnwrapPromise<PromiseString>; // string
type NotPromise = UnwrapPromise<number>; // number

// Advanced: Recursive conditional types
type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

interface NestedObject {
  level1: {
    level2: {
      value: string;
    };
  };
}

type ReadonlyNested = DeepReadonly<NestedObject>;
// All properties at all levels are now readonly
```

### Template Literal Types

Template literal types provide string manipulation at the type level:

```typescript
// Basic template literals
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"

// Advanced: Creating type-safe event handlers
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface FormData {
  name: string;
  email: string;
  age: number;
}

type FormHandlers = EventHandlers<FormData>;
// {
//   onName: (value: string) => void;
//   onEmail: (value: string) => void;
//   onAge: (value: number) => void;
// }

// Template literal with pattern matching
type ParseRoute<T extends string> = 
  T extends `${infer Method} ${infer Path}`
    ? { method: Method; path: Path }
    : never;

type Route = ParseRoute<"GET /users/:id">; 
// { method: "GET"; path: "/users/:id" }
```

### Mapped Types with Key Remapping

TypeScript 4.1+ introduced key remapping in mapped types:

```typescript
// Remove specific properties
type Omit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

// Add prefixes to property names
type Prefixed<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${string & K}`]: T[K];
};

interface User {
  id: number;
  name: string;
}

type PrefixedUser = Prefixed<User, "user_">;
// { user_id: number; user_name: string; }

// Filter properties by type
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Mixed {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

type NumberProps = PickByType<Mixed, number>;
// { id: number; age: number; }
```

### Discriminated Unions and Exhaustiveness Checking

Discriminated unions provide type-safe pattern matching:

```typescript
// Define discriminated union
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions for creating results
const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

// Exhaustiveness checking
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

// Usage with exhaustive pattern matching
function processResult<T, E>(result: Result<T, E>): string {
  switch (result.success) {
    case true:
      return `Success: ${JSON.stringify(result.data)}`;
    case false:
      return `Error: ${result.error}`;
    default:
      return assertNever(result);
  }
}

// Advanced: Multi-level discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape);
  }
}
```

## Advanced Generics

### Generic Constraints and Conditional Types

```typescript
// Constrained generics with conditional types
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface Person {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

type StringKeys = KeysOfType<Person, string>; // "name" | "email"

// Advanced generic constraints
function getProperty<T, K extends KeysOfType<T, string>>(
  obj: T,
  key: K
): string {
  return obj[key] as string;
}

const person: Person = {
  name: "John",
  age: 30,
  email: "john@example.com",
  isActive: true,
};

const name = getProperty(person, "name"); // OK
const email = getProperty(person, "email"); // OK
// const age = getProperty(person, "age"); // Error: not a string property
```

### Higher-Order Type Functions

```typescript
// Type-level function composition
type Compose<F, G> = <T>(x: T) => F extends (x: any) => infer R1
  ? G extends (x: R1) => infer R2
    ? R2
    : never
  : never;

// Practical example: Builder pattern with type inference
class Builder<T = {}> {
  private data: T;

  constructor(initial: T = {} as T) {
    this.data = initial;
  }

  with<K extends string, V>(
    key: K,
    value: V
  ): Builder<T & Record<K, V>> {
    return new Builder({
      ...this.data,
      [key]: value,
    } as T & Record<K, V>);
  }

  build(): T {
    return this.data;
  }
}

// Usage with full type inference
const config = new Builder()
  .with("host", "localhost")
  .with("port", 3000)
  .with("secure", true)
  .build();
// Type: { host: string; port: number; secure: boolean; }
```

### Variadic Tuple Types

```typescript
// Type-safe function composition
type Tail<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...infer Rest
]
  ? Rest
  : [];

type Head<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...unknown[]
]
  ? H
  : never;

// Reverse tuple type
type Reverse<T extends readonly unknown[]> = T extends readonly [
  ...infer Rest,
  infer Last
]
  ? [Last, ...Reverse<Rest>]
  : [];

type Reversed = Reverse<[1, 2, 3, 4]>; // [4, 3, 2, 1]

// Type-safe pipe function
declare function pipe<T extends readonly unknown[]>(
  ...fns: T
): (
  input: Head<T> extends (x: infer I) => unknown ? I : never
) => Tail<T> extends readonly [(x: any) => infer R]
  ? R
  : unknown;
```

## Design Patterns in TypeScript

### Singleton Pattern with Type Safety

```typescript
class Singleton {
  private static instance: Singleton;
  private constructor(public readonly id: string) {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton(
        Math.random().toString(36)
      );
    }
    return Singleton.instance;
  }
}

// Type-safe singleton with generics
class TypedSingleton<T> {
  private static instances = new Map<string, TypedSingleton<any>>();
  
  private constructor(
    private key: string,
    public data: T
  ) {}

  static getInstance<T>(
    key: string,
    initialData: T
  ): TypedSingleton<T> {
    if (!TypedSingleton.instances.has(key)) {
      TypedSingleton.instances.set(
        key,
        new TypedSingleton(key, initialData)
      );
    }
    return TypedSingleton.instances.get(key)!;
  }
}
```

### Factory Pattern with Type Inference

```typescript
// Abstract factory with type inference
interface Product {
  name: string;
  price: number;
}

interface Electronics extends Product {
  warranty: number;
}

interface Clothing extends Product {
  size: string;
}

type ProductTypes = {
  electronics: Electronics;
  clothing: Clothing;
};

class ProductFactory {
  static create<K extends keyof ProductTypes>(
    type: K,
    data: Omit<ProductTypes[K], "name">
  ): ProductTypes[K] {
    const baseProduct = { name: `${type}-product` };
    
    switch (type) {
      case "electronics":
        return { ...baseProduct, ...data } as ProductTypes[K];
      case "clothing":
        return { ...baseProduct, ...data } as ProductTypes[K];
      default:
        throw new Error(`Unknown product type: ${type}`);
    }
  }
}

// Usage with full type inference
const laptop = ProductFactory.create("electronics", {
  price: 999,
  warranty: 2,
});

const shirt = ProductFactory.create("clothing", {
  price: 29.99,
  size: "M",
});
```

### Observer Pattern with Strong Typing

```typescript
// Type-safe event emitter
type EventMap = Record<string, any>;

class TypedEventEmitter<T extends EventMap> {
  private listeners: {
    [K in keyof T]?: Array<(data: T[K]) => void>;
  } = {};

  on<K extends keyof T>(
    event: K,
    listener: (data: T[K]) => void
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners[event]!.indexOf(listener);
      if (index > -1) {
        this.listeners[event]!.splice(index, 1);
      }
    };
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners[event]?.forEach(listener => listener(data));
  }
}

// Usage
interface AppEvents {
  login: { userId: string; timestamp: Date };
  logout: { userId: string };
  dataUpdate: { table: string; records: number };
}

const emitter = new TypedEventEmitter<AppEvents>();

// Type-safe event handling
const unsubscribe = emitter.on("login", ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

emitter.emit("login", {
  userId: "123",
  timestamp: new Date(),
});
```

## Type Guards and Assertion Functions

### User-Defined Type Guards

```typescript
// Basic type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Advanced type guard with generics
function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

// Type guard for discriminated unions
function isSuccess<T>(
  result: Result<T, any>
): result is { success: true; data: T } {
  return result.success === true;
}

// Array type guards
function isNonNullable<T>(
  value: T
): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// Filter with type guard
const mixed = [1, "hello", null, 2, undefined, "world"];
const filtered = mixed.filter(isNonNullable);
// Type: (string | number)[]
```

### Assertion Functions

```typescript
// Assertion function
function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

// Assertion with type narrowing
function assertIsString(
  value: unknown
): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError("Value must be a string");
  }
}

// Usage
function processValue(value: unknown) {
  assertIsString(value);
  // TypeScript now knows value is string
  return value.toUpperCase();
}

// Advanced: Assertion for object properties
function assertHasProperties<T, K extends PropertyKey>(
  obj: T,
  ...keys: K[]
): asserts obj is T & Record<K, unknown> {
  for (const key of keys) {
    if (!(key in obj)) {
      throw new Error(`Missing property: ${String(key)}`);
    }
  }
}
```

## Utility Types and Type Manipulation

### Custom Utility Types

```typescript
// Deep partial type
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// Deep required type
type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>;
    }
  : T;

// Mutable type (remove readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Nullable properties
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Function types manipulation
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends (...args: any) => any> = 
  T extends (...args: any) => infer R ? R : never;

// Async function return type
type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never;
```

### Type-Level Programming

```typescript
// Type-level arithmetic
type Length<T extends readonly any[]> = T["length"];

type Push<T extends readonly any[], V> = [...T, V];

type Pop<T extends readonly any[]> = T extends readonly [
  ...infer Rest,
  any
]
  ? Rest
  : [];

// Type-level string manipulation
type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type SplitPath = Split<"users/profile/settings", "/">;
// ["users", "profile", "settings"]

// Type-level object paths
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Path<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    ttl: number;
  };
}

type ConfigPaths = Path<Config>;
// "database" | "database.host" | "database.port" | 
// "database.credentials" | "database.credentials.username" |
// "database.credentials.password" | "cache" | "cache.ttl"
```

## Performance and Best Practices

### Type Performance Optimization

```typescript
// Avoid excessive type computations
// Bad: Creates new type for each usage
type BadGeneric<T> = {
  [K in keyof T]: {
    value: T[K];
    metadata: {
      type: T[K] extends string ? "string" 
          : T[K] extends number ? "number" 
          : "other";
    };
  };
};

// Good: Use conditional type once
type TypeName<T> = T extends string ? "string" 
                 : T extends number ? "number" 
                 : "other";

type GoodGeneric<T> = {
  [K in keyof T]: {
    value: T[K];
    metadata: {
      type: TypeName<T[K]>;
    };
  };
};

// Use interface extends instead of intersection types when possible
// Bad
type Combined = TypeA & TypeB & TypeC;

// Good
interface Combined extends TypeA, TypeB, TypeC {}
```

### Type Safety Best Practices

```typescript
// 1. Prefer unknown over any
function processUnknown(value: unknown) {
  // Must narrow type before use
  if (typeof value === "string") {
    return value.toUpperCase();
  }
}

// 2. Use const assertions for literal types
const config = {
  endpoint: "https://api.example.com",
  timeout: 5000,
} as const;

// 3. Branded types for nominal typing
type UserId = string & { __brand: "UserId" };
type PostId = string & { __brand: "PostId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

// Prevents mixing different ID types
function getUser(id: UserId) { /* ... */ }
function getPost(id: PostId) { /* ... */ }

// 4. Exhaustive switch statements
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting for approval";
    case "approved":
      return "Successfully approved";
    case "rejected":
      return "Request rejected";
    default:
      const _exhaustive: never = status;
      return _exhaustive;
  }
}
```

## Real-World Applications

### Type-Safe API Client

```typescript
// Type-safe API client with route inference
type APIRoutes = {
  "GET /users": {
    response: User[];
  };
  "GET /users/:id": {
    params: { id: string };
    response: User;
  };
  "POST /users": {
    body: CreateUserDto;
    response: User;
  };
  "PATCH /users/:id": {
    params: { id: string };
    body: Partial<User>;
    response: User;
  };
};

class TypedAPIClient {
  async request<T extends keyof APIRoutes>(
    route: T,
    options?: APIRoutes[T] extends { params: infer P }
      ? { params: P }
      : {} & APIRoutes[T] extends { body: infer B }
      ? { body: B }
      : {}
  ): Promise<APIRoutes[T]["response"]> {
    // Implementation
    return {} as any;
  }
}

// Usage with full type safety
const client = new TypedAPIClient();

const users = await client.request("GET /users");
const user = await client.request("GET /users/:id", {
  params: { id: "123" },
});
const newUser = await client.request("POST /users", {
  body: { name: "John", email: "john@example.com" },
});
```

### Type-Safe State Management

```typescript
// Redux-style state management with TypeScript
type Action<T = any> = {
  type: string;
  payload?: T;
};

type ActionCreator<T = void> = T extends void
  ? () => Action
  : (payload: T) => Action<T>;

// State definition
interface AppState {
  user: User | null;
  posts: Post[];
  loading: boolean;
}

// Actions with discriminated unions
type AppActions =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "ADD_POST"; payload: Post }
  | { type: "SET_LOADING"; payload: boolean };

// Type-safe reducer
function reducer(
  state: AppState,
  action: AppActions
): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    case "ADD_POST":
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
```

## Conclusion

TypeScript's advanced features enable developers to write incredibly expressive and type-safe code. The patterns explored in this guide represent the cutting edge of TypeScript development in 2025, from conditional types and template literals to sophisticated design patterns and type-level programming.

Key takeaways for mastering advanced TypeScript:

1. **Embrace the type system**: Use it as a tool for design, not just error prevention
2. **Think at the type level**: Many problems can be solved with type manipulation
3. **Prioritize type safety**: It pays dividends in maintainability and refactoring
4. **Use patterns appropriately**: Not every problem needs the most advanced solution
5. **Keep learning**: TypeScript continues to evolve with new features and patterns

As TypeScript continues to evolve, these patterns will become increasingly important for building robust, scalable applications. The investment in learning advanced TypeScript pays off through reduced bugs, better developer experience, and more maintainable codebases.

Remember that with great power comes great responsibility. Use these advanced patterns judiciously, always considering the complexity they add versus the problems they solve. The best TypeScript code is not the most clever, but the most clear and maintainable while providing strong type safety guarantees.