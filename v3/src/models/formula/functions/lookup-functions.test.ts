import { evaluate } from "../test-utils/formula-test-utils"

describe("lookupByIndex", () => {
  it("returns the value at the given constant index (1-based)", () => {
    expect(evaluate("lookupByIndex('Mammals', 'Mammal', 2)")).toEqual("Asian Elephant")
    expect(evaluate("lookupByIndex('Mammals', 'Mass', 2)")).toEqual("5000")
    expect(evaluate("lookupByIndex('Cats', 'PadColor', 5)")).toEqual("pink")
  })

  it("returns the value at the given evaluated index (1-based)", () => {
    expect(evaluate("lookupByIndex('Mammals', 'Mammal', caseIndex)", 1)).toEqual("Asian Elephant")
    expect(evaluate("lookupByIndex('Mammals', 'Mass', caseIndex)", 1)).toEqual("5000")
    expect(evaluate("lookupByIndex('Cats', 'PadColor', caseIndex)", 4)).toEqual("pink")
  })

  it("can be executed in the aggregate context", () => {
    expect(evaluate("mean(lookupByIndex('Mammals', 'LifeSpan', caseIndex))")).toBeCloseTo(24.85)
    // This might look like it doesn't make sense, but it ensures that when a single value is returned, it doesn't
    // cause an error when executed in the aggregate context.
    expect(evaluate("mean(lookupByIndex('Mammals', 'LifeSpan', 1))")).toBeCloseTo(70)
  })

  it("throws an error when number of arguments is wrong", () => {
    expect(() => evaluate("lookupByIndex('Mammals', 'LifeSpan')")).toThrow()
    expect(() => evaluate("lookupByIndex('Mammals', 'LifeSpan', 1, 2)")).toThrow()
  })

  it("throws an error when the first argument is not a string constant", () => {
    expect(() => evaluate("lookupByIndex(Mammals, 'LifeSpan', 1)")).toThrow()
  })

  it("throws an error when the second argument is not a string constant", () => {
    expect(() => evaluate("lookupByIndex('Mammals', LifeSpan, 1)")).toThrow()
  })

  it("throws an error when attribute is not found", () => {
    expect(() => evaluate("lookupByIndex('Mammals', 'NotExistingAttribute', 1)")).toThrow()
  })
})

describe("lookupByKey", () => {
  it("returns the value for which the key attribute matches the given constant value", () => {
    expect(evaluate("lookupByKey('Mammals', 'Mammal', 'Diet', 'meat')")).toEqual("Big Brown Bat")
    expect(evaluate("lookupByKey('Cats', 'Name', 'TailLength', 7)")).toEqual("Fire Smoke")
    expect(evaluate("lookupByKey('Cats', 'Name', 'TailLength', '7')")).toEqual("Fire Smoke")
  })

  it("returns the value for which the key attribute matches the given evaluated value", () => {
    // A few cases in Mammals and Cats have the same Mass and Weight, so we can use them to test more advanced
    // way of lookupByKey usage.
    expect(evaluate("lookupByKey('Cats', 'Name', 'Weight', Mass)", 0)).toEqual("")
    expect(evaluate("lookupByKey('Cats', 'Name', 'Weight', Mass)", 18)).toEqual("Nancy Blue")
    expect(evaluate("lookupByKey('Cats', 'Name', 'Weight', Mass)", 19)).toEqual("Chubbs")
  })

  it("can be executed in the aggregate context", () => {
    expect(evaluate("mean(lookupByKey('Mammals', 'LifeSpan', 'Mass', Mass))")).toBeCloseTo(21.85)
    // This might look like it doesn't make sense, but it ensures that when a single value is returned, it doesn't
    // cause an error when executed in the aggregate context.
    expect(evaluate("mean(lookupByKey('Mammals', 'LifeSpan', 'Diet', 'meat'))")).toEqual(19)
  })

  it("throws an error when number of arguments is wrong", () => {
    expect(() => evaluate("lookupByKey('Mammals', 'Mammal', 'Diet')")).toThrow()
    expect(() => evaluate("lookupByKey('Mammals', 'Mammal', 'Diet', 'meat', 123)")).toThrow()
  })

  it("throws an error when the first argument is not a string constant", () => {
    expect(() => evaluate("lookupByKey(Mammals, 'Mammal', 'Diet', 'meat')")).toThrow()
  })

  it("throws an error when the second argument is not a string constant", () => {
    expect(() => evaluate("lookupByKey('Mammals', Mammal, 'Diet', 'meat')")).toThrow()
  })

  it("throws an error when the third argument is not a string constant", () => {
    expect(() => evaluate("lookupByKey('Mammals', 'Mammal', Diet, 'meat')")).toThrow()
  })

  it("throws an error when attribute is not found", () => {
    expect(() => evaluate("lookupByKey('Mammals', 'NotExistingAttribute', 'Diet', 'meat')")).toThrow()
    expect(() => evaluate("lookupByKey('Mammals', 'Mammal', 'NotExistingAttribute', 'meat')")).toThrow()
  })
})
