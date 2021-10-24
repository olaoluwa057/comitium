```shell script
  Diamond
    General tests
      ✓ should be deployed
    DiamondLoupe
      ✓ has correct facets
      ✓ has correct function selectors linked to facet
      ✓ associates selectors correctly to facets
      ✓ returns correct response when facets() is called
    DiamondCut
      ✓ fails if not called by contract owner
      ✓ allows adding new functions (108ms)
      ✓ allows replacing functions (67ms)
      ✓ allows removing functions (73ms)
    ownership
      ✓ returns owner
      ✓ reverts if transferOwnership not called by owner
      ✓ reverts if transferOwnership called with same address
      ✓ allows transferOwnership if called by owner

  Comitium
    General tests
      ✓ should be deployed
    deposit
      ✓ reverts if called with 0
      ✓ reverts if user did not approve token
      ✓ calls registerUserAction on rewards contract
      ✓ stores the user balance in storage (40ms)
      ✓ transfers the user balance to itself (41ms)
      ✓ updates the total of fdt locked (41ms)
      ✓ updates the delegated user's voting power if user delegated his balance (75ms)
      ✓ works with multiple deposit in same block (71ms)
      ✓ does not fail if rewards contract is set to address(0) (48ms)
    depositAndLock
      ✓ calls deposit and then lock (45ms)
    balanceAtTs
      ✓ returns 0 if no checkpoint
      ✓ returns 0 if timestamp older than first checkpoint
      ✓ return correct balance if timestamp newer than latest checkpoint (42ms)
      ✓ returns correct balance if timestamp between checkpoints (86ms)
    fdtStakedAtTs
      ✓ returns 0 if no checkpoint
      ✓ returns 0 if timestamp older than first checkpoint
      ✓ returns correct balance if timestamp newer than latest checkpoint
      ✓ returns correct balance if timestamp between checkpoints (87ms)
    withdraw
      ✓ reverts if called with 0
      ✓ reverts if user does not have enough balance
      ✓ calls registerUserAction on rewards contract (44ms)
      ✓ sets user balance to 0 (61ms)
      ✓ does not affect old checkpoints (73ms)
      ✓ transfers balance to the user (71ms)
      ✓ updates the total of fdt locked (62ms)
      ✓ updates the delegated user's voting power if user delegated his balance (77ms)
    lock
      ✓ reverts if timestamp is more than MAX_LOCK (61ms)
      ✓ reverts if user does not have balance
      ✓ reverts if user already has a lock and timestamp is lower (57ms)
      ✓ sets lock correctly (49ms)
      ✓ allows user to increase lock (63ms)
      ✓ does not block deposits for user (81ms)
      ✓ blocks withdrawals for user during lock (90ms)
    multiplierAtTs
      ✓ returns expected multiplier (54ms)
    votingPower
      ✓ returns raw balance if user did not lock (38ms)
      ✓ returns adjusted balance if user locked fdt (51ms)
    votingPowerAtTs
      ✓ returns correct balance with no lock (80ms)
      ✓ returns correct balance with lock (86ms)
      ✓ returns voting power with decaying bonus (102ms)
    delegate
      ✓ reverts if user delegates to self
      ✓ reverts if user does not have balance (56ms)
      ✓ sets the correct voting powers for delegate and delegatee (55ms)
      ✓ sets the correct voting power if delegatee has own balance (89ms)
      ✓ sets the correct voting power if delegatee receives from multiple users (137ms)
      ✓ records history of delegated power (173ms)
      ✓ does not modify user balance (53ms)
      ✓ works with multiple calls in the same block (75ms)
    stopDelegate
      ✓ removes delegated voting power from delegatee and returns it to user (78ms)
      ✓ preserves delegate history (72ms)
      ✓ does not change any other delegated balances for the delegatee (116ms)
    events
      ✓ emits Deposit on call to deposit()
      ✓ emits Deposit & DelegatedPowerIncreased on call to deposit() with delegated power (66ms)
      ✓ emits Withdraw on call to withdraw() (50ms)
      ✓ emits Withdraw & DelegatedPowerDecreased on call to withdraw() with delegated power (66ms)
      ✓ emits correct events on delegate (83ms)
      ✓ emits Lock event on call to lock() (45ms)
    multiplierOf
      ✓ returns the current multiplier of the user (53ms)

  Rewards
    General
      ✓ should be deployed
      ✓ sets correct owner
      ✓ can set pullTokenFrom if called by owner
      ✓ sanitizes the parameters on call to setPullToken (101ms)
      ✓ can set comitium address if called by owner
      ✓ reverts if setComitium called with 0x0
    ackFunds
      ✓ calculates the new multiplier when funds are added (67ms)
      ✓ does not change multiplier on funds balance decrease but changes balance (78ms)
    registerUserAction
      ✓ can only be called by comitium
      ✓ does not pull fdt if function is disabled (73ms)
      ✓ does not pull fdt if already pulled everything (58ms)
      ✓ updates the amount owed to user but does not send funds
    claim
      ✓ reverts if user has nothing to claim
      ✓ transfers the amount to user (66ms)
      ✓ works with multiple users (106ms)
      ✓ works fine after claim (157ms)


  87 passing (7s)

✨  Done in 12.40s.
```
