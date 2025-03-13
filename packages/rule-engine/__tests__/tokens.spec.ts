import { test, assert, expect } from "vitest";
import {
  IsFalse,
  IsTrue,
  IsUndefined,
  IsDefined,
  IsNull,
  NotNull,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  EqualTo,
  NotEqualTo,
  Contains,
  NotContains
} from "../tokens"; // Adjust path if needed

// Boolean Checks
test("IsFalse correctly identifies false values", () => {
  expect(IsFalse.handler({ property: false })).toBe(true);
  expect(IsFalse.handler({ property: true })).toBe(false);
  expect(IsFalse.handler({ property: null })).toBe(false);
});

test("IsTrue correctly identifies true values", () => {
  expect(IsTrue.handler({ property: true })).toBe(true);
  expect(IsTrue.handler({ property: false })).toBe(false);
  expect(IsTrue.handler({ property: null })).toBe(false);
});

// Null & Undefined Checks
test("IsUndefined correctly identifies undefined values", () => {
  expect(IsUndefined.handler({ property: undefined })).toBe(true);
  expect(IsUndefined.handler({ property: null })).toBe(false);
  expect(IsUndefined.handler({ property: "value" })).toBe(false);
});

test("IsDefined correctly identifies defined values", () => {
  expect(IsDefined.handler({ property: "defined" })).toBe(true);
  expect(IsDefined.handler({ property: null })).toBe(true);
  expect(IsDefined.handler({ property: undefined })).toBe(false);
});

test("IsNull correctly identifies null values", () => {
  expect(IsNull.handler({ property: null })).toBe(true);
  expect(IsNull.handler({ property: undefined })).toBe(false);
  expect(IsNull.handler({ property: "value" })).toBe(false);
});

test("NotNull correctly identifies non-null values", () => {
  expect(NotNull.handler({ property: "defined" })).toBe(true);
  expect(NotNull.handler({ property: 0 })).toBe(true);
  expect(NotNull.handler({ property: null })).toBe(false);
});

// Comparison Operators
test("GreaterThan correctly compares numbers", () => {
  expect(GreaterThan.handler({ value: 5, property: 10 })).toBe(true);
  expect(GreaterThan.handler({ value: 10, property: 5 })).toBe(false);
});

test("GreaterThan correctly compares numbers", () => {
  expect(GreaterThan.handler({ value: 5, property: 10 })).toBe(true);
  expect(GreaterThan.handler({ value: 10, property: 5 })).toBe(false);
  expect(GreaterThan.handler({ value: 10, property: null})).toBe(false);
});

test("GreaterThanOrEqualTo correctly compares numbers", () => {
  expect(GreaterThanOrEqualTo.handler({ value: 10, property: 10 })).toBe(true);
  expect(GreaterThanOrEqualTo.handler({ value: 5, property: 10 })).toBe(true);
  expect(GreaterThanOrEqualTo.handler({ value: 10, property: 5 })).toBe(false);
  expect(GreaterThanOrEqualTo.handler({ value: 10, property: null})).toBe(false);
});

test("LessThan correctly compares numbers", () => {
  expect(LessThan.handler({ value: 10, property: 5 })).toBe(true);
  expect(LessThan.handler({ value: 5, property: 10 })).toBe(false);
  expect(LessThan.handler({ value: 5, property: null })).toBe(false);
});

test("LessThanOrEqualTo correctly compares numbers", () => {
  expect(LessThanOrEqualTo.handler({ value: 10, property: 10 })).toBe(true);
  expect(LessThanOrEqualTo.handler({ value: 10, property: 5 })).toBe(true);
  expect(LessThanOrEqualTo.handler({ value: 5, property: 10 })).toBe(false);
  expect(LessThanOrEqualTo.handler({ value: 5, property: null })).toBe(false);
});

test("EqualTo correctly compares values", () => {
  expect(EqualTo.handler({ value: 5, property: 5 })).toBe(true);
  expect(EqualTo.handler({ value: "test", property: "test" })).toBe(true);
  expect(EqualTo.handler({ value: "test", property: "TEST" })).toBe(false);
  expect(EqualTo.handler({ value: "test", property: null })).toBe(false);
});

test("NotEqualTo correctly identifies inequality", () => {
  expect(NotEqualTo.handler({ value: 5, property: 10 })).toBe(true);
  expect(NotEqualTo.handler({ value: "test", property: "test" })).toBe(false);
});

// String and Array Evaluations
test("Contains checks substring presence", () => {
  expect(Contains.handler({ value: "hello", property: "hello world" })).toBe(true);
  expect(Contains.handler({ value: "abc", property: "xyz" })).toBe(false);
});

test("NotContains checks absence of substring", () => {
  expect(NotContains.handler({ value: "hello", property: "hello world" })).toBe(false);
  expect(NotContains.handler({ value: "abc", property: "xyz" })).toBe(true);
  expect(NotContains.handler({ value: "abc", property: null })).toBe(true);
});

test("Contains checks values in an array", () => {
  expect(Contains.handler({ value: "apple", property: ["banana", "apple", "cherry"] })).toBe(true);
  expect(Contains.handler({ value: "grape", property: ["banana", "apple", "cherry"] })).toBe(false);
  expect(Contains.handler({ value: "grape", property: null })).toBe(false);
});

test("NotContains checks values not in an array", () => {
  expect(NotContains.handler({ value: "apple", property: ["banana", "apple", "cherry"] })).toBe(false);
  expect(NotContains.handler({ value: "grape", property: ["banana", "apple", "cherry"] })).toBe(true);
});
