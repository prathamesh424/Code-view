import type {
  ExecutionStep,
  StackFrame,
  Variable,
  ConsoleEntry,
  JSEngineState,
  QueueItem,
  WebAPIItem,
} from '@/types';
import { generateId } from '@/lib/utils';
import * as acorn from 'acorn';

type ASTNode = acorn.Node & {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

interface Scope {
  variables: Map<string, { value: unknown; type: string }>;
  parent: Scope | null;
  name: string;
}

export class JSEngine {
  private steps: ExecutionStep[] = [];
  private callStack: StackFrame[] = [];
  private consoleOutput: ConsoleEntry[] = [];
  private microtaskQueue: QueueItem[] = [];
  private macrotaskQueue: QueueItem[] = [];
  private webAPIs: WebAPIItem[] = [];
  private eventLoopPhase: JSEngineState['eventLoopPhase'] = 'idle';
  private globalScope: Scope;
  private stepIndex = 0;
  private paused = false;
  private running = false;
  private onStepCallback: ((step: ExecutionStep, state: JSEngineState) => void | Promise<void>) | null = null;
  private speed = 1;

  // Control flow signals
  private returnSignal: { value: unknown } | null = null;
  private breakSignal = false;
  private continueSignal = false;

  constructor() {
    this.globalScope = { variables: new Map(), parent: null, name: 'global' };
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  async execute(
    code: string,
    onStep: (step: ExecutionStep, state: JSEngineState) => void | Promise<void>
  ): Promise<void> {
    this.reset();
    this.running = true;
    this.onStepCallback = onStep;

    try {
      const ast = acorn.parse(code, {
        ecmaVersion: 2020,
        sourceType: 'script',
        locations: true,
      }) as ASTNode;

      // Push global execution context
      this.pushFrame('global', 1);
      await this.emitStep(1, 'statement', 'Program starts execution');

      // Execute top-level statements
      for (const node of ast.body as ASTNode[]) {
        if (!this.running) break;
        await this.executeNode(node, this.globalScope);
      }

      // Process microtask queue
      await this.processMicrotasks();
      // Process macrotask queue
      await this.processMacrotasks();

      // Pop global frame
      this.popFrame();
      await this.emitStep(
        (ast as ASTNode).loc?.end?.line ?? 1,
        'statement',
        'Program execution complete'
      );
    } catch (err) {
      if (err instanceof Error && err.message === 'ABORT') return;
      this.addConsoleEntry('error', `Error: ${(err as Error).message}`);
      await this.emitStep(1, 'statement', `Runtime error: ${(err as Error).message}`);
    }

    this.running = false;
  }

  private async executeNode(node: ASTNode, scope: Scope): Promise<unknown> {
    if (!this.running) return undefined;
    while (this.paused) {
      await this.delay(100);
    }

    const line = node.loc?.start?.line ?? 1;

    switch (node.type) {
      case 'VariableDeclaration':
        return this.executeVariableDeclaration(node, scope, line);
      case 'ExpressionStatement':
        return this.executeExpressionStatement(node, scope, line);
      case 'FunctionDeclaration':
        return this.executeFunctionDeclaration(node, scope, line);
      case 'ReturnStatement':
        return this.executeReturnStatement(node, scope, line);
      case 'IfStatement':
        return this.executeIfStatement(node, scope, line);
      case 'ForStatement':
        return this.executeForStatement(node, scope, line);
      case 'WhileStatement':
        return this.executeWhileStatement(node, scope, line);
      case 'BlockStatement':
        for (const child of node.body as ASTNode[]) {
          if (!this.running) break;
          await this.executeNode(child, scope);
          if (this.returnSignal || this.breakSignal || this.continueSignal) {
            break;
          }
        }
        return undefined;
      case 'BreakStatement':
        this.breakSignal = true;
        return undefined;
      case 'ContinueStatement':
        this.continueSignal = true;
        return undefined;
      default:
        return undefined;
    }
  }

  private async executeVariableDeclaration(
    node: ASTNode,
    scope: Scope,
    line: number
  ): Promise<void> {
    for (const decl of node.declarations as ASTNode[]) {
      const name = decl.id?.name ?? '?';
      let value: unknown = undefined;
      if (decl.init) {
        value = await this.evaluateExpression(decl.init, scope);
      }
      scope.variables.set(name, {
        value,
        type: typeof value,
      });
      await this.emitStep(line, 'assignment', `${node.kind} ${name} = ${this.stringify(value)}`);
    }
  }

  private async executeExpressionStatement(
    node: ASTNode,
    scope: Scope,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _line: number
  ): Promise<void> {
    await this.evaluateExpression(node.expression, scope);
  }

  private async executeFunctionDeclaration(
    node: ASTNode,
    scope: Scope,
    line: number
  ): Promise<void> {
    const name = node.id?.name ?? 'anonymous';
    scope.variables.set(name, {
      value: { __isFunction: true, name, params: node.params, body: node.body, scope },
      type: 'function',
    });
    await this.emitStep(line, 'statement', `Function "${name}" declared`);
  }

  private async executeReturnStatement(
    node: ASTNode,
    scope: Scope,
    line: number
  ): Promise<unknown> {
    let value: unknown = undefined;
    if (node.argument) {
      value = await this.evaluateExpression(node.argument, scope);
    }
    await this.emitStep(line, 'return', `return ${this.stringify(value)}`);
    this.returnSignal = { value };
    return value;
  }

  private async executeIfStatement(
    node: ASTNode,
    scope: Scope,
    line: number
  ): Promise<void> {
    const test = await this.evaluateExpression(node.test, scope);
    await this.emitStep(line, 'conditional', `if (${this.stringify(test)}) → ${test ? 'true' : 'false'}`);
    if (test) {
      await this.executeNode(node.consequent, scope);
    } else if (node.alternate) {
      await this.executeNode(node.alternate, scope);
    }
  }

  private async executeForStatement(
    node: ASTNode,
    scope: Scope,
    line: number
  ): Promise<void> {
    const loopScope: Scope = { variables: new Map(), parent: scope, name: 'for-loop' };
    if (node.init) {
      if (node.init.type === 'VariableDeclaration') {
        await this.executeVariableDeclaration(node.init, loopScope, line);
      } else {
        await this.evaluateExpression(node.init, loopScope);
      }
    }
    let iterations = 0;
    const maxIterations = 1000;
    while (this.running && iterations < maxIterations) {
      if (node.test) {
        const test = await this.evaluateExpression(node.test, loopScope);
        if (!test) break;
      }
      await this.emitStep(line, 'loop', `for loop iteration ${iterations + 1}`);
      await this.executeNode(node.body, loopScope);
      if (this.returnSignal) break;
      if (this.breakSignal) { this.breakSignal = false; break; }
      if (this.continueSignal) { this.continueSignal = false; }
      if (node.update) {
        await this.evaluateExpression(node.update, loopScope);
      }
      iterations++;
    }
  }

  private async executeWhileStatement(
    node: ASTNode,
    scope: Scope,
    line: number
  ): Promise<void> {
    let iterations = 0;
    const maxIterations = 1000;
    while (this.running && iterations < maxIterations) {
      const test = await this.evaluateExpression(node.test, scope);
      if (!test) break;
      await this.emitStep(line, 'loop', `while loop iteration ${iterations + 1}`);
      await this.executeNode(node.body, scope);
      if (this.returnSignal) break;
      if (this.breakSignal) { this.breakSignal = false; break; }
      if (this.continueSignal) { this.continueSignal = false; }
      iterations++;
    }
  }

  private async evaluateExpression(node: ASTNode, scope: Scope): Promise<unknown> {
    if (!node) return undefined;

    switch (node.type) {
      case 'Literal':
        return node.value;

      case 'Identifier':
        return this.lookupVariable(node.name, scope);

      case 'BinaryExpression':
      case 'LogicalExpression':
        return this.evaluateBinary(node, scope);

      case 'UnaryExpression':
        return this.evaluateUnary(node, scope);

      case 'UpdateExpression':
        return this.evaluateUpdate(node, scope);

      case 'AssignmentExpression':
        return this.evaluateAssignment(node, scope);

      case 'CallExpression':
        return this.evaluateCallExpression(node, scope);

      case 'MemberExpression':
        return this.evaluateMemberExpression(node, scope);

      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        return {
          __isFunction: true,
          name: node.id?.name ?? 'anonymous',
          params: node.params,
          body: node.body,
          scope,
        };

      case 'TemplateLiteral':
        return this.evaluateTemplateLiteral(node, scope);

case 'ArrayExpression': {
          const arr: unknown[] = [];
          for (const el of node.elements as ASTNode[]) {
            if (!el) {
              arr.push(undefined);
            } else if (el.type === 'SpreadElement') {
              const spread = await this.evaluateExpression(el.argument, scope);
              if (Array.isArray(spread)) {
                arr.push(...spread);
              } else {
                arr.push(spread);
              }
            } else {
              arr.push(await this.evaluateExpression(el, scope));
            }
          }
          return arr;
        }

      case 'ObjectExpression': {
        const obj: Record<string, unknown> = {};
        for (const prop of node.properties as ASTNode[]) {
          const key =
            prop.key.type === 'Identifier' ? prop.key.name : String(prop.key.value);
          obj[key] = await this.evaluateExpression(prop.value, scope);
        }
        return obj;
      }

      case 'ConditionalExpression': {
        const test = await this.evaluateExpression(node.test, scope);
        return test
          ? this.evaluateExpression(node.consequent, scope)
          : this.evaluateExpression(node.alternate, scope);
      }

      case 'ChainExpression':
        return this.evaluateExpression(node.expression, scope);

      default:
        return undefined;
    }
  }

  private async evaluateBinary(node: ASTNode, scope: Scope): Promise<unknown> {
    const left = (await this.evaluateExpression(node.left, scope)) as number;
    const right = (await this.evaluateExpression(node.right, scope)) as number;

    switch (node.operator) {
      case '+': return (left as unknown as string) + (right as unknown as string);
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '%': return left % right;
      case '===': return left === right;
      case '!==': return left !== right;
      case '==': return left == right;
      case '!=': return left != right;
      case '<': return left < right;
      case '>': return left > right;
      case '<=': return left <= right;
      case '>=': return left >= right;
      case '&&': return left && right;
      case '||': return left || right;
      default: return undefined;
    }
  }

  private async evaluateUnary(node: ASTNode, scope: Scope): Promise<unknown> {
    const arg = (await this.evaluateExpression(node.argument, scope)) as number;
    switch (node.operator) {
      case '-': return -arg;
      case '!': return !arg;
      case 'typeof': return typeof arg;
      default: return undefined;
    }
  }

  private async evaluateUpdate(node: ASTNode, scope: Scope): Promise<unknown> {
    const name = node.argument.name;
    const current = this.lookupVariable(name, scope) as number;
    const newVal = node.operator === '++' ? current + 1 : current - 1;
    this.setVariable(name, newVal, scope);
    return node.prefix ? newVal : current;
  }

  private async evaluateAssignment(node: ASTNode, scope: Scope): Promise<unknown> {
    const value = await this.evaluateExpression(node.right, scope);
      
      const assignToPattern = async (left: ASTNode, rightValue: unknown) => {
        if (left.type === 'Identifier') {
          this.setVariable(left.name, rightValue, scope);
        } else if (left.type === 'MemberExpression') {
          const obj = await this.evaluateExpression(left.object, scope);
          let prop;
          if (left.computed) {
            prop = await this.evaluateExpression(left.property, scope);
          } else {
            prop = left.property.name;
          }
          if (obj && (typeof obj === 'object' || typeof obj === 'function')) {
            (obj as Record<string, unknown>)[prop as string] = rightValue;
          }
        } else if (left.type === 'ArrayPattern') {
          if (Array.isArray(rightValue)) {
            for (let i = 0; i < left.elements.length; i++) {
              if (left.elements[i]) {
                await assignToPattern(left.elements[i], rightValue[i]);
              }
            }
          }
        }
      };

      await assignToPattern(node.left, value);

      const line = node.loc?.start?.line ?? 1;
      let desc = 'assignment';
      if (node.left.type === 'Identifier') {
        desc = `${node.left.name} = ${this.stringify(value)}`;
      } else if (node.left.type === 'MemberExpression') {
        const propName = node.left.computed ? '[...]' : `.${node.left.property.name}`;
        desc = `Assign to object property ${propName} = ${this.stringify(value)}`;
      } else if (node.left.type === 'ArrayPattern') {
        desc = `Destructuring assignment = ${this.stringify(value)}`;
      }
      
      await this.emitStep(line, 'assignment', desc);
      return value;
    }

  private async evaluateArguments(argsNodes: ASTNode[], scope: Scope): Promise<unknown[]> { const args: unknown[] = []; for (const argNode of argsNodes) { if (argNode.type === 'SpreadElement') { const spread = await this.evaluateExpression(argNode.argument, scope); if (Array.isArray(spread)) { args.push(...spread); } else { args.push(spread); } } else { args.push(await this.evaluateExpression(argNode, scope)); } } return args; }

  private async evaluateCallExpression(node: ASTNode, scope: Scope): Promise<unknown> {
    const line = node.loc?.start?.line ?? 1;

    // Handle console.log, console.error, etc.
    if (
      node.callee.type === 'MemberExpression' &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'console'
    ) {
      const method = node.callee.property.name as 'log' | 'error' | 'warn' | 'info';
      const args = await this.evaluateArguments(node.arguments as ASTNode[], scope);
      const output = args.map((a) => this.stringify(a)).join(' ');
      this.addConsoleEntry(method === 'log' ? 'log' : method, output);
      await this.emitStep(line, 'output', `console.${method}(${output})`);
      return undefined;
    }

    // Handle setTimeout
    if (
      node.callee.type === 'Identifier' &&
      node.callee.name === 'setTimeout'
    ) {
      const args = node.arguments as ASTNode[];
      const callback = args[0];
      const delayMs = args[1] ? ((await this.evaluateExpression(args[1], scope)) as number) : 0;

      const item: QueueItem = {
        id: generateId(),
        label: `setTimeout(${delayMs}ms)`,
        callback: this.nodeToString(callback),
        type: 'setTimeout',
        delay: delayMs,
        addedAt: Date.now(),
      };

      // Add to Web APIs first
      const webAPI: WebAPIItem = {
        id: item.id,
        label: `Timer (${delayMs}ms)`,
        type: 'timer',
        remaining: delayMs,
        total: delayMs,
      };
      this.webAPIs.push(webAPI);
      await this.emitStep(line, 'expression', `setTimeout registered → Web API (${delayMs}ms)`);

      // Move to macrotask queue (simulated)
      this.webAPIs = this.webAPIs.filter((w) => w.id !== item.id);
      this.macrotaskQueue.push(item);
      await this.emitStep(line, 'expression', `Timer complete → callback moved to macrotask queue`);

      // Store callback for later execution
      const callbackFn = await this.evaluateExpression(callback, scope);
      if (callbackFn && typeof callbackFn === 'object' && '__isFunction' in (callbackFn as Record<string, unknown>)) {
        scope.variables.set(`__macrotask_${item.id}`, { value: callbackFn, type: 'function' });
      }

      return undefined;
    }

    // Handle Promise.resolve
    if (
      node.callee.type === 'MemberExpression' &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'Promise' &&
      node.callee.property.name === 'resolve'
    ) {
      const args = await this.evaluateArguments(node.arguments as ASTNode[], scope);
      await this.emitStep(line, 'expression', `Promise.resolve(${args.map(a => this.stringify(a)).join(', ')})`);
      return { __isPromise: true, value: args[0], thenCallbacks: [], scope };
    }

    // Handle .then() on promise-like
    if (
      node.callee.type === 'MemberExpression' &&
      node.callee.property.name === 'then'
    ) {
      await this.evaluateExpression(node.callee.object, scope);
      const callback = (node.arguments as ASTNode[])[0];
      const callbackFn = await this.evaluateExpression(callback, scope);

      const item: QueueItem = {
        id: generateId(),
        label: 'Promise.then',
        callback: this.nodeToString(callback),
        type: 'then',
        addedAt: Date.now(),
      };
      this.microtaskQueue.push(item);

      // Store callback
      scope.variables.set(`__microtask_${item.id}`, { value: callbackFn, type: 'function' });

      await this.emitStep(line, 'expression', `.then() callback added to microtask queue`);
      return { __isPromise: true, value: undefined, thenCallbacks: [item.id], scope };
    }

      let callee;
      let thisArg: unknown = undefined;

      if (node.callee.type === 'MemberExpression') {
        thisArg = await this.evaluateExpression(node.callee.object, scope);
        const prop = node.callee.computed
          ? await this.evaluateExpression(node.callee.property, scope)
          : (node.callee.property as Record<string, unknown>).name;
        
        if (thisArg != null) {
          callee = (thisArg as Record<string, unknown>)[prop as string];
        }
      } else if (node.callee.type === 'Identifier') {
        callee = this.lookupVariable(node.callee.name, scope);
      } else {
        callee = await this.evaluateExpression(node.callee, scope);
      }

    if (callee && typeof callee === 'object' && '__isFunction' in (callee as Record<string, unknown>)) {
      const fn = callee as {
        __isFunction: boolean;
        name: string;
        params: ASTNode[];
        body: ASTNode;
        scope: Scope;
      };
      const args = await this.evaluateArguments(node.arguments as ASTNode[], scope);

      const fnScope: Scope = {
        variables: new Map(),
        parent: fn.scope,
        name: fn.name || 'anonymous',
      };

      fn.params.forEach((param, i) => {
        const paramName = param.name ?? param.left?.name ?? `arg${i}`;
        fnScope.variables.set(paramName, {
          value: args[i],
          type: typeof args[i],
        });
      });

      this.pushFrame(fn.name || 'anonymous', line);
      await this.emitStep(line, 'call', `Call ${fn.name}(${args.map((a) => this.stringify(a)).join(', ')})`);

      let result: unknown = undefined;
      if (fn.body.type === 'BlockStatement') {
        for (const stmt of fn.body.body as ASTNode[]) {
          if (!this.running) break;
          await this.executeNode(stmt, fnScope);
          if (this.returnSignal) {
            result = this.returnSignal.value;
            this.returnSignal = null;
            break;
          }
        }
      } else {
        result = await this.evaluateExpression(fn.body, fnScope);
      }

      this.popFrame();
      await this.emitStep(line, 'return', `${fn.name} returned ${this.stringify(result)}`);
      return result;
      } else if (typeof callee === 'function') {
        const args = await this.evaluateArguments(node.arguments as ASTNode[], scope);
        const result = callee.apply(thisArg, args);
        const fnName = callee.name || 'native function';
        await this.emitStep(line, 'call', `Call ${fnName}(...${args.length} args)`);
        return result;
      }

      return undefined;
    }

    private async evaluateMemberExpression(node: ASTNode, scope: Scope): Promise<unknown> {
      const obj = (await this.evaluateExpression(node.object, scope)) as Record<string, unknown> | unknown[] | null;
      if (obj == null) return undefined;

    const prop = node.computed
      ? ((await this.evaluateExpression(node.property, scope)) as string | number)
      : (node.property.name as string);

    if (Array.isArray(obj)) {
      if (prop === 'length') return obj.length;
      if (prop === 'push') return { __isFunction: true, name: 'push', params: [], body: null, scope };
      return obj[prop as number];
    }

    return (obj as Record<string, unknown>)[prop as string];
  }

  private async evaluateTemplateLiteral(node: ASTNode, scope: Scope): Promise<string> {
    let result = '';
    const quasis = node.quasis as ASTNode[];
    const expressions = node.expressions as ASTNode[];

    for (let i = 0; i < quasis.length; i++) {
      result += quasis[i].value.cooked ?? quasis[i].value.raw;
      if (i < expressions.length) {
        const exprVal = await this.evaluateExpression(expressions[i], scope);
        result += this.stringify(exprVal);
      }
    }
    return result;
  }

  private async processMicrotasks(): Promise<void> {
    if (this.microtaskQueue.length === 0) return;

    this.eventLoopPhase = 'microtasks';
    await this.emitStep(0, 'statement', '⟳ Event Loop: Processing microtask queue');

    while (this.microtaskQueue.length > 0 && this.running) {
      const task = this.microtaskQueue.shift()!;
      this.pushFrame(`microtask: ${task.label}`, 0);
      await this.emitStep(0, 'call', `Executing microtask: ${task.label}`);

      // Execute stored callback
      const callbackData = this.globalScope.variables.get(`__microtask_${task.id}`);
      if (callbackData && callbackData.value && typeof callbackData.value === 'object') {
        const fn = callbackData.value as {
          __isFunction: boolean;
          body: ASTNode;
          params: ASTNode[];
          scope: Scope;
        };
        if (fn.body) {
          const fnScope: Scope = { variables: new Map(), parent: fn.scope, name: 'microtask' };
          if (fn.body.type === 'BlockStatement') {
            for (const stmt of fn.body.body as ASTNode[]) {
              await this.executeNode(stmt, fnScope);
              if (this.returnSignal) {
                this.returnSignal = null;
                break;
              }
            }
          } else {
            await this.evaluateExpression(fn.body, fnScope);
          }
        }
      }

      this.popFrame();
    }
  }

  private async processMacrotasks(): Promise<void> {
    if (this.macrotaskQueue.length === 0) return;

    this.eventLoopPhase = 'macrotasks';
    await this.emitStep(0, 'statement', '⟳ Event Loop: Processing macrotask queue');

    while (this.macrotaskQueue.length > 0 && this.running) {
      const task = this.macrotaskQueue.shift()!;
      this.pushFrame(`macrotask: ${task.label}`, 0);
      await this.emitStep(0, 'call', `Executing macrotask: ${task.label}`);

      // Execute stored callback
      const callbackData = this.globalScope.variables.get(`__macrotask_${task.id}`);
      if (callbackData && callbackData.value && typeof callbackData.value === 'object') {
        const fn = callbackData.value as {
          __isFunction: boolean;
          body: ASTNode;
          params: ASTNode[];
          scope: Scope;
        };
        if (fn.body) {
          const fnScope: Scope = { variables: new Map(), parent: fn.scope, name: 'macrotask' };
          if (fn.body.type === 'BlockStatement') {
            for (const stmt of fn.body.body as ASTNode[]) {
              await this.executeNode(stmt, fnScope);
              if (this.returnSignal) {
                this.returnSignal = null;
                break;
              }
            }
          } else {
            await this.evaluateExpression(fn.body, fnScope);
          }
        }
      }

      this.popFrame();

      // Process any new microtasks added during macrotask
      await this.processMicrotasks();
    }
  }

  // ── Helpers ──

  private lookupVariable(name: string, scope: Scope): unknown {
    let current: Scope | null = scope;
    while (current) {
      if (current.variables.has(name)) {
        return current.variables.get(name)!.value;
      }
      current = current.parent;
    }
    return undefined;
  }

  private setVariable(name: string, value: unknown, scope: Scope): void {
    let current: Scope | null = scope;
    while (current) {
      if (current.variables.has(name)) {
        current.variables.set(name, { value, type: typeof value });
        return;
      }
      current = current.parent;
    }
    scope.variables.set(name, { value, type: typeof value });
  }

  private pushFrame(name: string, line: number): void {
    this.callStack.push({
      id: generateId(),
      name,
      line,
      variables: [],
      isActive: true,
    });
    if (this.callStack.length > 1) {
      this.callStack[this.callStack.length - 2].isActive = false;
    }
  }

  private popFrame(): void {
    this.callStack.pop();
    if (this.callStack.length > 0) {
      this.callStack[this.callStack.length - 1].isActive = true;
    }
  }

  private addConsoleEntry(type: ConsoleEntry['type'], value: string): void {
    this.consoleOutput.push({
      type,
      value,
      timestamp: Date.now(),
    });
  }

  private collectVariables(scope: Scope): Variable[] {
    const vars: Variable[] = [];
    let current: Scope | null = scope;
    const isGlobal = (s: Scope) => s.parent === null;

    while (current) {
      for (const [name, data] of current.variables.entries()) {
        if (name.startsWith('__')) continue;
        const displayValue = data.type === 'function' ? '[Function]' : this.stringify(data.value);
        vars.push({
          name,
          value: displayValue,
          type: data.type,
          scope: isGlobal(current) ? 'global' : 'local',
        });
      }
      current = current.parent;
    }
    return vars;
  }

  private async emitStep(
    line: number,
    type: ExecutionStep['type'],
    description: string
  ): Promise<void> {
    // Determine event loop phase
    if (this.callStack.length > 0) {
      const topFrame = this.callStack[this.callStack.length - 1];
      if (topFrame.name.startsWith('microtask')) {
        this.eventLoopPhase = 'microtasks';
      } else if (topFrame.name.startsWith('macrotask')) {
        this.eventLoopPhase = 'macrotasks';
      } else {
        this.eventLoopPhase = 'callstack';
      }
    } else {
      this.eventLoopPhase = 'idle';
    }

    const step: ExecutionStep = {
      line,
      type,
      description,
      callStack: [...this.callStack.map(f => ({ ...f }))],
      variables: this.collectVariables(this.globalScope),
      consoleOutput: [...this.consoleOutput],
      timestamp: Date.now(),
    };

    const engineState: JSEngineState = {
      callStack: [...this.callStack.map(f => ({ ...f }))],
      microtaskQueue: [...this.microtaskQueue],
      macrotaskQueue: [...this.macrotaskQueue],
      webAPIs: [...this.webAPIs],
      eventLoopPhase: this.eventLoopPhase,
      currentTask: description,
    };

    this.steps.push(step);
    this.stepIndex++;

    if (this.onStepCallback) {
      await this.onStepCallback(step, engineState);
    }

    await this.delay(Math.max(100, 600 / this.speed));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private stringify(value: unknown): string {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if ('__isFunction' in (value as Record<string, unknown>)) return '[Function]';
      if ('__isPromise' in (value as Record<string, unknown>)) return '[Promise]';
      try {
        return JSON.stringify(value);
      } catch {
        return '[Object]';
      }
    }
    return String(value);
  }

  private nodeToString(node: ASTNode): string {
    if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
      return `() => {...}`;
    }
    if (node.type === 'Identifier') {
      return node.name;
    }
    return node.type;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  stop() {
    this.running = false;
    this.paused = false;
  }

  reset() {
    this.steps = [];
    this.callStack = [];
    this.consoleOutput = [];
    this.microtaskQueue = [];
    this.macrotaskQueue = [];
    this.webAPIs = [];
    this.eventLoopPhase = 'idle';
    this.globalScope = { variables: new Map(), parent: null, name: 'global' };
    this.stepIndex = 0;
    this.paused = false;
    this.running = false;
    this.onStepCallback = null;
  }

  isRunning() {
    return this.running;
  }
}
