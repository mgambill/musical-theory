import type { Condition, ConditionOperator } from '../types/condition'

/**
 * Token types recognized by the parser.
 */
type Token =
  | { type: 'identifier'; value: string } // e.g. $.model.age or model.age
  | { type: 'operator'; value: string } // e.g. ==, !=, >, <, BETWEEN, IN, LIKE, etc.
  | { type: 'logical'; value: string } // e.g. AND, OR, NOT (used as logical connectors)
  | { type: 'literal'; value: string } // e.g. quoted strings, numbers, booleans, {CurrentDate}
  | { type: 'paren'; value: '(' | ')' } // For grouping expressions
  | { type: 'comma'; value: ',' } // For separating IN list items
  | { type: 'negate'; value: '!' } // For negating conditions

/**
 * Set of supported type-check function names.
 */
const typeCheckFunctions = new Set(['IsArray', 'IsBool', 'IsUndefined', 'IsDefined', 'IsInteger', 'IsNull', 'IsNumber', 'IsObject', 'IsString', 'IsEmpty', 'IsNotEmpty'])

/**
 * Tokenize the input string.
 * Updated regex includes comma as a token and explicitly treats BETWEEN, IN, and LIKE as operator tokens.
 */
function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  // The regex now matches commas; keywords like BETWEEN/IN/LIKE will fall into the [^\s(),]+ bucket.
  const regex = /\s*(=>|==|!=|>=|<=|>|<|~|!|\(|\)|,|AND|OR|NOT|[^\s(),]+)/gi
  let match: RegExpExecArray | null

  while ((match = regex.exec(input)) !== null) {
    const tokenStr = match[0].trim()
    if (!tokenStr) continue

    if (tokenStr === '(' || tokenStr === ')') {
      tokens.push({ type: 'paren', value: tokenStr as '(' | ')' })
    } else if (tokenStr === ',') {
      tokens.push({ type: 'comma', value: tokenStr })
    } else if (['BETWEEN', 'IN', 'LIKE', 'STARTSWITH', 'ENDSWITH', 'ANY', 'ALL'].includes(tokenStr.toUpperCase())) {
      tokens.push({ type: 'operator', value: tokenStr.toUpperCase() })
    } else if (/^(AND|OR|NOT)$/i.test(tokenStr)) {
      tokens.push({ type: 'logical', value: tokenStr.toUpperCase() })
    } else if (/^(!)$/i.test(tokenStr)) {
      tokens.push({ type: 'negate', value: '!' })
    } else if (/^(==|!=|>=|<=|>|<|~)$/.test(tokenStr)) {
      tokens.push({ type: 'operator', value: tokenStr })
    } else if ((tokenStr.startsWith("'") && tokenStr.endsWith("'")) || (tokenStr.startsWith('"') && tokenStr.endsWith('"')) || (tokenStr.startsWith('`') && tokenStr.endsWith('`'))) {
      tokens.push({ type: 'literal', value: tokenStr })
    } else if (tokenStr.startsWith('{') && tokenStr.endsWith('}')) {
      tokens.push({ type: 'literal', value: tokenStr })
    } else if (!isNaN(Number(tokenStr))) {
      tokens.push({ type: 'literal', value: tokenStr })
    } else {
      // Otherwise, treat as an identifier.
      tokens.push({ type: 'identifier', value: tokenStr })
    }
  }
  return tokens
}

/**
 * Parse an expression combining terms with logical operators.
 */
function parseExpression(tokens: Token[]): [Condition, Token[]] {
  let [left, remainingTokens] = parseTerm(tokens)
  while (remainingTokens.length > 0 && remainingTokens[0].type === 'logical') {
    const logicalToken = remainingTokens.shift()!
    if (logicalToken.value === 'NOT') {
      const [term, newRemaining] = parseTerm(remainingTokens)

      left = { operator: 'Not', conditions: [term] } as Condition
      remainingTokens = newRemaining
    } else {
      const [right, newRemaining] = parseTerm(remainingTokens)
      left = {
        operator: logicalToken.value === 'AND' ? 'And' : 'Or',
        conditions: [left, right],
      } as Condition
      remainingTokens = newRemaining
    }
  }

  simplifyBooleanCondition(left)

  return [left, remainingTokens]
}

function negateCondition(term: Condition) {
  if (term.operator === 'IsEmpty') {
    term.operator = 'IsNotEmpty'
    return true
  } else if (term.operator === 'IsNull') {
    term.operator = 'IsNotNull'
    return true
  } else if (term.operator === 'Like') {
    term.operator = 'NotLike'
    return true
  } else if (term.operator === 'In') {
    term.operator = 'NotIn'
    return true
  }
  return false
}

