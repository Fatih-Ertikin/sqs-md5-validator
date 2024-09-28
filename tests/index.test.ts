import { Message } from "@aws-sdk/client-sqs";
import { validateMessageIntegrity } from "../src";

test("validate SQS message integrity: Body & Message attributes", () => {
  // an actual message from SQS
  // hashes where calculated by AWS SQS
  const mockMessage: Message = {
    Body: '{"id":"3fba6d0e-3e34-451b-bb72-68b82722bb84","name":"Sample Object","description":"This is a sample object with a UUID and other properties"}',
    MD5OfBody: "179a301e5197c14045b2426393e4075e",
    MD5OfMessageAttributes: "288491795b52fd46fbb9c55a16ebe272",
    MessageAttributes: {
      test_binary_attr_key: {
        BinaryValue: new Uint8Array([211, 93, 53]),
        DataType: "Binary.test_bnr_custom_type",
      },
      test_custom_key: {
        DataType: "String",
        StringValue: "custom_value",
      },
      test_number_attr_key: {
        DataType: "Number.test_nmbr_custom_type",
        StringValue: "999",
      },
      test_string_attr_key: {
        DataType: "String.test_str_custom_type",
        StringValue: "test_string_value",
      },
    },
  };

  // validate the message integrity
  const isValid = validateMessageIntegrity(mockMessage);

  // message should be valid
  expect(isValid).toBe(true);
});

test("Validate SQS message integrity: Body Only", () => {
  // an actual message from SQS
  // hashes where calculated by AWS SQS
  const mockMessage: Message = {
    Body: '{"id":"3fba6d0e-3e34-451b-bb72-68b82722bb84","name":"Sample Object","description":"This is a sample object with a UUID and other properties"}',
    MD5OfBody: "179a301e5197c14045b2426393e4075e",
  };

  // validate the message integrity
  const isValid = validateMessageIntegrity(mockMessage);

  // message should be valid
  expect(isValid).toBe(true);
});

test("Validate SQS message integrity: Message Attributes Only", () => {
  // an actual message from SQS
  // hashes where calculated by AWS SQS
  const mockMessage: Message = {
    MD5OfMessageAttributes: "288491795b52fd46fbb9c55a16ebe272",
    MessageAttributes: {
      test_binary_attr_key: {
        BinaryValue: new Uint8Array([211, 93, 53]),
        DataType: "Binary.test_bnr_custom_type",
      },
      test_custom_key: {
        DataType: "String",
        StringValue: "custom_value",
      },
      test_number_attr_key: {
        DataType: "Number.test_nmbr_custom_type",
        StringValue: "999",
      },
      test_string_attr_key: {
        DataType: "String.test_str_custom_type",
        StringValue: "test_string_value",
      },
    },
  };

  // validate the message integrity
  const isValid = validateMessageIntegrity(mockMessage);

  // message should be valid
  expect(isValid).toBe(true);
});

test("Validate SQS message integrity: Empty Message", () => {
  // empty message, means nothing to verify or check
  const mockMessage: Message = {};

  // validate the message integrity
  const isValid = validateMessageIntegrity(mockMessage);

  // message should be valid
  expect(isValid).toBe(true);
});

test("Validate SQS message integrity: Compromised Message", () => {
  // an actual message from SQS
  // hashes where calculated by AWS SQS
  const mockMessage: Message = {
    Body: "SOmeBody",
    MD5OfBody: "SomeRandomMd5Hash",
    MD5OfMessageAttributes: "SomeRandomMd5Hash",
    MessageAttributes: {
      Key: {
        DataType: "String",
        StringValue: "Value",
      },
    },
  };

  // validate the message integrity
  const isValid = validateMessageIntegrity(mockMessage);

  // message should be valid
  expect(isValid).toBe(false);
});
