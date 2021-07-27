const Assert = require('assert')
const Seneca = require('seneca')
const TestHelpers = require('../../support/helpers')

const {
  make_seneca,
  register_user,
  login_user,
  register_and_login_user
} = TestHelpers

const make_add_bookmark = require('../../../srv/user/add_bookmark')


fdescribe('add bookmark', () => { // fcs
  describe('when the auth token is missing from the msg', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    it('shall not pass', async () => {
      const msg = {}
      const res = await add_bookmark.call(seneca, msg)

      expect(res).toEqual({ ok: false, why: 'unauthorized' })
    })
  })


  describe('when the auth token is invalid', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    it('shall not pass', async () => {
      await register_and_login_user({
        email: 'alice@example.com',
        pass: '012345678'
      }, { seneca })


      const msg = { auth_token: 'aleaiactaest' }
      const res = await add_bookmark.call(seneca, msg)


      expect(res).toEqual({ ok: false, why: 'unauthorized' })
    })
  })


  describe('when the package name is missing from the msg', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'


    it('responds with an error', async () => {
      const { auth_token } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      const msg = { auth_token }
      const res = await add_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['name'],
          why_exactly: 'required'
        }
      })
    })
  })


  describe('when a package with the name does not exist', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'


    it('does not bookmark it', async () => {
      const { auth_token } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      const msg = { auth_token, name: 'foobar' }
      const res = await add_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: false,
        why: 'not-found',
        details: { what: 'package' }
      })
    })
  })

  describe('when a package with the name exists', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'
    const pkg_name = 'express'


    it('bookmarks it', async () => {
      const { auth_token } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      await create_pkg({ name: pkg_name }, { seneca })


      const msg = { auth_token, name: pkg_name }
      const res = await add_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: true,
        data: { bookmark_id: jasmine.any(String) }
      })


      const { data: { bookmark_id } } = res

      Assert(bookmark_id, 'bookmark_id')


      const bookmark = await seneca.make('nodezoo', 'bookmark')
        .load$(bookmark_id)

      expect(bookmark).toEqual(jasmine.any(Object))
    })
  })


  describe('when the user has already bookmarked this package', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'
    const pkg_name = 'express'


    it('does nothing', async () => {
      const { auth_token, user } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      await create_pkg({ name: pkg_name }, { seneca })


      const { id: user_id } = user
      Assert(user_id, 'user.id')

      // TODO: Use a fixture.
      //
      await seneca.make('nodezoo', 'bookmark')
        .data$({
          owner_id: user_id,
          name: pkg_name
        })
        .save$()


      const msg = { auth_token, name: pkg_name }
      const res = await add_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: true,
        data: { bookmark_id: jasmine.any(String) }
      })


      const num_bookmarks = await seneca.make('nodezoo', 'bookmark')
        .list$({ all$: true })
        .then(xs => xs.length)

      expect(num_bookmarks).toEqual(1)
    })
  })

  describe('when another user has previously bookmarked this package', () => {
    const seneca = make_seneca()
    const add_bookmark = make_add_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'
    const pkg_name = 'express'


    it('bookmarks it', async () => {
      const { auth_token } = await register_and_login_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      const another_user = await register_user({
        email: 'alice@example.com',
        pass: '012345678'
      }, { seneca })


      await create_pkg({ name: pkg_name }, { seneca })


      const { id: another_user_id } = another_user
      Assert(another_user_id, 'another_user.id')

      // TODO: Use a fixture.
      //
      await seneca.make('nodezoo', 'bookmark')
        .data$({
          owner_id: another_user_id,
          name: pkg_name
        })
        .save$()


      const msg = { auth_token, name: pkg_name }
      const res = await add_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: true,
        data: { bookmark_id: jasmine.any(String) }
      })


      const num_bookmarks = await seneca.make('nodezoo', 'bookmark')
        .list$({ all$: true })
        .then(xs => xs.length)

      expect(num_bookmarks).toEqual(2)
    })
  })
})


// TODO: Replace with a fixture helper.
//
async function create_pkg(given_attrs, ctx) {
  const DEFAULT_ATTRS = {
    name: 'seneca',
    version: '1.0.0',
    giturl: null,
    desc: 'lorem ipsum',
    readme: 'lorem ipsum dolor sit amet'
  }

  Assert(given_attrs, 'given_attrs')
  const attrs = { ...DEFAULT_ATTRS, ...given_attrs }


  Assert(ctx, 'ctx')
  Assert(ctx.seneca, 'ctx.seneca')
  const { seneca } = ctx


  return seneca.make('nodezoo', 'npm')
    .data$(attrs)
    .save$()
}

