# 2026-07-18

## Completed
- Added database abstraction layer
- Implemented prepared statements
- Created `/testdb`
- Verified SQLite integration

## Issues Found
- Fixed `getuser` → `getUser` typo
- Fixed `guildId` variable typo

## Next Session
- Implement command/event loaders
- Begin spell-check engine

# 2026-07-26

## Completed
- Modular addition of the any future command
- Modular addition of any new event
- Dictionary has been properly integrated
- Verified that the bot detects typos and sends a snappy comeback

## Issues found
- Coding typos and errors, the usual ones
- Fixed the long chain of if-elses

## Next Session
- Implement global and server-wide whitelist to avoid slang etc
- Implement other quality of life improvements

# 2026-07-29

## Completed
- The bot is fully functional now
- Global Whitelist works
- Server-wise whitelist works
- Words can be added and removed

## Issues found
- So the Database didn't allow adding two typos in the same text, but the checker was doing that, so I fixed that using a dedupe

## Next Session
- Statistics section

# 2026-07-31

## Completed
- /stats, /leaderboard and /recent commands have been added

## Problems encountered
- /recent required a little bit of change in the databse.js file but nothing serious

## Next Session
- Enable/disable autocheck
- Channel immunity
- Role immunity