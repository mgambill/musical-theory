import { test, expect, describe } from 'vitest'
import { ConditionRunner } from '../ConditionRunner'
import { condition, expressionParser, rule } from '../'
import { applyModifiers, getValueByPath, modifiers } from '../utils'
import { conditionRunnerDefinitions as definition } from '../ConditionRunner'

const runner = new ConditionRunner(definition)

const rules = [
  rule({
    label: 'age-check',
    trigger: 'milestone',
    condition: condition({
      key: 'age-check',
      property: 'dob.age()',
      operator: 'LessThanOrEqualTo',
      value: 18,
    }),
    actions: [
      {
        type: 'alert',
        message: 'You must be at least 18 years old to apply for naturalization. Please contact us for assistance.',
        exit: true,
      },
    ],
  }),
  rule({
    label: 'crime-check',
    trigger: 'milestone',
    condition: condition({
      key: 'crime-check',
      property: 'crime',
      operator: 'IsTrue',
    }),
    actions: [
      {
        type: 'alert',
        message: 'Criminal records are not eligible for this application.',
        exit: true,
      },
    ],
  }),
]

test('modifiers correct', () => {
  expect(runner.modifiers).toMatchSnapshot()
})

describe('rule 1', () => {
  const cond = condition({
    key: 'age-check',
    property: 'dob.age()',
    operator: 'LessThanOrEqualTo',
    value: 18,
    when: expressionParser('IsDefined(dob)'),
  })

  test('`when` constraint not met', () => {
    // Create a ConditionRunnerDefinition with sample handlers and modifiers
    const datasource = {}
    const result = runner.evaluate(datasource, cond)

    expect(result[0].result).toBe(null)
  })

  test('`when` constraint met; rule failed', () => {
    // Create a ConditionRunnerDefinition with sample handlers and modifiers
    const datasource = { dob: '2000-01-01' }
    const result = runner.evaluate(datasource, cond)

    expect(result[0].result).toBe(false)
  })

  test('`when` constraint met; rule passed', () => {
    // Create a ConditionRunnerDefinition with sample handlers and modifiers
    const datasource = { dob: '2022-01-01' }
    const result = runner.evaluate(datasource, cond)

    expect(result[0].result).toBe(true)
  })
})

describe('condition boolean', () => {
  const cond = condition({
    key: 'crime-check',
    property: 'crime',
    operator: 'IsTrue',
  })

  test('result is null, when input is null or undefined', () => {
    // Create a ConditionRunnerDefinition with sample handlers and modifiers
    const datasource = { crime: undefined }
    const result = runner.evaluate(datasource, cond!)

    expect(result[0].result).toBe(false)
  })

  test('`when` constraint met; rule passed', () => {
    // Create a ConditionRunnerDefinition with sample handlers and modifiers
    const datasource = { crime: false }
    const result = runner.evaluate(datasource, cond!)

    expect(result[0].result).toBe(false)
  })

  test('`when` constraint met; rule passed', () => {
    // Create a ConditionRunnerDefinition with sample handlers and modifiers
    const datasource = { crime: true }
    const result = runner.evaluate(datasource, cond!)

    expect(result[0].result).toBe(true)
  })
})

describe('undefined dataset objects', () => {
  const datasource = {
    gender: [],
    marital: [],
  }

  const result = runner.evaluate(datasource, ...rules.map((x) => x.condition!))

  test('result', () => {
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "result": false,
          "source": {
            "key": "age-check",
            "operator": "LessThanOrEqualTo",
            "property": "dob.age()",
            "value": 18,
          },
        },
        {
          "result": false,
          "source": {
            "key": "crime-check",
            "operator": "IsTrue",
            "property": "crime",
          },
        },
      ]
    `)
  })

  test('age check', () => {
    expect(result[0].result).toBe(false)
  })

  test('crime check', () => {
    expect(result[1].result).toBe(false)
  })
})

describe('undefined dataset objects', () => {
  const datasource = {
    gender: [],
    marital: [],
  }

  const result = runner.evaluate(datasource, ...rules)

  test('result', () => {
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "result": false,
          "source": {
            "actions": [
              {
                "exit": true,
                "message": "You must be at least 18 years old to apply for naturalization. Please contact us for assistance.",
                "type": "alert",
              },
            ],
            "condition": {
              "key": "age-check",
              "operator": "LessThanOrEqualTo",
              "property": "dob.age()",
              "value": 18,
            },
            "label": "age-check",
            "trigger": "milestone",
          },
        },
        {
          "result": false,
          "source": {
            "actions": [
              {
                "exit": true,
                "message": "Criminal records are not eligible for this application.",
                "type": "alert",
              },
            ],
            "condition": {
              "key": "crime-check",
              "operator": "IsTrue",
              "property": "crime",
            },
            "label": "crime-check",
            "trigger": "milestone",
          },
        },
      ]
    `)
  })

  test('age check', () => {
    expect(result[0].result).toBe(false)
  })

  test('crime check', () => {
    expect(result[1].result).toBe(false)
  })
})

describe('rulset handling', () => {
  const datasource = {
    gender: [],
    marital: [],
    crime: false,
    dob: '2000-03-05T05:00:00.000Z',
  }

  const result = runner.evaluate(datasource, ...rules)

  test('runner modifiers', () => {
    expect(runner.modifiers).toMatchInlineSnapshot(`
      Map {
        "length" => {
          "canModify": [Function],
          "value": [Function],
        },
        "toLowerCase" => {
          "canModify": [Function],
          "value": [Function],
        },
        "toUpperCase" => {
          "canModify": [Function],
          "value": [Function],
        },
        "age" => {
          "canModify": [Function],
          "value": [Function],
        },
      }
    `)
  })

  test('getValueByPath', () => {
    let [value, modifiers] = getValueByPath(datasource, 'dob.age()', runner.modifiers)
    expect(modifiers).toMatchInlineSnapshot(`
      [
        {
          "args": [],
          "key": "age",
        },
      ]
    `)

    expect(value).toMatch(datasource.dob)

    const age = applyModifiers(runner.modifiers, value, [{ key: 'age', args: [new Date('2025-03-05T05:00:00.000Z')] }])
    expect(age).toBe(25)
  })

  test('age check', () => {
    expect(result[0].result).toBe(false)
  })

  test('crime check', () => {
    expect(result[1].result).toBe(false)
  })

  test('filter', () => {
    const datasource2 = {
      gender: [],
      marital: [],
      crime: true,
      dob: '2020-03-05T05:00:00.000Z',
    }
    const result2 = runner.filter(Object.values(datasource2), ...rules)

    expect(result2).toMatchSnapshot()
  })
})
