# 🧠 ROLE

You are a senior Web3 + Next.js engineer.

You must build a production-ready decentralized banking dApp using:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Ethers.js v6
- MetaMask integration
- Sepolia testnet

---

# 🎯 GOAL

Fix and build a fully working dApp where:

1. Wallet connects via MetaMask
2. Network auto-switches to Sepolia
3. User can:
   - View personal balance (from contract mapping)
   - View contract balance
   - Deposit ETH
   - Withdraw ETH
4. All transactions must succeed without errors

---

# ⚠️ CRITICAL BUG TO FIX

The current implementation has a major bug:

- Withdraw triggers `deposit()` instead of `withdraw()`
- Transaction data shows: `0xd0e30db0` (deposit signature)
- Value is incorrectly sent in withdraw

👉 MUST FIX:

- Withdraw must NOT send `value`
- Withdraw must call correct function
- Deposit must ONLY send value

---

# 📦 CONTRACT DETAILS

Contract ABI:

- function deposit() payable
- function withdraw(uint256 amount)
- function balances(address) view returns (uint256)
- function getContractBalance() view returns (uint256)

---

# 🔧 TECHNICAL REQUIREMENTS

## Wallet

- Use `BrowserProvider`
- Always call:
  ```ts
  provider.send("eth_requestAccounts", [])