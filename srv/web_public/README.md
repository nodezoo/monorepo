





## Users - Step 1.

* Users accounts in sys/user (see https://github.com/senecajs/seneca-user)
* a list of repos per user in nodezoo/selection, maybe also some other entities for user stuff?
** use an owner field so that each user only see own data
** TABLE FIELDS: repo, owner, created, ...
* list of repos shows: info for each repo
** use case: richard wants to see the status of his seneca plugins
** use case: check that top 10 npm packages (most downloaded)
* it's "bookmarking" of repos
* basic CRUD functionality for adding/editing this list
* all operations must be possible via seneca-repl!
** represent the user activity/features with messages
*** do not expose entities! no exposed called to role:entity
* units tests with seneca-msg-test
* it is a service: user - add to model.jsonic in same as as npm, info, etc.

* actions: `role:user,scope:repo`
** list my repos
** show repo info
** add a repo (bookmark it)
** remove a repo (unbookmark) refinement
** bookmark all that match X, where X is 'all mine', '...other criteria', etc (optional - maybe a refinement)
** folders of repos! multiple lists, refinement!!!




## Web Server - Step 2.

* standard as possible so that the code is easy to understand
* express (dynamic and static)
* passportjs for auth - http://www.passportjs.org/
** https://davenash.com/2017/02/how-to-use-jwt-with-seneca-passport-and-express-on-nodejs/ ???
** https://github.com/senecajs/seneca-auth - maybe? or juse passport directly - OK - do this first! refine later
* basic auth - user login with email and password
** no registration! pre-register users with seneca-user















