# Details

Date : 2022-05-03 01:18:06

Directory c:\Users\K\Desktop\gym-app\back\src

Total : 47 files,  3342 codes, 11 comments, 454 blanks, all 3807 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/app.test.ts](/src/app.test.ts) | TypeScript | 14 | 0 | 3 | 17 |
| [src/app.ts](/src/app.ts) | TypeScript | 35 | 0 | 6 | 41 |
| [src/config/config.ts](/src/config/config.ts) | TypeScript | 53 | 0 | 13 | 66 |
| [src/controllers/auth.controller.ts](/src/controllers/auth.controller.ts) | TypeScript | 100 | 0 | 16 | 116 |
| [src/controllers/comments.controller.ts](/src/controllers/comments.controller.ts) | TypeScript | 89 | 0 | 15 | 104 |
| [src/controllers/offers.controllers.ts](/src/controllers/offers.controllers.ts) | TypeScript | 47 | 0 | 6 | 53 |
| [src/controllers/ratings.controller.ts](/src/controllers/ratings.controller.ts) | TypeScript | 60 | 0 | 8 | 68 |
| [src/controllers/reservation.controller.ts](/src/controllers/reservation.controller.ts) | TypeScript | 294 | 0 | 37 | 331 |
| [src/controllers/subscriptions.controller.ts](/src/controllers/subscriptions.controller.ts) | TypeScript | 88 | 0 | 13 | 101 |
| [src/controllers/timetable.controller.test.ts](/src/controllers/timetable.controller.test.ts) | TypeScript | 208 | 0 | 33 | 241 |
| [src/controllers/timetable.controller.ts](/src/controllers/timetable.controller.ts) | TypeScript | 325 | 0 | 44 | 369 |
| [src/controllers/trainers.controller.ts](/src/controllers/trainers.controller.ts) | TypeScript | 29 | 0 | 4 | 33 |
| [src/controllers/users.controller.ts](/src/controllers/users.controller.ts) | TypeScript | 226 | 0 | 31 | 257 |
| [src/db/comments.operations.ts](/src/db/comments.operations.ts) | TypeScript | 91 | 0 | 7 | 98 |
| [src/db/connect.ts](/src/db/connect.ts) | TypeScript | 18 | 0 | 6 | 24 |
| [src/db/offers.operations.ts](/src/db/offers.operations.ts) | TypeScript | 65 | 0 | 7 | 72 |
| [src/db/ratings.operations.ts](/src/db/ratings.operations.ts) | TypeScript | 78 | 0 | 6 | 84 |
| [src/db/reservations.operations.ts](/src/db/reservations.operations.ts) | TypeScript | 175 | 0 | 11 | 186 |
| [src/db/roles.operations.ts](/src/db/roles.operations.ts) | TypeScript | 19 | 0 | 4 | 23 |
| [src/db/subscriptions.operations.ts](/src/db/subscriptions.operations.ts) | TypeScript | 75 | 10 | 7 | 92 |
| [src/db/timetables.operations.ts](/src/db/timetables.operations.ts) | TypeScript | 175 | 0 | 12 | 187 |
| [src/db/trainers.operations.ts](/src/db/trainers.operations.ts) | TypeScript | 120 | 0 | 9 | 129 |
| [src/db/users.operations.ts](/src/db/users.operations.ts) | TypeScript | 199 | 0 | 12 | 211 |
| [src/index.ts](/src/index.ts) | TypeScript | 4 | 0 | 2 | 6 |
| [src/jest.config.js](/src/jest.config.js) | JavaScript | 6 | 1 | 1 | 8 |
| [src/middleware/auth.middleware.ts](/src/middleware/auth.middleware.ts) | TypeScript | 98 | 0 | 8 | 106 |
| [src/middleware/reqBodyValidation.middleware.ts](/src/middleware/reqBodyValidation.middleware.ts) | TypeScript | 183 | 0 | 39 | 222 |
| [src/models/comment.model.ts](/src/models/comment.model.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [src/models/offer.model.ts](/src/models/offer.model.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/models/reservation.model.ts](/src/models/reservation.model.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/models/reservationWindow.model.ts](/src/models/reservationWindow.model.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [src/models/subscriptionType.model.ts](/src/models/subscriptionType.model.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [src/models/trainer.model.ts](/src/models/trainer.model.ts) | TypeScript | 7 | 0 | 2 | 9 |
| [src/models/user.model.ts](/src/models/user.model.ts) | TypeScript | 16 | 0 | 1 | 17 |
| [src/routes/auth.routes.ts](/src/routes/auth.routes.ts) | TypeScript | 26 | 0 | 6 | 32 |
| [src/routes/comments.routes.ts](/src/routes/comments.routes.ts) | TypeScript | 40 | 0 | 7 | 47 |
| [src/routes/offers.routes.ts](/src/routes/offers.routes.ts) | TypeScript | 36 | 0 | 8 | 44 |
| [src/routes/ratings.routes.ts](/src/routes/ratings.routes.ts) | TypeScript | 27 | 0 | 6 | 33 |
| [src/routes/reservation.routes.ts](/src/routes/reservation.routes.ts) | TypeScript | 54 | 0 | 9 | 63 |
| [src/routes/subscriptions.routes.ts](/src/routes/subscriptions.routes.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [src/routes/timetable.routes.ts](/src/routes/timetable.routes.ts) | TypeScript | 44 | 0 | 8 | 52 |
| [src/routes/trainers.routes.ts](/src/routes/trainers.routes.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [src/routes/users.routes.ts](/src/routes/users.routes.ts) | TypeScript | 65 | 0 | 12 | 77 |
| [src/utils/errors.ts](/src/utils/errors.ts) | TypeScript | 50 | 0 | 12 | 62 |
| [src/utils/jwt.ts](/src/utils/jwt.ts) | TypeScript | 20 | 0 | 4 | 24 |
| [src/utils/logger.ts](/src/utils/logger.ts) | TypeScript | 9 | 0 | 2 | 11 |
| [src/utils/responseCodes.ts](/src/utils/responseCodes.ts) | TypeScript | 5 | 0 | 1 | 6 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)