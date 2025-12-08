# Naflows 2FA Module
This module provides Two-Factor Authentication (2FA) capabilities for the Naflows authentication system. It enhances security by requiring users to provide a second form of verification in addition to their password.

## Method
* Creates a 2FA request for the user based on its context
* Wait for the user to ask for the 2FA code verification
* Creates, send, store the 2FA code
* User inputs the received code
* Verifies the code
* Returns the result of the verification (success/failure)