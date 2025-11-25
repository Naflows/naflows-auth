
// This function is used as a callback for fetch errors during page initialization.
// In order to not harcode redirection logic in multiple places, this function centralizes
// the error handling and redirection to the login page.

export async function onFetchError(errorMessage : string) {
    console.log("Error initializing page:", errorMessage);
    window.location.href = "/login?redirect=" + window.location.pathname;
}