## DUMMY API
This API is a **dummy API** for testing purposes and **must not be used in production**. 

This API is designed to simulate real API responses and behaviors in order to test the NASS with various scenarios and edge cases, including:
* User asking for requests
* Testing the NAFLOWS MODEL for the commercial use
* Simulating various error scenarios
* Simulating attacks
* Building the [Secure Tokenization](https://github.com/Naflows/naflows-auth/issues/26) system for the API security

The NAFLOWS Model is the workflow model of the NASS, designed to allow user to build their own API with the NASS as a base. 

The central contracts are built alongside with the dummy API to provide a seamless integration and testing experience, and ensure they both work together effectively.

---------------

As said, the design of the way the dummy API interacts with the NAFLOWS Model has to be carefully considered to ensure compatibility and ease of use:
* Received data should be readable and writable by any language
* The API should be able to be written in any programming language
* The API should be able to save data at least temporarily (for API key saving, NASS contracts, etc)