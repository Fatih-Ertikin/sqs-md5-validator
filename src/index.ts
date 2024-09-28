import type { MessageAttributeValue } from "@aws-sdk/client-sqs";

export function encodeSQSMessageAttribute(
  attributeName: string,
  attributeValue: MessageAttributeValue
) {
  const NAME_LENGTH = 4;
  const DATE_TYPE_LENGTH = 4;
  const VALUE_LENGTH = 4;
  const TRANSPORT_TYPE_LENGTH = 1;

  const TRANSPORT_TYPE_VALUE_BINARY = 2;
  const TRANSPORT_TYPE_VALUE_STRING_OR_NUMBER = 1;

  const { DataType, BinaryValue, StringValue } = attributeValue;

  // Data type must be present, and either binary or string value must be present
  if (!DataType || (!BinaryValue && !StringValue)) {
    throw new Error(
      "Tried to encode AWS SQS message attribute but message has incorrect fields"
    );
  }

  const isBinary = !!(BinaryValue && !StringValue);
  const isString = !!(StringValue && !BinaryValue);

  if (!isBinary && !isString) {
    throw new Error(
      "Could not determine AWS SQS Message attribute type during encoding"
    );
  }

  const Name = attributeName;

  // 1. encode attribute name length & name itself
  const name = Buffer.from(attributeName, "utf-8");
  const nameLength = Buffer.alloc(NAME_LENGTH);
  nameLength.writeUInt32BE(Name.length);

  // 2. encode datatype length & datatype itself
  const type = Buffer.from(DataType, "utf8");
  const typeLength = Buffer.alloc(DATE_TYPE_LENGTH);
  typeLength.writeUInt32BE(DataType.length);

  const getBuffers = () => {
    if (isBinary) {
      // 3. encode value of the transport type
      const transporter = Buffer.alloc(TRANSPORT_TYPE_LENGTH);
      transporter.writeUInt8(TRANSPORT_TYPE_VALUE_BINARY);

      // 4. encode the actual binary value
      const value = Buffer.from(BinaryValue);
      const valueLength = Buffer.alloc(VALUE_LENGTH);
      valueLength.writeUInt32BE(value.byteLength);
      return {
        value,
        valueLength,
        transporter,
      };
    }

    if (isString) {
      // 3. encode value of the transport type
      const transporter = Buffer.alloc(TRANSPORT_TYPE_LENGTH);
      transporter.writeUInt8(TRANSPORT_TYPE_VALUE_STRING_OR_NUMBER);

      // 4. encode the actual binary value
      const value = Buffer.from(StringValue, "utf-8");
      const valueLength = Buffer.alloc(VALUE_LENGTH);
      valueLength.writeUInt32BE(StringValue.length);

      return {
        value,
        valueLength,
        transporter,
      };
    }

    throw new Error(
      "Could not determine data type of AWS SQS message attribute during encoding"
    );
  };

  const { transporter, value, valueLength } = getBuffers();

  return Buffer.concat([
    nameLength,
    name,
    typeLength,
    type,
    transporter,
    valueLength,
    value,
  ]);
}
