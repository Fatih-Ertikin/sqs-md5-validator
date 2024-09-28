# SQS MD5 Validator

![header](docs/images/banner.svg)

![npm](https://img.shields.io/npm/dt/sqs-md5-)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/fatih-ertikin/sqs-md5-validator/publish.yml)

## Overview

The SQS MD5 Validator is a tool designed to ensure the integrity of messages sent and received through Amazon Simple Queue Service (SQS). It calculates and verifies the MD5 hash of message bodies and message attributes to confirm that the content has not been altered during transmission.

For message attributes itt does this by implementing the algorithm AWS specifies in [their documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html).

[algorithm](docs/images/algorithm.png)

Then the MD5 hash is calculated and compared to the MD5 hash AWS sent as part of the SQS message ("MD5OfMessageAttributes"). If these match the message attributes are considered valid and the integrity is guaranteed.

For the message body no special algorithm is used but the message body is hashed (md5) and again compared to the hash AWS sent as part of the message ("MD5OfBody" property). If these match, the body is considered valid and the integrity is guaranteed.

An SQS message is considered valid & the integrity proven if the body hash comparision matches AND the message attributes hash comparision matches. If no Message Attributes are sent, the hash comparision for message attributes it skipped.

## Features

- Validate SQS Messages integrity
- Verify MD5 hashes for SQS messages (Body & Message Attributes)

## Installation

To install the SQS MD5 Validator via npm, run the following command:

```sh
npm install sqs-md5-validator
```

Make sure you have Node.js and npm installed on your machine. You can verify the installation by running:

```sh
node -v
npm -v
```

## Usage

To validate the integrity of an SQS message:

<p align="center">
  <img src="docs/images/example_1.png" width="800" alt="an image of a js script"/>
</p>

Also works with SQS message attributes (MessageAttributes property):

<p align="center">
  <img src="docs/images/example_2.png" width="800" alt="an image of a js script"/>
</p>

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on the GitHub repository.