function simplifyBooleanCondition(left: Condition) {
  if (left.operator === 'EqualTo' && left.value === false) {
    left.operator = 'IsFalse'
    left.value = undefined
  } else if (left.operator === 'EqualTo' && left.value === true) {
    left.operator = 'IsTrue'
    left.value = undefined
  }
}

/**
 * Parse a term: either a parenthesized expression, a type-check function, or a simple condition.
 */
function parseTerm(tokens: Token[]): [Condition, Token[]] {
  if (tokens.length === 0) {
    throw new Error('Unexpected end of input')
  }

  const token = tokens[0]

  // Handle NOT as a prefix operator.
  if (token.value === 'NOT') {
    tokens.shift() // consume the NOT token
    const [term, remaining] = parseTerm(tokens)

    return [{ operator: 'Not', conditions: [term] }, remaining]
  }

  if (token.type === 'negate') {
    tokens.shift() // consume the negate token
    const [term, remaining] = parseTerm(tokens)
    if (negateCondition(term)) return [term, remaining]
  }

  // Check for type-check function call.
  if (token.type === 'identifier' && typeCheckFunctions.has(token.value)) {
    tokens.shift() // consume the function name token
    return parseTypeCheckCondition(token, tokens)
  }

  // Handle parenthesized expressions.
  if (token.type === 'paren' && token.value === '(') {
    tokens.shift() // consume '('
    const [expr, remaining] = parseExpression(tokens)
    if (remaining.length === 0 || remaining[0].type !== 'paren' || remaining[0].value !== ')') {
      throw new Error('Expected closing parenthesis')
    }
    remaining.shift() // consume ')'
    return [expr, remaining]
  }

  // Fallback to parsing a simple condition.
  return parseSimpleCondition(tokens)
}

/**
 * Parse a type-check condition.
 * Expects a token already consumed for the function name (e.g., IsNull) and then:
 *   '(' <property> ')'
 * Returns a Condition with operator equal to the function name and the property (with "$." stripped if present).
 */
function parseTypeCheckCondition(firstToken: Token, tokens: Token[]): [Condition, Token[]] {
  const openParen = tokens.shift()
  if (!openParen || openParen.type !== 'paren' || openParen.value !== '(') {
    throw new Error(`Expected '(' after type check function ${firstToken.value}`)
  }
  const propToken = tokens.shift()
  if (!propToken || propToken.type !== 'identifier') {
    throw new Error(`Expected property identifier inside ${firstToken.value}()`)
  }
  const property = propToken.value.startsWith('$.') ? propToken.value.slice(2) : propToken.value
  const closeParen = tokens.shift()
  if (!closeParen || closeParen.type !== 'paren' || closeParen.value !== ')') {
    throw new Error(`Expected ')' after property in ${firstToken.value}()`)
  }
  return [{ operator: firstToken.value as ConditionOperator, property } as Condition, tokens]
}


/**
 * Parse a simple condition in the form: identifier operator value.
 * Supports special syntax for BETWEEN, IN, and LIKE.
 */
