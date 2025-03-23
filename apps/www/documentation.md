## WalletSheet Component Update

### Requirement
The `WalletSheet` component should display a placeholder link to "Buy BASEBUZZ" if the account does not have any BASEBUZZ tokens. Since the token is not yet deployed, if the response from the API is `null` (or similar, indicating the token is not available), the link should be displayed. Otherwise, the number of BASEBUZZ tokens should be displayed.

### Solution
The logic in the `WalletSheet` component was updated to handle cases where the `buzzBalance` is `null` or indicates that the token is not available. The condition now checks if `buzzBalance` is `null`, `0n`, or undefined. If any of these conditions are true, the "Buy BASEBUZZ" link is displayed. Otherwise, the formatted number of tokens is shown.