function parseSimpleCondition(tokens: Token[]): [Condition, Token[]] {
  // Expect an identifier (property)
  const identifierToken = tokens.shift()
  if (!identifierToken || identifierToken.type !== 'identifier' ) {
    throw new Error('Expected property identifier')
  }

  const property = identifierToken.value.startsWith('$.') ? identifierToken.value.slice(2) : identifierToken.value

  if (tokens.length === 0) {
    throw new Error('Expected operator after property')
  }

  const opToken = tokens.shift()!
  if (opToken.value === 'NOT') {
    tokens.splice(0, 0, identifierToken)
    const [expr, rem] = parseSimpleCondition(tokens)
    if (negateCondition(expr)) return [expr, rem]
  } else if (opToken.type !== 'operator') {
    throw new Error('Expected operator token')
  }
  const opValue = opToken.value.toUpperCase()

  // Handle quantifier operators ANY and ALL.
  if (opValue === 'ANY' || opValue === 'ALL') {
    if (tokens.length === 0 || tokens[0].type !== 'paren' || tokens[0].value !== '(') {
      throw new Error(`Expected '(' after quantifier operator ${opValue}`)
    }
    tokens.shift() // consume '('
    const [expr, rem] = parseExpression(tokens)
    if (rem.length === 0 || rem[0].type !== 'paren' || rem[0].value !== ')') {
      throw new Error(`Expected closing ')' for quantifier operator ${opValue} -218`)
    }
    rem.shift() // consume ')'
    // Return condition with quantifier operator.
    // Capitalize first letter: "Any" or "All"
    const quantOp = opValue.charAt(0) + opValue.slice(1).toLowerCase()
    return [{ operator: quantOp as ConditionOperator, property, conditions: [expr] } as Condition, rem]
  }

  // Special handling for BETWEEN, IN, and LIKE
  if (opValue === 'BETWEEN') {
    // Expect: <property> BETWEEN <lowerValue> AND <upperValue>
    const lowerToken = tokens.shift()
    if (!lowerToken || (lowerToken.type !== 'literal' && lowerToken.type !== 'identifier')) {
      throw new Error('Expected literal or identifier for lower bound in BETWEEN -232')
    }
    const lower = parseValue(lowerToken.value)
    const andToken = tokens.shift()
    if (!andToken || andToken.type !== 'logical' || andToken.value !== 'AND') {
      throw new Error('Expected AND in BETWEEN expression -237')
    }
    const upperToken = tokens.shift()
    if (!upperToken || (upperToken.type !== 'literal' && upperToken.type !== 'identifier')) {
      throw new Error('Expected literal or identifier for upper bound in BETWEEN -241')
    }
    const upper = parseValue(upperToken.value)
    return [{ operator: 'Between', property, value: [lower, upper] }, tokens]
  } else if (opValue === 'IN') {
    // Expect: <property> IN ( <value1>, <value2>, ... )
    if (tokens.length === 0 || tokens[0].type !== 'paren' || tokens[0].value !== '(') {
      throw new Error("Expected '(' after IN")
    }
    tokens.shift() // consume '('
    const inValues: Array<string | number | boolean | Date> = []
    while (tokens.length > 0) {
      // @ts-ignore
      if (tokens[0].type === 'paren' && tokens[0].value === ')') {
        tokens.shift() // consume ')'
        break
      }
      const valToken = tokens.shift()!
      if (valToken.type === 'comma') continue
      if (valToken.type !== 'literal' && valToken.type !== 'identifier') {
        throw new Error('Expected literal or identifier in IN list -261')
      }
      inValues.push(parseValue(valToken.value))
    }
    return [{ operator: 'In', property, value: inValues }, tokens]
  } else if (opValue === 'LIKE') {
    // Expect: <property> LIKE <pattern>
    const patternToken = tokens.shift()
    if (!patternToken || (patternToken.type !== 'literal' && patternToken.type !== 'identifier')) {
      throw new Error('Expected literal or identifier for LIKE pattern -270')
    }
    const pattern = parseValue(patternToken.value)
    return [{ operator: 'Like', property, value: pattern }, tokens]
  } else {
    // For other operators, simply parse the next token as a value.
    const valueToken = tokens.shift()
    if (!valueToken || (valueToken.type !== 'literal' && valueToken.type !== 'identifier')) {
      throw new Error('Expected literal or identifier for value -278')
    }
    const value = parseValue(valueToken.value)
    return [{ operator: mapOperator(opValue), property, value } as Condition, tokens]
  }
}

/**
 * Map a raw operator string to a ConditionOperator.
 */
function mapOperator(op: string): ConditionOperator {
  switch (op) {
    case '==':
      return 'EqualTo'
    case '!=':
      return 'NotEqualTo'
    case '>':
      return 'GreaterThan'
    case '<':
      return 'LessThan'
    case '>=':
      return 'GreaterThanOrEqualTo'
    case '<=':
      return 'LessThanOrEqualTo'
    case '~':
      return 'In' // legacy syntax for IN if needed
    case 'STARTSWITH':
      return 'StartsWith'
    case 'ENDSWITH':
      return 'EndsWith'
    default:
      throw new Error(`Unknown operator: ${op}`)
  }
}

/**
 * Parse a literal token into the appropriate type.
 */
function parseValue(tokenValue: string): string | number | boolean | Date {
  if ((tokenValue.startsWith("'") && tokenValue.endsWith("'")) || (tokenValue.startsWith('"') && tokenValue.endsWith('"')) || (tokenValue.startsWith('`') && tokenValue.endsWith('`'))) {
    return tokenValue.slice(1, -1)
  }
  if (!isNaN(Number(tokenValue))) {
    return Number(tokenValue)
  }
  if (tokenValue.toLowerCase() === 'true') return true
  if (tokenValue.toLowerCase() === 'false') return false
  return tokenValue
}

/**
 * Main parse function that converts an input string into a Condition.
 */
export function parse(input: string): Condition {
  const tokens = tokenize(input)
  const [condition, remaining] = parseExpression(tokens)
  if (remaining.length > 0) {
    throw new Error('Unexpected tokens remaining: ' + JSON.stringify(remaining))
  }
  return condition
}
